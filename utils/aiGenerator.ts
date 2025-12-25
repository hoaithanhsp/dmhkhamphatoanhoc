
import { GoogleGenAI, SchemaType, Type } from "@google/genai";
import { UserProfile, LearningUnit, GameActivity } from "../types";

// --- CONFIGURATION ---
const API_KEY_STORAGE_KEY = 'user_gemini_api_key';
const FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

const MATH_FORMATTING_INSTRUCTION = `
QUY TẮC HIỂN THỊ CÔNG THỨC TOÁN HỌC (QUAN TRỌNG):
1. Dùng ký hiệu Unicode đẹp mắt, KHÔNG dùng LaTeX thuần túy ($...$).
2. Phân số: Viết dạng a/b hoặc dùng HTML <sup>a</sup>/<sub>b</sub>.
3. Số mũ & chỉ số: Dùng Unicode (², ³, ⁰, ₁, ₂) hoặc HTML <sup>/<sub>. VD: x²
4. Căn bậc hai: Dùng √. VD: √x.
5. Ký hiệu đặc biệt: ±, ×, ÷, ≤, ≥, ≠, ≈, ∞, ∈, ∪, ∩, ∅, π, Δ.
6. Khi giải bài, trình bày từng bước rõ ràng.
`;

// --- HELPER: GET API KEY ---
const getApiKey = (): string => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) return storedKey;
  // Fallback to env if available, but instructions prioritize localStorage
  return process.env.API_KEY || "";
};

// --- HELPER: CALL GEMINI WITH FALLBACK ---
const callGeminiWithFallback = async (
  prompt: string,
  schema: any,
  systemInstruction: string,
  temperature: number = 0.7
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Vui lòng nhập API Key trong phần Cài đặt để sử dụng tính năng này.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let lastError: any = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
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
      if (!jsonText) throw new Error(`No data returned from model ${modelName}`);

      return JSON.parse(jsonText); // Success!

    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error);
      lastError = error;
      // Continue to next model
    }
  }

  // If all failed
  const errorMsg = lastError?.message || JSON.stringify(lastError);
  throw new Error(errorMsg); // Just throw the message directly as requested: "hiển thị nguyên văn lỗi từ API"
};

export const generateLearningPath = async (
  user: UserProfile,
  topics: string[]
): Promise<LearningUnit[]> => {

  // --- 1. PHÂN TÍCH DỮ LIỆU LỊCH SỬ (ADVANCED LOGIC) ---
  const history = user.history || [];
  let performanceContext = "";
  let adjustedLevel = user.proficiencyLevel || 2; // Default Average

  if (history.length > 0) {
    // Tìm các bài làm yếu (< 50%) và tốt (> 80%)
    const weakUnits = history.filter(h => (h.score / h.totalQuestions) < 0.5);
    const strongUnits = history.filter(h => (h.score / h.totalQuestions) >= 0.8);

    const weakTopics = [...new Set(weakUnits.map(h => h.unitTitle))];
    const strongTopics = [...new Set(strongUnits.map(h => h.unitTitle))];

    // Tính điểm trung bình 5 bài gần nhất để xác định phong độ hiện tại
    const recentHistory = history.slice(0, 5);
    const recentAvg = recentHistory.reduce((acc, h) => acc + (h.score / h.totalQuestions), 0) / (recentHistory.length || 1);

    // Điều chỉnh Level dựa trên phong độ thực tế
    if (recentAvg < 0.5) adjustedLevel = 1; // Hạ xuống cơ bản
    else if (recentAvg > 0.85) adjustedLevel = 4; // Tăng lên xuất sắc

    performanceContext = `
      PHÂN TÍCH DỮ LIỆU HỌC TẬP THỰC TẾ CỦA HỌC SINH (QUAN TRỌNG):
      - Điểm trung bình gần đây: ${(recentAvg * 10).toFixed(1)}/10.
      - Chủ đề đang yếu (CẦN KHẮC PHỤC NGAY): ${weakTopics.length > 0 ? weakTopics.join(", ") : "Không có, nền tảng tốt."}
      - Chủ đề thế mạnh (CẦN PHÁT HUY): ${strongTopics.length > 0 ? strongTopics.join(", ") : "Đang phát triển."}
      
      YÊU CẦU ĐIỀU CHỈNH LỘ TRÌNH:
      1. Nếu có "Chủ đề đang yếu": BẮT BUỘC bài học đầu tiên của lộ trình phải là "Ôn tập lại [Chủ đề yếu]" với mức độ Dễ để lấy lại gốc.
      2. Nếu "Điểm trung bình" cao (>8.0): Tăng tỷ lệ câu hỏi Vận dụng cao lên 50% cho các bài học mới.
      3. Nếu "Điểm trung bình" thấp (<5.0): Giảm độ khó, tập trung vào lý thuyết và ví dụ minh họa, giải thích chi tiết.
      `;
  } else {
    performanceContext = "Học sinh mới, chưa có dữ liệu lịch sử. Hãy tạo lộ trình tiêu chuẩn theo lớp học.";
  }

  // --- 2. Construct the Prompt ---
  const prompt = `
    Đóng vai một chuyên gia giáo dục toán học AI & Phân tích dữ liệu. Hãy tạo một lộ trình học tập tối ưu hóa theo ngày cho học sinh này:
    
    THÔNG TIN CƠ BẢN:
    - Lớp: ${user.grade}
    - Phong cách học (Thần số học): ${user.numerologyProfile?.mathApproach || "Logic, trực quan"}
    - Chủ đề mong muốn: ${topics.join(", ")}

    ${performanceContext}

    YÊU CẦU CẤU TRÚC JSON:
    1. Tạo danh sách các "Learning Unit" (Bài học).
    2. Mỗi bài học bao gồm danh sách câu hỏi (Questions).
    3. SỐ LƯỢNG CÂU HỎI: 5-10 câu/bài.
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
      `You are an Adaptive AI Tutor. You analyze student history to create the perfect learning path. ${MATH_FORMATTING_INSTRUCTION}`
    );

    const processedUnits: LearningUnit[] = parsedData.units.map((unit: any, index: number) => ({
      ...unit,
      id: `unit-${Date.now()}-${index}`,
      status: index === 0 ? 'active' : 'locked',
      level: adjustedLevel // Use the calculated level based on history
    }));

    return processedUnits;

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error; // Propagate error for UI to handle
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
      `You are a precise Exam Creator AI. You create balanced, progressive difficulty tests. ${MATH_FORMATTING_INSTRUCTION}`,
      0.7
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
    // Fallback static data if AI fails
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
