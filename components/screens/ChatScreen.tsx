
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MoreVertical, Calculator, Brain, LifeBuoy, Send, Bot, User, Sparkles, Lightbulb, BookOpen, PenTool, Loader2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  user?: UserProfile; // Optional prop to support fallback
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

type HelpLevel = 'hint' | 'guide' | 'solution';

export const ChatScreen: React.FC<Props> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [helpLevel, setHelpLevel] = useState<HelpLevel>('guide');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat History with a personalized welcome message
  useEffect(() => {
    const numerologyTitle = user?.numerologyProfile?.title || "Nhà Toán Học Tương Lai";
    const name = user?.name ? user.name.split(' ').pop() : "bạn";
    
    const initialMessage: Message = {
      id: 'welcome',
      role: 'model',
      text: `Chào ${name}! Mình là AI Tutor đây. \n\nVới tư chất của một **${numerologyTitle}**, mình tin bạn sẽ chinh phục môn Toán lớp ${user?.grade || 8} dễ dàng. \n\nBạn đang gặp khó khăn ở bài nào? Hãy chọn mức độ hỗ trợ bên dưới nhé! 👇`,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct System Instruction based on User Profile
      const systemInstruction = `
        Bạn là một gia sư Toán học AI thân thiện, thông minh và kiên nhẫn.
        Học sinh của bạn tên là ${user?.name || 'Học sinh'}, đang học lớp ${user?.grade || 8}.
        
        Đặc điểm thần số học: ${user?.numerologyProfile?.title || 'Không rõ'} - ${user?.numerologyProfile?.generalPersonality || ''}.
        Phong cách học tập: ${user?.numerologyProfile?.learningStyle || 'Trực quan'}.
        
        QUY TẮC TRẢ LỜI (RẤT QUAN TRỌNG):
        1. Luôn sử dụng Tiếng Việt.
        2. Phong cách: Gần gũi, khích lệ, dùng emoji phù hợp.
        3. Định dạng Toán học: Sử dụng Unicode đẹp (², ³, √, π, ÷, ×) hoặc HTML (<sup>, <sub>) để hiển thị công thức rõ ràng. KHÔNG dùng LaTeX thuần ($...$).
        
        CHẾ ĐỘ HỖ TRỢ HIỆN TẠI: ${helpLevel.toUpperCase()}
        - Nếu chế độ là 'HINT' (Gợi ý nhẹ): CHỈ đưa ra gợi ý, công thức liên quan hoặc bước đầu tiên. KHÔNG giải hết. Khuyến khích học sinh tự làm tiếp.
        - Nếu chế độ là 'GUIDE' (Hướng dẫn): Chỉ ra các bước giải (Step-by-step) nhưng để lại phần tính toán cuối cùng cho học sinh.
        - Nếu chế độ là 'SOLUTION' (Giải chi tiết): Giải chi tiết từ A-Z và đưa ra đáp án cuối cùng. Giải thích cặn kẽ tại sao lại làm như vậy.
        
        Hãy phản hồi dựa trên yêu cầu của học sinh và chế độ hỗ trợ đã chọn.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            ...messages.slice(-5).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: `[Chế độ: ${helpLevel}] ${userMessage.text}` }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const aiResponseText = response.text || "Xin lỗi, mình đang gặp chút trục trặc. Bạn thử lại nhé!";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Ôi, kết nối bị gián đoạn rồi. Bạn kiểm tra lại mạng giúp mình nhé! 🔌",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-primary-surface dark:bg-dark-bg font-display h-screen flex flex-col overflow-hidden text-gray-900 dark:text-white transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border-2 border-primary shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxFoFckWvUOySFEn5vYjE7CQAY1fArdTKZzuAfZ1JH_MXWGFOcoEzhPO7poPrsyIvdJot5ccD7NyBv0fGMnMFAJv-5Hen1WSdOjvAx-qFusi8OPqlWXiolrdt2o6VeAToc0q39_SUsS7bw9OYdcPTJlzpxLElqvMiVjO2PyskLHJ_s_zdWPGIWCQ8XuKkJvfahbJ2nNB3sHWo5uX03-Y5wdF6heCqSTr-nx8x0fOadCtEmZsXZ70nR-xL1NxfP8iWHp90144kOU-8")' }}></div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-bg"></div>
            </div>
            <div className="flex flex-col">
                <h2 className="text-base font-bold leading-tight">AI Tutor</h2>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">Luôn sẵn sàng</span>
            </div>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-4 scroll-smooth bg-gradient-to-b from-primary/5 to-primary-surface dark:from-dark-bg dark:to-dark-bg relative">
        <div className="flex justify-center mb-6">
          <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide">
            Hôm nay
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                         <div className="bg-center bg-no-repeat bg-cover rounded-full w-8 h-8 shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxFoFckWvUOySFEn5vYjE7CQAY1fArdTKZzuAfZ1JH_MXWGFOcoEzhPO7poPrsyIvdJot5ccD7NyBv0fGMnMFAJv-5Hen1WSdOjvAx-qFusi8OPqlWXiolrdt2o6VeAToc0q39_SUsS7bw9OYdcPTJlzpxLElqvMiVjO2PyskLHJ_s_zdWPGIWCQ8XuKkJvfahbJ2nNB3sHWo5uX03-Y5wdF6heCqSTr-nx8x0fOadCtEmZsXZ70nR-xL1NxfP8iWHp90144kOU-8")' }}></div>
                    )}
                    
                    <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 shadow-sm text-sm leading-relaxed math-formula whitespace-pre-wrap ${
                            msg.role === 'user' 
                            ? 'bg-primary text-[#102221] rounded-2xl rounded-br-none font-medium' 
                            : 'bg-white dark:bg-surface-dark text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700'
                        }`}>
                           <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium px-1">
                            {msg.role === 'user' ? 'Bạn' : 'AI Tutor'} • {formatTime(msg.timestamp)}
                        </span>
                    </div>

                    {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                            <User size={16} />
                        </div>
                    )}
                </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
                <div className="flex items-end gap-2 justify-start animate-fade-in-up">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full w-8 h-8 shrink-0 border border-gray-200 dark:border-gray-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxFoFckWvUOySFEn5vYjE7CQAY1fArdTKZzuAfZ1JH_MXWGFOcoEzhPO7poPrsyIvdJot5ccD7NyBv0fGMnMFAJv-5Hen1WSdOjvAx-qFusi8OPqlWXiolrdt2o6VeAToc0q39_SUsS7bw9OYdcPTJlzpxLElqvMiVjO2PyskLHJ_s_zdWPGIWCQ8XuKkJvfahbJ2nNB3sHWo5uX03-Y5wdF6heCqSTr-nx8x0fOadCtEmZsXZ70nR-xL1NxfP8iWHp90144kOU-8")' }}></div>
                    <div className="px-4 py-3 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span className="text-xs text-gray-500 font-medium italic">Đang suy nghĩ...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Controls & Input */}
      <div className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 z-30 pb-safe">
         
         {/* Help Level Selector */}
         <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-50 dark:border-gray-800">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Chế độ:</span>
             
             <button 
                onClick={() => setHelpLevel('hint')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    helpLevel === 'hint' 
                    ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-700' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                }`}
             >
                <Lightbulb size={14} />
                Gợi ý nhẹ
             </button>

             <button 
                onClick={() => setHelpLevel('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    helpLevel === 'guide' 
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-700' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                }`}
             >
                <BookOpen size={14} />
                Hướng dẫn
             </button>

             <button 
                onClick={() => setHelpLevel('solution')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    helpLevel === 'solution' 
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-200 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-700' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                }`}
             >
                <PenTool size={14} />
                Giải chi tiết
             </button>
         </div>

         {/* Input Area */}
         <div className="p-3 pb-6 flex items-end gap-2 max-w-4xl mx-auto">
            <button className="flex shrink-0 items-center justify-center rounded-full size-11 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-teal-50 hover:text-primary transition-colors">
                <Calculator size={20} />
            </button>
            
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 py-2 p-0 resize-none max-h-24 no-scrollbar" 
                    placeholder="Nhập bài toán hoặc câu hỏi..." 
                    rows={1}
                />
            </div>
            
            <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className={`flex shrink-0 items-center justify-center rounded-full size-11 transition-all transform active:scale-95 shadow-md ${
                    !inputText.trim() || isTyping 
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-[#102221] hover:bg-primary-dark hover:shadow-lg'
                }`}
            >
                <Send size={20} className={!inputText.trim() ? "" : "ml-0.5"} />
            </button>
        </div>
      </div>
    </div>
  );
};
