import React from 'react';
import { ArrowLeft, Calculator, Lightbulb, Check, AlertTriangle, ArrowRight, Sparkles, BrainCircuit, BookOpen } from 'lucide-react';
import { UserProfile } from '../../types';

interface Props {
  user: UserProfile;
  onNext: () => void;
  onBack: () => void;
}

export const AnalysisResultScreen: React.FC<Props> = ({ user, onNext, onBack }) => {
  // Fallback data if profile is missing (though it should be calculated)
  const profile = user.numerologyProfile || {
    lifePathNumber: 7,
    title: "Nhà Tư Duy Phân Tích",
    description: "Con sở hữu tư duy phân tích sắc bén và trực giác mạnh mẽ. Con thích tự mình khám phá nguyên lý của các bài toán hơn là học vẹt công thức.",
    strengths: ["Nhạy bén với hình học không gian", "Tốc độ tính nhẩm nhanh"],
    weaknesses: ["Dễ mất kiên nhẫn", "Cần cải thiện trình bày"],
    learningStyle: "Tự học, nghiên cứu sâu",
    mathApproach: "Các bài toán logic, đố vui"
  };

  return (
    <div className="bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] min-h-screen font-display antialiased text-slate-800 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-8 pb-2">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-white">
          <Calculator className="w-6 h-6 drop-shadow-sm" />
          <span className="font-bold text-sm md:text-lg tracking-tight drop-shadow-sm uppercase">KHÁM PHÁ TOÁN HỌC CÙNG ĐẶNG MINH HẢI</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="relative z-10 flex-1 w-full px-5 pb-32 overflow-y-auto no-scrollbar">
        <div className="text-center mb-8 mt-4">
          <h1 className="text-white text-2xl font-bold mb-2 leading-tight drop-shadow-sm">Kết quả phân tích <br/> cá nhân hóa</h1>
          <p className="text-teal-50 text-sm font-medium opacity-90">Dựa trên file "Bộ Não AI - Thần Số Học"</p>
        </div>

        {/* Main Numerology Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-teal-900/10 mb-5 relative overflow-hidden">
           {/* Abstract Icon Background */}
           <div className="absolute -top-6 -right-6 text-teal-50 pointer-events-none opacity-50">
             <BrainCircuit size={160} strokeWidth={1} />
           </div>

           <div className="relative z-10">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[11px] font-bold mb-4 tracking-wide uppercase border border-orange-100">
               <Sparkles className="w-3.5 h-3.5" />
               Tổng quan tính cách
             </div>
             
             <div className="flex items-start gap-4 mb-4">
               <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                 <span className="text-2xl font-bold">{profile.lifePathNumber}</span>
               </div>
               <div>
                 <h2 className="text-slate-800 text-xl font-bold leading-tight mb-1">{profile.title}</h2>
                 <p className="text-primary-dark text-sm font-semibold">Số chủ đạo (Life Path)</p>
               </div>
             </div>
             
             <p className="text-slate-600 text-sm leading-relaxed font-body">
               {profile.description}
             </p>
           </div>
        </div>

        {/* Learning Style Card */}
        <div className="bg-white/95 rounded-[2rem] p-5 shadow-lg shadow-teal-900/5 mb-5 border border-white/50">
           <div className="flex items-center gap-2 mb-2">
             <BookOpen className="text-primary w-5 h-5" />
             <h3 className="font-bold text-slate-800">Phong cách học tập</h3>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed mb-3">
             {profile.learningStyle}
           </p>
           <div className="bg-teal-50 p-3 rounded-xl border border-teal-100">
             <p className="text-xs font-bold text-teal-800 uppercase mb-1">Chiến lược dạy toán:</p>
             <p className="text-xs text-teal-700 italic">"{profile.mathApproach}"</p>
           </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-teal-900/5 mb-5">
           <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-50">
             <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined text-primary text-xl">verified</span>
             </div>
             <h3 className="text-slate-800 font-bold text-lg">Điểm mạnh nổi bật</h3>
           </div>
           <div className="space-y-4">
             {profile.strengths.slice(0, 3).map((text, i) => (
               <div key={i} className="flex gap-4 items-start">
                 <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                   <Check className="text-primary w-3 h-3" strokeWidth={4} />
                 </div>
                 <p className="text-slate-600 text-sm font-medium leading-snug">{text}</p>
               </div>
             ))}
           </div>
        </div>

        {/* Weaknesses */}
         <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-teal-900/5 mb-5">
           <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-50">
             <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined text-red-500 text-xl">crisis_alert</span>
             </div>
             <h3 className="text-slate-800 font-bold text-lg">Thử thách (Tử huyệt)</h3>
           </div>
           <div className="space-y-4">
             {profile.weaknesses.slice(0, 2).map((text, i) => (
               <div key={i} className="flex gap-4 items-start">
                 <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                 <p className="text-slate-600 text-sm font-medium leading-snug">{text}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-20 px-6 pt-4 pb-8 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[2rem] max-w-md mx-auto">
        <button 
          onClick={onNext}
          className="w-full flex cursor-pointer items-center justify-center rounded-2xl h-14 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 text-white text-lg font-bold shadow-xl shadow-slate-900/20 group"
        >
          <span>Xem lộ trình học</span>
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

       <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </div>
  );
};