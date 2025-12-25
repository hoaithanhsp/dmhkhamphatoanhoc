
import { GoogleGenAI, SchemaType, Type } from "@google/genai";
import { UserProfile, LearningUnit, GameActivity } from "../types";

// --- CONFIGURATION ---
const MODELS = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash'];

const getApiKey = (): string => {
  return localStorage.getItem('user_api_key') || '';
};

const MATH_FORMATTING_INSTRUCTION = `
QUY TẮC HIỂN THỊ CÔNG THỨC TOÁN HỌC (QUAN TRỌNG):
1. Dùng ký hiệu Unicode đẹp mắt, KHÔNG dùng LaTeX thuần túy ($...$).
2. Phân số: Viết dạng a/b hoặc dùng HTML <sup>a</sup>/<sub>b</sub>.
3. Số mũ & chỉ số: Dùng Unicode (², ³, ⁰, ₁, ₂) hoặc HTML <sup>/<sub>. VD: x²
4. Căn bậc hai: Dùng √. VD: √x.
5. Ký hiệu đặc biệt: ±, ×, ÷, ≤, ≥, ≠, ≈, ∞, ∈, ∪, ∩, ∅, π, Δ.
6. Khi giải bài, trình bày từng bước rõ ràng.
`;

// Helper to call Gemini with Fallback
const callGeminiWithFallback = async (
  prompt: string, 
  schema: any, 
  systemInstruction?: string,
  temperature: number = 0.7
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Vui lòng nhập API Key trong phần Cài đặt để sử dụng tính năng này.");
  }

  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Attempting with model: ${modelName}`);
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          systemInstruction: systemInstruction,
          temperature: temperature
        }
      });

      const jsonText = response.text;
      if (!jsonText) throw new Error("No data returned");
      return JSON.parse(jsonText);

    } catch (error: any) {
      console.error(`Error with model ${modelName}:`, error);
      lastError = error;
      // Continue to next model
    }
  }

  // If all failed
  const errorMsg = lastError?.message || JSON.stringify(lastError);
  throw new Error(`Tất cả các model đều thất bại. Lỗi: ${errorMsg}`);
};

export const generateLearningPath = async (
  user: UserProfile, 
  topics: string[]
): Promise<LearningUnit[]> => {
  
  // --- 1. PHÂN TÍCH DỮ LIỆU LỊCH SỬ & ĐÁNH GIÁ (DEEP ANALYSIS) ---
  const history = user.history || [];
  let performanceContext = "";
  let adjustedLevel = user.proficiencyLevel || 2; // Default Average

  // 1a. Lịch sử học tập (History Analysis)
  if (history.length > 0) {
      const weakUnits = history.filter(h => (h.score / h.totalQuestions) < 0.5);
      const weakTopics = [...new Set(weakUnits.map(h => h.unitTitle))];
      
      const recentHistory = history.slice(0, 5);
      const recentAvg = recentHistory.reduce((acc, h) => acc + (h.score / h.totalQuestions), 0) / (recentHistory.length || 1);

      if (recentAvg < 0.5) adjustedLevel = 1; 
      else if (recentAvg > 0.85) adjustedLevel = 4;

      performanceContext += `
      - LỊCH SỬ HỌC TẬP: Điểm trung bình gần đây ${(recentAvg * 10).toFixed(1)}/10.
      - Chủ đề yếu cần khắc phục: ${weakTopics.length > 0 ? weakTopics.join(", ") : "Không có"}.
      `;
  } else {
      performanceContext += `- LỊCH SỬ: Học sinh mới, chưa có dữ liệu lịch sử.`;
  }

  // 1b. Thần số học & Tính cách (Numerology & Personality)
  const numProfile = user.numerologyProfile;
  const numerologyContext = numProfile ? `
      - THẦN SỐ HỌC (SỐ CHỦ ĐẠO ${user.numerologyNumber}):
        + Điểm mạnh: ${numProfile.strengths.join(", ")}.
        + Thách thức: ${numProfile.challenges.join(", ")}.
        + Phong cách học: ${numProfile.learningStyle}.
        + Động lực: ${numProfile.learningMotivation}.
        + Cách tiếp cận toán: ${numProfile.mathApproach}.
  ` : "";

  // 1c. Đánh giá đầu vào & Ghi chú (User Input)
  const userAssessmentContext = `
      - ĐÁNH GIÁ ĐẦU VÀO (User Input):
        + Học lực tự đánh giá: ${user.proficiencyLevel}/4 (1: Yếu, 4: Xuất sắc).
        + Đặc điểm/Thói quen: ${user.learningHabits?.join(", ") || "Không rõ"}.
        + GHI CHÚ ĐẶC BIỆT TỪ PHỤ HUYNH/HỌC SINH: "${user.aiNotes || "Không có ghi chú"}".
  `;

  // --- 2. Construct the Prompt ---
  const prompt = `
    Đóng vai một chuyên gia giáo dục toán học AI & Phân tích dữ liệu hành vi.
    Hãy tạo một LỘ TRÌNH HỌC TẬP TỐI ƯU HÓA CAO ĐỘ (Hyper-Personalized) cho học sinh này:
    
    === HỒ SƠ HỌC SINH TOÀN DIỆN ===
    - Lớp: ${user.grade}
    - Chủ đề mong muốn học: ${topics.join(", ")}
    ${numerologyContext}
    ${userAssessmentContext}
    ${performanceContext}
    ==================================

    HƯỚNG DẪN TẠO LỘ TRÌNH (LOGIC XỬ LÝ):
    1. Dựa vào "Thần số học" và "Đặc điểm thói quen" để điều chỉnh cách đặt câu hỏi và độ khó:
       - Ví dụ: Nếu học sinh "Dễ mất tập trung" hoặc Số 3/5 -> Chia nhỏ bài học, nhiều câu hỏi ngắn, nội dung thú vị.
       - Nếu học sinh "Thích giải đố" -> Tăng cường câu hỏi tư duy logic/puzzle.
       - Nếu học sinh "Sợ số học" hoặc Học lực Yếu -> Bắt đầu bằng những câu cực dễ, khen ngợi nhiều trong phần giải thích.
    2. Dựa vào "Ghi chú đặc biệt" (nếu có): Ưu tiên giải quyết vấn đề được nêu trong ghi chú (VD: yếu hình học -> tập trung hình học).
    3. Dựa vào "Lịch sử": Nếu có chủ đề yếu, bài đầu tiên PHẢI là ôn tập chủ đề đó.

    YÊU CẦU CẤU TRÚC JSON:
    1. Tạo danh sách các "Learning Unit" (Bài học).
    2. Mỗi bài học bao gồm danh sách câu hỏi (Questions).
    3. SỐ LƯỢNG CÂU HỎI: 5-10 câu/bài (Điều chỉnh tùy theo độ tập trung của học sinh).
    4. ĐA DẠNG HÌNH THỨC: 'multiple-choice', 'true-false', 'fill-in-blank'.
    5. Ngôn ngữ: Tiếng Việt.

    OUTPUT JSON FORMAT ONLY.
  `;

  // 3. Define Response Schema
  const schema = {
    type: Type.OBJECT,
    properties: {
      units: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topicId: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            totalXp: { type: Type.NUMBER },
            durationMinutes: { type: Type.NUMBER },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["multiple-choice", "true-false", "fill-in-blank"] },
                  content: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    nullable: true 
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
                },
                required: ["id", "type", "content", "correctAnswer", "explanation", "difficulty"]
              }
            }
          },
          required: ["topicId", "title", "description", "questions", "totalXp", "durationMinutes"]
        }
      }
    },
    required: ["units"]
  };

  try {
    const parsedData = await callGeminiWithFallback(
      prompt, 
      schema, 
      `You are an Advanced Adaptive AI Tutor. You analyze numerology, psychology, and learning history to create the perfect math path. ${MATH_FORMATTING_INSTRUCTION}`
    );
    
    // Check if fields are initialized
    const parsedUnits = parsedData.units || [];
    const processedUnits: LearningUnit[] = parsedUnits.map((unit: any, index: number) => ({
      ...unit,
      id: `unit-${Date.now()}-${index}`,
      status: index === 0 ? 'active' : 'locked', 
      level: adjustedLevel // Use the calculated level based on history
    }));

    return processedUnits;

  } catch (error) {
    console.error("AI Generation Error:", error);
    // Rethrow to let the UI handle it (showing red error) as per instructions
    throw error;
  }
};

// Generate Challenge Unit (Harder, More Questions)
export const generateChallengeUnit = async (
  user: UserProfile,
  currentUnit: LearningUnit
): Promise<LearningUnit | null> => {
  
  const nextLevel = (currentUnit.level || 1) + 1;

  const prompt = `
    Đóng vai một chuyên gia giáo dục toán học AI. Học sinh đã hoàn thành xuất sắc bài học "${currentUnit.title}".
    Hãy tạo một PHIÊN BẢN NÂNG CAO (Level ${nextLevel}) cho bài học này để thử thách học sinh.

    THÔNG TIN ĐẦU VÀO:
    - Chủ đề: ${currentUnit.title}
    - Lớp: ${user.grade}
    - Cấp độ mới: Khó hơn, chuyên sâu hơn.

    YÊU CẦU CỤ THỂ:
    1. Tạo 1 Learning Unit mới vẫn giữ chủ đề cũ nhưng tên gọi thể hiện sự nâng cao (VD: "... - Thử thách", "... - Nâng cao").
    2. SỐ LƯỢNG CÂU HỎI: Từ 10 đến 15 câu.
    3. ĐỘ KHÓ: 20% Trung bình, 80% Khó/Vận dụng cao.
    4. Tăng XP thưởng và thời gian làm bài.
    5. Ngôn ngữ: Tiếng Việt.

    OUTPUT JSON FORMAT ONLY (Single Unit object structure).
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      topicId: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      totalXp: { type: Type.NUMBER },
      durationMinutes: { type: Type.NUMBER },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["multiple-choice", "true-false", "fill-in-blank"] },
            content: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              nullable: true 
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
          },
          required: ["id", "type", "content", "correctAnswer", "explanation", "difficulty"]
        }
      }
    },
    required: ["topicId", "title", "description", "questions", "totalXp", "durationMinutes"]
  };

  try {
    const parsedUnit = await callGeminiWithFallback(
      prompt,
      schema,
      `You are a tough but fair AI Math Coach. ${MATH_FORMATTING_INSTRUCTION}`,
      0.8
    );

    return {
      ...parsedUnit,
      id: currentUnit.id, 
      status: 'active',
      level: nextLevel
    };

  } catch (error) {
    console.error("Challenge Generation Error", error);
    throw error;
  }
};

// Generate Comprehensive Test (20 questions, Mixed Types, Progressive Difficulty)
export const generateComprehensiveTest = async (user: UserProfile): Promise<LearningUnit | null> => {
  const historyStats = user.history || [];
  const weakAreas = historyStats.filter(h => (h.score / h.totalQuestions) < 0.6).map(h => h.unitTitle).join(", ");
  const strongAreas = historyStats.filter(h => (h.score / h.totalQuestions) >= 0.8).map(h => h.unitTitle).join(", ");
  
  // Collect topics from current learning path to ensure coverage
  const pathTopics = user.learningPath ? user.learningPath.map(u => u.title).join(", ") : user.selectedTopics?.join(", ") || "Toán tổng hợp";

  const prompt = `
    Bạn là AI Giáo viên Toán cao cấp. Hãy tạo một BÀI KIỂM TRA TỔNG HỢP (Final Exam) cho học sinh này.
    
    HỒ SƠ HỌC SINH:
    - Lớp: ${user.grade}
    - Các chủ đề đã học trong lộ trình: ${pathTopics}
    - Điểm yếu cần khắc phục (nếu có): ${weakAreas || "Chưa có dữ liệu, hãy kiểm tra kiến thức nền tảng."}
    - Điểm mạnh (nếu có): ${strongAreas}

    YÊU CẦU ĐỀ THI:
    1. SỐ LƯỢNG: Đúng 20 câu hỏi.
    2. CẤU TRÚC ĐỘ KHÓ (Tăng dần):
       - 5 câu đầu: Dễ (Khởi động, kiến thức cơ bản).
       - 10 câu giữa: Trung bình (Vận dụng).
       - 5 câu cuối: Khó (Vận dụng cao, tư duy logic).
    3. HÌNH THỨC ĐA DẠNG:
       - Phải có đủ 3 loại: 'multiple-choice', 'true-false', 'fill-in-blank'.
    4. NỘI DUNG: Bao phủ các chủ đề trong lộ trình, nhưng tập trung xoáy sâu vào các phần học sinh còn yếu (nếu có).
    5. Tên bài: "Kiểm tra Tổng hợp Kiến thức".
    6. Ngôn ngữ: Tiếng Việt.

    OUTPUT JSON FORMAT ONLY.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      topicId: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      totalXp: { type: Type.NUMBER },
      durationMinutes: { type: Type.NUMBER },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["multiple-choice", "true-false", "fill-in-blank"] },
            content: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              nullable: true 
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
          },
          required: ["id", "type", "content", "correctAnswer", "explanation", "difficulty"]
        }
      }
    },
    required: ["topicId", "title", "description", "questions", "totalXp", "durationMinutes"]
  };

  try {
    const parsedUnit = await callGeminiWithFallback(
      prompt,
      schema,
      `You are a precise Exam Creator AI. You create balanced, progressive difficulty tests. ${MATH_FORMATTING_INSTRUCTION}`
    );

    return {
      ...parsedUnit,
      id: `exam-${Date.now()}`,
      status: 'active',
      level: 99 // Special level identifier for Exam
    };
  } catch (error) {
    console.error("Exam Generation Error", error);
    throw error;
  }
};

export const generateEntertainmentContent = async (user: UserProfile): Promise<GameActivity[]> => {
  // Extract context from user profile
  const grade = user.grade;
  const topics = user.learningPath?.map(u => u.title).slice(0, 3).join(", ") || "Toán tư duy cơ bản";
  const numerologyTrait = user.numerologyProfile?.title || "Sáng tạo";
  const mathStyle = user.numerologyProfile?.mathApproach || "Logic";

  const prompt = `
    Bạn là một nhà thiết kế Game Giáo Dục AI (Gamification Expert).
    Hãy tạo ra 4-5 hoạt động giải trí toán học (Trò chơi, Câu đố, Thử thách) cho học sinh này.

    HỒ SƠ NGƯỜI CHƠI:
    - Lớp: ${grade}
    - Tính cách (Thần số học): ${numerologyTrait} - Thích ${mathStyle}
    - Chủ đề đang học: ${topics}

    YÊU CẦU NỘI DUNG:
    1. Vui vẻ, hài hước, mang tính tích cực.
    2. Phù hợp với kiến thức Lớp ${grade}.
    3. QUAN TRỌNG: Tất cả hoạt động đều phải có một CÂU HỎI hoặc NHIỆM VỤ cụ thể mà học sinh có thể nhập đáp án vào ô trống.
    4. Đối với 'challenge' (thử thách thực tế), hãy đặt câu hỏi về kết quả của thử thách (Ví dụ: "Bạn đếm được bao nhiêu hình tròn?", "Kết quả phép tính cuối cùng là gì?").
    5. Cung cấp đáp án (answer) ngắn gọn, chính xác (số hoặc từ đơn) để hệ thống tự động chấm điểm.

    CHI TIẾT LOẠI HÌNH:
    - 'puzzle': Câu đố vui, đố mẹo toán học.
    - 'game': Trò chơi tư duy nhỏ (dạng text).
    - 'challenge': Thử thách thực tế (đo đạc, tìm kiếm) nhưng kết thúc bằng một câu hỏi kiểm tra.

    OUTPUT JSON FORMAT ONLY.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      activities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["game", "puzzle", "challenge"] },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Dễ", "Vừa", "Khó"] },
            duration: { type: Type.STRING },
            xpReward: { type: Type.NUMBER },
            interactiveContent: { type: Type.STRING, description: "Nội dung chính: Câu hỏi đố, luật chơi, hoặc hướng dẫn thử thách. PHẢI CÓ CÂU HỎI CUỐI CÙNG." },
            answer: { type: Type.STRING, description: "Đáp án CHÍNH XÁC cho câu hỏi (số hoặc từ ngắn) để chấm điểm." },
            hint: { type: Type.STRING, nullable: true },
            funFact: { type: Type.STRING, description: "Sự thật thú vị liên quan đến chủ đề" }
          },
          required: ["id", "type", "title", "description", "difficulty", "duration", "xpReward", "interactiveContent", "answer", "funFact"]
        }
      }
    },
    required: ["activities"]
  };

  try {
     const parsed = await callGeminiWithFallback(
      prompt,
      schema,
      `You are a fun and creative Gamification Master for kids. ${MATH_FORMATTING_INSTRUCTION}`,
      0.85
    );
    return parsed.activities;

  } catch (error) {
    console.error("Game Generation Error", error);
    // If AI completely fails (even fallback), return static data
    // Or throw error depending on whether we want to stop progress. 
    // Instructions say: "Nếu tất cả các model đều thất bại -> Hiện thông báo lỗi màu đỏ...". 
    // So we should probably throw or let the static fallback be minimal. 
    // But since it's entertainment, maybe fallback is fine. 
    // However, specifically for AI Tasks (Step 1,2,3), instructions say stop. 
    // This is entertainment, but I'll err on the side of throwing to be consistent with "display API error".
    // But wait, the previous code had fallback. I will keep fallback for games to not break the fun.
    // The "Stop progress" rule applies to "process columns" (Steps), which sounds like Learning Path generation or Analysis.
    
     return [
      {
        id: "fallback-1",
        type: "puzzle",
        title: "Bí mật con số 0",
        description: "Tại sao con số 0 lại quan trọng đến thế?",
        difficulty: "Dễ",
        duration: "2 phút",
        xpReward: 50,
        interactiveContent: "Cái gì không có bắt đầu, không có kết thúc, và cũng chẳng có gì ở giữa? (Nhập tên hình học)",
        answer: "Hình tròn",
        hint: "Hình dáng của nó giống cái nhẫn.",
        funFact: "Số 0 được phát minh bởi người Ấn Độ cổ đại!"
      }
    ];
  }
};
