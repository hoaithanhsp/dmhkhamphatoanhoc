
import { NumerologyProfile } from "../types";

// Helper: Calculate sum of digits recursively until single digit (or 11, 22, 33)
const reduceNumber = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  
  let sum = 0;
  const digits = num.toString().split('');
  digits.forEach(d => sum += parseInt(d));
  
  return reduceNumber(sum);
};

// Calculate Life Path Number (Số Đường Đời)
export const calculateLifePath = (dob: string): number => {
  if (!dob) return 0;
  const digits = dob.replace(/\D/g, '');
  if (digits.length < 6) return 0; 
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]);
  }
  return reduceNumber(sum);
};

// Knowledge Base from PDF - Detailed Breakdown
const NUMEROLOGY_DATA: Record<number, Omit<NumerologyProfile, 'lifePathNumber'>> = {
  1: {
    title: "Người Tiên Phong",
    generalPersonality: "Người Tiên Phong (The Leader) - Độc lập, tự chủ, ý chí mạnh mẽ. Con luôn muốn dẫn đầu và sở hữu sự quyết đoán bẩm sinh.",
    learningStyle: "Tự học, tự nghiên cứu, học qua dự án cá nhân. Thích được giao 'nhiệm vụ' hơn là 'bài tập'.",
    focusCapability: "Cao khi được làm việc độc lập và theo đuổi mục tiêu riêng. Dễ mất tập trung khi bị ép làm điều không thích.",
    learningMotivation: "Mong muốn được công nhận, chiến thắng, trở thành người giỏi nhất. Thích cạnh tranh lành mạnh.",
    mathApproach: "Logic, thẳng thắn, tìm cách giải quyết nhanh và hiệu quả nhất. Không ngại thử thách khó.",
    strengths: [
      "Tư duy độc lập, không thích đi theo lối mòn.",
      "Quyết tâm cao, một khi đặt mục tiêu sẽ theo đuổi đến cùng.",
      "Sáng tạo, nhiều ý tưởng mới.",
      "Can đảm, không ngại rủi ro."
    ],
    challenges: [
      "Cái tôi cao, đôi khi trở nên độc đoán.",
      "Thiếu kiên nhẫn, khó lắng nghe ý kiến người khác.",
      "Không thích bị chỉ huy, ra lệnh.",
      "Có xu hướng tự cô lập khi gặp khó khăn."
    ],
    effectiveMethods: [
      "Đặt mục tiêu rõ ràng, thách thức bản thân.",
      "Tự tạo các 'nhiệm vụ' cá nhân thay vì làm theo lệnh.",
      "Học qua nghiên cứu case study, project-based learning.",
      "Tham gia các cuộc thi để thỏa mãn tính cạnh tranh."
    ],
    idealEnvironment: [
      "Không gian riêng, yên tĩnh.",
      "Không bị gò bó, áp đặt.",
      "Có quyền tự do lựa chọn cách học.",
      "Có cơ hội thể hiện năng lực cá nhân."
    ],
    conclusion: "Con là một nhà lãnh đạo bẩm sinh. Hãy khuyến khích sự tự chủ của con, nhưng cũng cần rèn luyện sự kiên nhẫn và lắng nghe."
  },
  2: {
    title: "Người Hòa Giải",
    generalPersonality: "Người Hòa Giải (The Peacemaker) - Nhạy cảm, giàu lòng trắc ẩn và trực giác tốt. Con là nhà ngoại giao bẩm sinh.",
    learningStyle: "Học nhóm, học có bạn đồng hành, học qua việc giải thích cho người khác.",
    focusCapability: "Cao trong môi trường yên tĩnh, ổn định. Dễ bị phân tâm bởi cảm xúc và mối quan hệ xung quanh.",
    learningMotivation: "Mong muốn được giúp đỡ người khác, kết nối và nhận được sự yêu thương.",
    mathApproach: "Tuân tự, cẩn thận, tỉ mỉ. Thích những bài toán có hướng dẫn rõ ràng từng bước.",
    strengths: [
      "Khả năng lắng nghe và thấu cảm tuyệt vời.",
      "Giỏi làm việc nhóm, kết nối mọi người.",
      "Trực giác tốt, nhạy bén với cảm xúc.",
      "Kiên nhẫn, tỉ mỉ trong học tập."
    ],
    challenges: [
      "Quá nhạy cảm, dễ bị tổn thương bởi lời nói.",
      "Thiếu quyết đoán, hay do dự.",
      "Có xu hướng phụ thuộc vào người khác.",
      "Sợ đối đầu, không dám nói lên ý kiến khác."
    ],
    effectiveMethods: [
      "Học cùng bạn, giải thích lại cho bạn để hiểu sâu hơn.",
      "Tạo nhóm học tập ổn định, thân thiện.",
      "Sử dụng phương pháp học từng bước, có hệ thống."
    ],
    idealEnvironment: [
      "Hài hòa, không căng thẳng.",
      "Có sự hỗ trợ từ bạn bè, thầy cô.",
      "Không khí hợp tác thay vì cạnh tranh gay gắt."
    ],
    conclusion: "Con học tốt nhất khi cảm thấy an toàn và được yêu thương. Hãy tạo môi trường học tập nhẹ nhàng, khuyến khích làm việc nhóm."
  },
  3: {
    title: "Người Truyền Cảm Hứng",
    generalPersonality: "Người Truyền Cảm Hứng - Sáng tạo, lạc quan, hoạt ngôn và hài hước. Con là tâm điểm của sự chú ý.",
    learningStyle: "Học qua hình ảnh, âm nhạc, câu chuyện, trò chơi (Gamification).",
    focusCapability: "Thấp, đặc biệt với những chủ đề không hứng thú. Cần sự mới mẻ liên tục.",
    learningMotivation: "Niềm vui, sự hứng thú, được thể hiện bản thân và nhận lời khen ngợi.",
    mathApproach: "Sáng tạo, tìm những lối đi bất ngờ. Không thích đi theo khuôn mẫu. Thường 'nhảy bước'.",
    strengths: [
      "Óc sáng tạo và trí tưởng tượng bay bổng.",
      "Kỹ năng giao tiếp và diễn đạt xuất sắc.",
      "Lạc quan, luôn mang năng lượng tích cực.",
      "Nhanh trí, linh hoạt trong tư duy."
    ],
    challenges: [
      "Dễ mất tập trung, cả thèm chóng chán.",
      "Thiếu kỷ luật, hay trì hoãn công việc.",
      "Nói nhiều hơn làm, đôi khi hời hợt.",
      "Nhạy cảm với chỉ trích, dễ nản lòng."
    ],
    effectiveMethods: [
      "Biến học tập thành trò chơi, thử thách vui.",
      "Sử dụng nhiều phương tiện đa phương tiện (video, hình ảnh).",
      "Học qua kể chuyện, vai diễn."
    ],
    idealEnvironment: [
      "Vui vẻ, năng động, đầy màu sắc.",
      "Có nhiều hoạt động tương tác.",
      "Không gò bó, khuyến khích sáng tạo."
    ],
    conclusion: "Hãy để trí tưởng tượng của con bay xa. Toán học không khô khan nếu được biến thành những câu chuyện thú vị."
  },
  4: {
    title: "Người Xây Dựng",
    generalPersonality: "Người Xây Dựng - Thực tế, kỷ luật, tỉ mỉ và đáng tin cậy. Con thích trật tự và logic chặt chẽ.",
    learningStyle: "Học có cấu trúc rõ ràng, theo quy trình, từng bước một. Thích lịch trình ổn định.",
    focusCapability: "Cao, đặc biệt với những công việc chi tiết. Có thể tập trung lâu nếu biết rõ mục tiêu.",
    learningMotivation: "Muốn xây dựng nền móng vững chắc, thấy kết quả cụ thể từng bước.",
    mathApproach: "Tuân tự, có hệ thống, từng bước một. Không bỏ qua bất kỳ bước nào.",
    strengths: [
      "Làm việc chăm chỉ, kiên định.",
      "Tổ chức tốt, có kế hoạch rõ ràng.",
      "Đáng tin cậy, hoàn thành đúng hạn.",
      "Chi tiết, cẩn thận, chính xác cao."
    ],
    challenges: [
      "Cứng nhắc, khó thay đổi khi đã quen.",
      "Quá lo lắng về chi tiết, thiếu cái nhìn tổng thể.",
      "Thiếu linh hoạt, khó chấp nhận cái mới.",
      "Cố chấp, khó nghe ý kiến khác."
    ],
    effectiveMethods: [
      "Lập kế hoạch học tập chi tiết, cụ thể.",
      "Chia nhỏ mục tiêu thành các bước nhỏ.",
      "Tạo thói quen học tập đều đặn.",
      "Sử dụng checklist, to-do list."
    ],
    idealEnvironment: [
      "Có cấu trúc rõ ràng, ổn định.",
      "Quy tắc nhất quán, không thay đổi đột ngột.",
      "Không gian gọn gàng, ngăn nắp."
    ],
    conclusion: "Con là viên gạch nền tảng vững chắc. Hãy cung cấp lộ trình rõ ràng và ghi nhận sự nỗ lực bền bỉ của con."
  },
  5: {
    title: "Người Tự Do",
    generalPersonality: "Người Tự Do - Yêu tự do, thích khám phá, đa tài và linh hoạt. Ghét sự gò bó.",
    learningStyle: "Học qua trải nghiệm, thám hiểm, khám phá. Cần sự đa dạng, thay đổi liên tục.",
    focusCapability: "Rất thấp với những chủ đề nhàm chán. Dễ bị bồn chồn, muốn chuyển sang thứ khác.",
    learningMotivation: "Khám phá mới mẻ, trải nghiệm đa dạng, được tự do chọn lựa.",
    mathApproach: "Thử nhiều cách, nhảy qua nhảy lại. Thích giải quyết nhanh để chuyển sang vấn đề khác.",
    strengths: [
      "Thích nghi nhanh với môi trường mới.",
      "Linh hoạt, đa tài.",
      "Tò mò, ham học hỏi.",
      "Dũng cảm thử nghiệm, không sợ sai."
    ],
    challenges: [
      "Thiếu kiên nhẫn, không kiên định.",
      "Dễ bồn chồn, không chịu ràng buộc.",
      "Thiếu trách nhiệm, bỏ dở giữa chừng.",
      "Khó hoàn thành dự án dài hạn."
    ],
    effectiveMethods: [
      "Thay đổi phương pháp học thường xuyên.",
      "Học qua du lịch, trải nghiệm thực tế.",
      "Kết hợp nhiều môn học, nhiều kỹ năng.",
      "Cho phép tự do lựa chọn chủ đề học."
    ],
    idealEnvironment: [
      "Tự do, không gò bó.",
      "Nhiều sự lựa chọn, tính bất ngờ cao.",
      "Có cơ hội di chuyển, khám phá."
    ],
    conclusion: "Đừng ép con ngồi yên một chỗ quá lâu. Hãy để con học toán thông qua sự vận động và các ví dụ thực tế đa dạng."
  },
  6: {
    title: "Người Chăm Sóc",
    generalPersonality: "Người Chăm Sóc - Trách nhiệm, yêu thương, có gu thẩm mỹ. Luôn quan tâm đến người khác.",
    learningStyle: "Học qua việc chăm sóc, giúp đỡ người khác. Thích các bài học có ý nghĩa nhân văn.",
    focusCapability: "Cao khi học những gì có ý nghĩa với gia đình/cộng đồng. Dễ bị phân tâm bởi nhu cầu người khác.",
    learningMotivation: "Giúp đỡ người khác, làm điều có ý nghĩa, được yêu thương.",
    mathApproach: "Liên hệ với cuộc sống thực tế. Ứng dụng vào việc giúp đỡ người khác.",
    strengths: [
      "Giàu lòng trắc ẩn, quan tâm người khác.",
      "Trách nhiệm cao, chu đáo.",
      "Khả năng chăm sóc, hỗ trợ tốt.",
      "Hòa giải, tạo không khí học tập tích cực."
    ],
    challenges: [
      "Lo lắng quá mức, đặc biệt cho người khác.",
      "Can thiệp thái quá, muốn giúp mọi người.",
      "Hy sinh bản thân, quên nhu cầu riêng.",
      "Cầu toàn, khó nói không."
    ],
    effectiveMethods: [
      "Học qua việc dạy lại cho người khác.",
      "Tham gia các dự án cộng đồng, tình nguyện.",
      "Kết nối kiến thức với ứng dụng thực tế."
    ],
    idealEnvironment: [
      "Ấm áp, hỗ trợ lẫn nhau.",
      "Có ý nghĩa nhân văn, giúp đỡ cộng đồng.",
      "Không khí hòa đồng, thân thiện."
    ],
    conclusion: "Con có trái tim ấm áp. Hãy cho con thấy toán học có thể giúp ích cho cuộc sống và mọi người như thế nào."
  },
  7: {
    title: "Người Trí Tuệ",
    generalPersonality: "Người Trí Tuệ (The Thinker) - Sâu sắc, thích phân tích, tìm tòi chân lý. Hay đặt câu hỏi 'Tại sao'.",
    learningStyle: "Học qua nghiên cứu sâu, phân tích, tìm hiểu bản chất. Cần không gian yên tĩnh để suy ngẫm.",
    focusCapability: "Rất cao khi học một mình, không bị làm phiền. Có thể tập trung sâu trong thời gian dài.",
    learningMotivation: "Hiểu 'tại sao', khám phá bí ẩn, đạt đến sự thật. Thích tìm hiểu bản chất gốc rễ.",
    mathApproach: "Phân tích từng chi tiết, tìm hiểu bản chất. Cần biết 'tại sao' trước khi làm.",
    strengths: [
      "Phân tích sâu sắc, logic.",
      "Trực giác mạnh mẽ.",
      "Tư duy phản biện tốt.",
      "Yêu tri thức, ham học hỏi."
    ],
    challenges: [
      "Xu hướng cô độc, xa cách.",
      "Hoài nghi quá mức, khó tin người.",
      "Khó chia sẻ cảm xúc, suy nghĩ.",
      "Có thể trở nên phê phán, chỉ trích."
    ],
    effectiveMethods: [
      "Nghiên cứu chuyên sâu, đọc nhiều sách.",
      "Suy ngẫm, chiêm nghiệm một mình.",
      "Tìm hiểu nguồn gốc, bản chất vấn đề."
    ],
    idealEnvironment: [
      "Yên tĩnh, sâu lắng.",
      "Không bị làm phiền, có không gian riêng.",
      "Được tự do suy ngẫm, nghiên cứu.",
      "Có thư viện tốt, nguồn tài liệu phong phú."
    ],
    conclusion: "Con là một nhà nghiên cứu bẩm sinh. Hãy tôn trọng không gian riêng của con và khuyến khích con tự tìm ra câu trả lời."
  },
  8: {
    title: "Người Lãnh Đạo",
    generalPersonality: "Người Lãnh Đạo - Mạnh mẽ, thực tế, có tố chất kinh doanh. Nhạy bén với tiền bạc và thành công.",
    learningStyle: "Học có mục tiêu rõ ràng, đo lường được thành công. Thích học những gì mang lại lợi ích cụ thể.",
    focusCapability: "Cao khi thấy mục tiêu rõ ràng và có ý nghĩa. Kiên trì với những gì mang lại thành công.",
    learningMotivation: "Thành công, giàu có, quyền lực, danh vọng. Muốn đạt được vị thế cao.",
    mathApproach: "Hiệu quả, nhanh chóng, tập trung kết quả. Áp dụng chiến lược, tính toán lợi ích.",
    strengths: [
      "Lãnh đạo mạnh mẽ, quyết đoán.",
      "Tham vọng lớn, không ngừng nỗ lực.",
      "Tổ chức tốt, quản lý thời gian hiệu quả.",
      "Khả năng kinh doanh, quản trị."
    ],
    challenges: [
      "Háo danh, thích quyền lực quá mức.",
      "Vật chất hóa giá trị học tập.",
      "Bỏ bê cảm xúc, mối quan hệ.",
      "Độc đoán, khó nghe ý kiến khác."
    ],
    effectiveMethods: [
      "Lập kế hoạch dài hạn, từng giai đoạn.",
      "Học qua các dự án lớn, có tác động rộng.",
      "Kết hợp lý thuyết và thực hành."
    ],
    idealEnvironment: [
      "Có mục tiêu rõ ràng, đo lường thành công.",
      "Môi trường chuyên nghiệp, nghiêm túc.",
      "Có cơ hội thể hiện năng lực lãnh đạo."
    ],
    conclusion: "Con sinh ra để làm lớn. Hãy đặt ra những mục tiêu thách thức và phần thưởng xứng đáng để thúc đẩy con."
  },
  9: {
    title: "Người Nhân Ái",
    generalPersonality: "Người Nhân Ái - Bao dung, nhân hậu, tầm nhìn lớn. Muốn làm thế giới tốt đẹp hơn.",
    learningStyle: "Học có ý nghĩa nhân văn sâu sắc, liên quan đến việc giúp đỡ thế giới. Thích học những gì có giá trị cho cộng đồng.",
    focusCapability: "Cao khi học những gì có ý nghĩa lớn lao. Khó tập trung với những điều nhỏ nhặt, chi tiết.",
    learningMotivation: "Cống hiến cho cộng đồng, thay đổi thế giới, giúp đỡ người khác. Lý tưởng cao đẹp.",
    mathApproach: "Nhìn tổng thể, kết nối với bức tranh lớn. Tìm ý nghĩa sâu xa của vấn đề.",
    strengths: [
      "Lòng trắc ẩn sâu sắc, vị tha.",
      "Nhìn xa, có tầm nhìn rộng.",
      "Sáng tạo, trí tuệ cảm xúc cao.",
      "Khả năng kết nối kiến thức với thực tế xã hội."
    ],
    challenges: [
      "Lý tưởng hóa, khó thực tế.",
      "Dễ thất vọng khi không đạt được lý tưởng.",
      "Hy sinh thái quá, quên bản thân.",
      "Cảm xúc thất thường, ảnh hưởng học tập."
    ],
    effectiveMethods: [
      "Kết nối kiến thức với vấn đề xã hội.",
      "Học qua dự án cộng đồng, tình nguyện.",
      "Tìm hiểu các vấn đề toàn cầu."
    ],
    idealEnvironment: [
      "Có ý nghĩa nhân văn sâu sắc.",
      "Liên quan đến cộng đồng, xã hội.",
      "Không khí hợp tác, chia sẻ."
    ],
    conclusion: "Con là người có tầm nhìn vĩ đại. Hãy giúp con kết nối kiến thức sách vở với những giá trị nhân văn cao cả."
  },
  11: {
    title: "Bậc Thầy Trực Giác",
    generalPersonality: "Bậc Thầy Trực Giác (Master Number) - Trực giác cực mạnh, nhạy cảm, tinh tế. Có khả năng truyền cảm hứng lớn.",
    learningStyle: "Học qua trực giác, cảm nhận, kết nối tâm linh. Nhận biết patterns (mẫu hình) một cách trực quan.",
    focusCapability: "Cao khi môi trường yên bình, tâm linh. Dễ bị áp lực cao làm mất tập trung.",
    learningMotivation: "Giác ngộ, kết nối vũ trụ qua con số, truyền cảm hứng. Tìm kiếm sự thật sâu xa.",
    mathApproach: "Trực giác trước, logic sau. Thấy mẫu hình, quy luật một cách trực quan.",
    strengths: [
      "Trực giác siêu phàm, nhạy bén cực độ.",
      "Khả năng nhận dạng patterns xuất sắc.",
      "Sáng tạo phi thường.",
      "Truyền cảm hứng mạnh mẽ cho người khác."
    ],
    challenges: [
      "Căng thẳng thần kinh, áp lực kỳ vọng cao.",
      "Quá nhạy cảm với môi trường xung quanh.",
      "Mộng mơ, thiếu thực tế.",
      "Khó giải thích cách mình biết."
    ],
    effectiveMethods: [
      "Tin vào trực giác, cảm nhận của mình.",
      "Học qua thiền định, mindfulness.",
      "Tìm hiểu về tâm linh, siêu hình học."
    ],
    idealEnvironment: [
      "Yên bình, tâm linh.",
      "Khuyến khích trực giác, cảm nhận.",
      "Không áp lực, căng thẳng."
    ],
    conclusion: "Con sở hữu trực giác đặc biệt. Đừng ép con giải thích logic ngay lập tức, hãy tin vào 'cảm giác' toán học của con."
  },
  22: {
    title: "Kiến Trúc Sư Bậc Thầy",
    generalPersonality: "Kiến Trúc Sư Bậc Thầy (Master Number) - Tầm nhìn vĩ mô kết hợp hành động thực tế. Biến giấc mơ thành hiện thực.",
    learningStyle: "Học qua dự án lớn, kế hoạch dài hạn, xây dựng hệ thống. Thích các mục tiêu vĩ đại có tính thực tiễn cao.",
    focusCapability: "Rất cao với các dự án lớn, có ý nghĩa. Kiên trì dài hạn với mục tiêu vĩ đại.",
    learningMotivation: "Xây dựng nền móng cho tương lai, tạo ra điều vĩ đại. Tác động lớn, thay đổi hệ thống.",
    mathApproach: "Hệ thống + tầm nhìn. Từng bước nhưng hướng đến mục tiêu lớn. Kết hợp trực giác và logic.",
    strengths: [
      "Tham vọng lớn có tính thực tế.",
      "Tổ chức xuất sắc, quản lý dự án tốt.",
      "Kiên định phi thường với mục tiêu lớn.",
      "Kết hợp được lý tưởng và thực tế."
    ],
    challenges: [
      "Áp lực cao từ bản thân và người khác.",
      "Căng thẳng vì mục tiêu quá lớn.",
      "Có thể trở nên cứng nhắc.",
      "Khó chấp nhận thất bại."
    ],
    effectiveMethods: [
      "Lập kế hoạch dài hạn, từng giai đoạn.",
      "Học qua các dự án lớn, có tác động rộng.",
      "Kết hợp lý thuyết và thực hành."
    ],
    idealEnvironment: [
      "Có mục tiêu lớn, tầm ảnh hưởng rộng.",
      "Môi trường nghiêm túc, chuyên nghiệp.",
      "Có nguồn lực để thực hiện dự án lớn."
    ],
    conclusion: "Con có tiềm năng làm nên những điều phi thường. Hãy hỗ trợ con xây dựng những kế hoạch lớn với lộ trình cụ thể."
  },
  33: {
    title: "Người Chữa Lành",
    generalPersonality: "Người Chữa Lành (Master Number) - Tình yêu thương vô điều kiện, sự hy sinh. Mang năng lượng nuôi dưỡng.",
    learningStyle: "Học trong môi trường yêu thương, không cạnh tranh. Thích các hoạt động nghệ thuật và chăm sóc.",
    focusCapability: "Cao khi được chăm sóc người khác. Dễ mất tập trung nếu môi trường xung đột.",
    learningMotivation: "Mang lại niềm vui, sự chữa lành cho người khác. Cống hiến vì tình yêu thương.",
    mathApproach: "Tiếp cận nhẹ nhàng, không áp lực. Thích giải toán để giúp bạn bè.",
    strengths: [
      "Lòng yêu thương và sự tận tụy hiếm có.",
      "Khả năng lắng nghe và xoa dịu nỗi đau.",
      "Sáng tạo và hướng thiện.",
      "Truyền năng lượng tích cực."
    ],
    challenges: [
      "Dễ quên bản thân vì người khác.",
      "Nhạy cảm thái quá với nỗi đau thế giới.",
      "Ôm đồm trách nhiệm.",
      "Dễ bị tổn thương tình cảm."
    ],
    effectiveMethods: [
      "Học nhóm, giúp đỡ bạn bè yếu hơn.",
      "Kết hợp nghệ thuật và tình cảm vào bài học.",
      "Tạo không gian học tập ấm cúng."
    ],
    idealEnvironment: [
      "Đầy tình yêu thương, hỗ trợ.",
      "Không cạnh tranh, ganh đua.",
      "Khuyến khích sự sẻ chia, giúp đỡ."
    ],
    conclusion: "Con là hiện thân của tình yêu thương. Hãy tạo cho con môi trường học tập không áp lực, nơi con có thể giúp đỡ mọi người."
  }
};

export const analyzeProfile = (name: string, dob: string): NumerologyProfile => {
  const lifePath = calculateLifePath(dob);
  
  // Default to Number 1 data if something goes wrong
  const baseProfile = NUMEROLOGY_DATA[lifePath] || NUMEROLOGY_DATA[1];

  return {
    lifePathNumber: lifePath,
    ...baseProfile
  };
};