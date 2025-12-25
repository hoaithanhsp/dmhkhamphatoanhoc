import { NumerologyProfile } from "../types";

// Helper: Remove Vietnamese accents
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
};

// Helper: Calculate sum of digits recursively until single digit (or 11, 22, 33)
const reduceNumber = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  
  let sum = 0;
  const digits = num.toString().split('');
  digits.forEach(d => sum += parseInt(d));
  
  return reduceNumber(sum);
};

// Calculate Life Path Number (Số Đường Đời) from DOB (Support both YYYY-MM-DD and DD/MM/YYYY)
export const calculateLifePath = (dob: string): number => {
  if (!dob) return 0;
  
  // Extract only digits
  const digits = dob.replace(/\D/g, '');
  
  // Basic validation: ensure we have at least 8 digits (d d m m y y y y)
  // Even if input is 1/1/2000 -> 112000 (6 digits), logic still works as we sum them up.
  if (digits.length < 6) return 0; 
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]);
  }
  
  return reduceNumber(sum);
};

// Knowledge Base from PDF
const NUMEROLOGY_DATA: Record<number, Omit<NumerologyProfile, 'lifePathNumber'>> = {
  1: {
    title: "Người Tiên Phong (The Leader)",
    description: "Độc lập, tự chủ, có ý chí mạnh mẽ. Con luôn muốn dẫn đầu và sở hữu sự quyết đoán, can đảm bẩm sinh.",
    strengths: [
      "Tư duy độc lập, không thích đi theo lối mòn.",
      "Có khả năng lãnh đạo bẩm sinh.",
      "Quyết tâm cao, theo đuổi mục tiêu đến cùng."
    ],
    weaknesses: [
      "Cái tôi cao, đôi khi trở nên độc đoán.",
      "Thiếu kiên nhẫn khi phải chờ đợi người khác."
    ],
    learningStyle: "Tự học, tự nghiên cứu. Thích được giao 'nhiệm vụ' hơn là 'bài tập'. Môi trường yên tĩnh, độc lập.",
    mathApproach: "Thích các bài toán thử thách, logic, có tính cạnh tranh. Cần thấy rõ mục tiêu của bài toán."
  },
  2: {
    title: "Người Hòa Giải (The Peacemaker)",
    description: "Nhạy cảm, giàu lòng trắc ẩn và trực giác tốt. Con là nhà ngoại giao bẩm sinh, luôn tìm kiếm sự hòa hợp.",
    strengths: [
      "Khả năng lắng nghe và thấu cảm tuyệt vời.",
      "Làm việc nhóm tốt, biết kết nối mọi người.",
      "Kiên nhẫn và tỉ mỉ trong công việc."
    ],
    weaknesses: [
      "Quá nhạy cảm, dễ bị tổn thương bởi lời nói.",
      "Thiếu quyết đoán, hay do dự khi ra quyết định."
    ],
    learningStyle: "Học nhóm, học có bạn đồng hành. Môi trường hài hòa, không áp lực cạnh tranh gay gắt.",
    mathApproach: "Bài tập cặp đôi (mô phỏng), hướng dẫn chi tiết. Cần sự động viên nhẹ nhàng: 'Cố lên nào, chúng ta sắp xong rồi'."
  },
  3: {
    title: "Người Truyền Cảm Hứng (The Communicator)",
    description: "Sáng tạo, lạc quan, giao tiếp tốt và hài hước. Con có trí tưởng tượng phong phú và khả năng thể hiện bản thân tuyệt vời.",
    strengths: [
      "Óc sáng tạo và trí tưởng tượng bay bổng.",
      "Lạc quan, luôn mang lại năng lượng tích cực.",
      "Nhanh trí, linh hoạt trong tư duy."
    ],
    weaknesses: [
      "Dễ mất tập trung, cả thèm chóng chán.",
      "Thiếu kỷ luật, hay trì hoãn các việc chi tiết."
    ],
    learningStyle: "Học qua hình ảnh, âm nhạc, câu chuyện, trò chơi (Gamification). Môi trường vui vẻ, năng động.",
    mathApproach: "Trò chơi toán học, câu đố vui, bài toán có cốt truyện. Tránh các bài tập lặp đi lặp lại nhàm chán."
  },
  4: {
    title: "Người Kiến Tạo (The Builder)",
    description: "Thực tế, kỷ luật, tỉ mỉ và đáng tin cậy. Con thích sự rõ ràng, trật tự và logic chặt chẽ trong mọi vấn đề.",
    strengths: [
      "Khả năng phân tích logic và tổ chức tốt.",
      "Kiên trì, chăm chỉ và chịu được áp lực.",
      "Giỏi các vấn đề kỹ thuật, con số cụ thể."
    ],
    weaknesses: [
      "Hơi cứng nhắc, khó thích nghi với thay đổi.",
      "Quá chú trọng chi tiết mà quên bức tranh lớn."
    ],
    learningStyle: "Học theo quy trình từng bước (Step-by-step). Cần lộ trình rõ ràng, tài liệu có cấu trúc.",
    mathApproach: "Dạng bài thực tế, ứng dụng đời sống. Cần giải thích rõ 'Tại sao phải học cái này?' và 'Nó dùng để làm gì?'."
  },
  5: {
    title: "Người Tự Do (The Freedom Seeker)",
    description: "Yêu tự do, thích khám phá, đa tài và linh hoạt. Con ghét sự gò bó và luôn tìm kiếm những trải nghiệm mới lạ.",
    strengths: [
      "Thích nghi nhanh với môi trường mới.",
      "Tư duy đột phá, nhiều ý tưởng táo bạo.",
      "Năng lượng dồi dào, nhiệt huyết."
    ],
    weaknesses: [
      "Thiếu kiên nhẫn, hay thay đổi mục tiêu.",
      "Dễ bốc đồng và khó ngồi yên một chỗ."
    ],
    learningStyle: "Học qua trải nghiệm thực tế, vận động. Không gian học tập cần thoáng đãng, thay đổi thường xuyên.",
    mathApproach: "Toán tư duy, các bài toán mở, không có đáp án cố định. Sử dụng các ví dụ về du lịch, thám hiểm."
  },
  6: {
    title: "Người Chăm Sóc (The Nurturer)",
    description: "Trách nhiệm, yêu thương và có gu thẩm mỹ. Con luôn quan tâm đến người khác và mong muốn mọi thứ hoàn hảo.",
    strengths: [
      "Tinh thần trách nhiệm cao.",
      "Có khả năng nghệ thuật và thẩm mỹ tốt.",
      "Giỏi quan tâm và hỗ trợ bạn bè."
    ],
    weaknesses: [
      "Hay lo lắng thái quá, ôm đồm việc.",
      "Cầu toàn, dễ bị thất vọng nếu kết quả không như ý."
    ],
    learningStyle: "Học trong môi trường ấm áp, được thầy cô quan tâm. Thích các bài học liên quan đến giúp đỡ cộng đồng.",
    mathApproach: "Kết hợp toán với nghệ thuật (vẽ hình). Bài toán liên quan đến gia đình, chia sẻ đồ vật."
  },
  7: {
    title: "Nhà Tư Duy (The Seeker)",
    description: "Sâu sắc, thích phân tích và tìm tòi chân lý. Con có xu hướng đặt câu hỏi 'Tại sao' và muốn hiểu bản chất vấn đề.",
    strengths: [
      "Tư duy phân tích và logic sắc bén.",
      "Khả năng quan sát tinh tế.",
      "Độc lập trong suy nghĩ, không dễ bị tác động."
    ],
    weaknesses: [
      "Có xu hướng khép kín, khó chia sẻ cảm xúc.",
      "Hay hoài nghi và đòi hỏi bằng chứng cụ thể."
    ],
    learningStyle: "Tự nghiên cứu, đọc sách. Cần thời gian riêng để suy ngẫm (Me-time). Không thích bị làm phiền khi đang tập trung.",
    mathApproach: "Các bài toán đố, logic phức tạp, hình học không gian. Khuyến khích con tự tìm ra quy luật thay vì đưa công thức."
  },
  8: {
    title: "Người Điều Hành (The Executive)",
    description: "Mạnh mẽ, thực tế và có tố chất kinh doanh. Con nhạy bén với các con số, tiền bạc và thích sự thành công.",
    strengths: [
      "Khả năng quản lý và tổ chức xuất sắc.",
      "Nhạy bén với tài chính và các con số lớn.",
      "Chịu được áp lực cao, ý chí kiên cường."
    ],
    weaknesses: [
      "Đôi khi quá thực dụng hoặc áp đặt.",
      "Dễ bị cuốn vào thành tích mà quên đi cảm xúc."
    ],
    learningStyle: "Học qua các ví dụ thực tế về kinh doanh, quản lý. Thích các cuộc thi đua có phần thưởng rõ ràng.",
    mathApproach: "Toán tài chính, tính toán tiền tệ, xác suất thống kê. Đặt ra các mục tiêu điểm số cụ thể để chinh phục."
  },
  9: {
    title: "Người Cho Đi (The Humanitarian)",
    description: "Bao dung, nhân hậu và có tầm nhìn lớn. Con là người idealist (lý tưởng hóa), muốn làm thế giới tốt đẹp hơn.",
    strengths: [
      "Lòng trắc ẩn và sự bao dung lớn.",
      "Tư duy tổng quát, nhìn xa trông rộng.",
      "Sáng tạo và có khiếu nghệ thuật."
    ],
    weaknesses: [
      "Dễ bị lợi dụng lòng tốt.",
      "Đôi khi mơ mộng, thiếu thực tế."
    ],
    learningStyle: "Học qua các dự án cộng đồng, nghệ thuật. Môi trường học tập cần sự tôn trọng và khích lệ.",
    mathApproach: "Toán học ứng dụng vào xã hội, môi trường. Các bài toán có cốt truyện nhân văn."
  },
  11: {
    title: "Người Truyền Cảm Hứng (Master Number 11)",
    description: "Trực giác cực mạnh, nhạy cảm và tinh tế. Con sở hữu tiềm năng tâm linh và khả năng truyền cảm hứng lớn lao.",
    strengths: [
      "Trực giác nhạy bén hơn người thường.",
      "Khả năng thấu hiểu tâm lý sâu sắc.",
      "Sức hút tự nhiên, dễ thuyết phục người khác."
    ],
    weaknesses: [
      "Căng thẳng thần kinh, dễ bị overthinking.",
      "Khó cân bằng giữa thực tế và lý tưởng."
    ],
    learningStyle: "Kết hợp giữa logic và trực giác. Cần môi trường tự do để phát triển khả năng đặc biệt.",
    mathApproach: "Các bài toán đòi hỏi sự suy luận trừu tượng. Khuyến khích con tin vào 'cảm giác' đầu tiên khi giải toán."
  },
  22: {
    title: "Kiến Trúc Sư Đại Tài (Master Number 22)",
    description: "Sự kết hợp giữa tầm nhìn của số 11 và tính thực tế của số 4. Con có khả năng biến những giấc mơ lớn thành hiện thực.",
    strengths: [
      "Tầm nhìn vĩ mô kết hợp hành động thực tế.",
      "Khả năng lãnh đạo và xây dựng hệ thống lớn.",
      "Kỷ luật thép và sự kiên trì vô hạn."
    ],
    weaknesses: [
      "Áp lực tự thân quá lớn.",
      "Đôi khi độc đoán vì tin mình luôn đúng."
    ],
    learningStyle: "Học qua các dự án lớn, xây dựng mô hình. Thích các môn học có tính ứng dụng cao và quy mô lớn.",
    mathApproach: "Toán học kiến trúc, xây dựng, quy hoạch. Giải quyết các vấn đề phức tạp cần nhiều bước logic."
  },
  33: {
    title: "Người Chữa Lành (Master Number 33)",
    description: "Đại diện cho tình yêu thương vô điều kiện và sự hy sinh. Con mang năng lượng nuôi dưỡng và chữa lành cho mọi người.",
    strengths: [
      "Lòng yêu thương và sự tận tụy hiếm có.",
      "Khả năng lắng nghe và xoa dịu nỗi đau của người khác.",
      "Sáng tạo và hướng thiện."
    ],
    weaknesses: [
      "Dễ quên bản thân vì người khác.",
      "Nhạy cảm thái quá với nỗi đau của thế giới."
    ],
    learningStyle: "Học trong môi trường yêu thương, không cạnh tranh. Thích các hoạt động nghệ thuật và chăm sóc.",
    mathApproach: "Toán học kết hợp với các câu chuyện nhân văn. Học nhóm để hỗ trợ các bạn yếu hơn."
  }
};

export const analyzeProfile = (name: string, dob: string): NumerologyProfile => {
  const lifePath = calculateLifePath(dob);
  
  // Default to Number 1 data if something goes wrong, but calculations should be robust
  const baseProfile = NUMEROLOGY_DATA[lifePath] || NUMEROLOGY_DATA[1];

  return {
    lifePathNumber: lifePath,
    ...baseProfile
  };
};