
import React from 'react';
import { ArrowLeft, Calculator, Lightbulb, Check, AlertTriangle, ArrowRight, Sparkles, BrainCircuit, BookOpen, Target, Puzzle, Zap, Award, Home, MessageCircle } from 'lucide-react';
import { UserProfile } from '../../types';

interface Props {
  user: UserProfile;
  onNext: () => void;
  onBack: () => void;
}

export const AnalysisResultScreen: React.FC<Props> = ({ user, onNext, onBack }) => {
  const profile = user.numerologyProfile;

  if (!profile) return <div>Đang tải dữ liệu...</div>;

  const DetailCard = ({ icon: Icon, title, content, colorClass }: { icon: any, title: string, content: string | string[], colorClass: string }) => (
    <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white/50 h-full flex flex-col">
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 ${colorClass}`}>
        <Icon className="w-5 h-5" />
        <h3 className="font-bold text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="flex-1 text-sm text-slate-600 leading-relaxed">
        {Array.isArray(content) ? (
          <ul className="space-y-2">
            {content.map((item, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] min-h-screen font-display antialiased text-slate-800 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-0"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-white">
          <Calculator className="w-6 h-6 drop-shadow-sm" />
          <span className="font-bold text-sm md:text-lg tracking-tight drop-shadow-sm uppercase">KHÁM PHÁ TOÁN HỌC CÙNG ĐẶNG MINH HẢI</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="relative z-10 flex-1 w-full px-4 pb-32 overflow-y-auto no-scrollbar">
        <div className="text-center mb-6 mt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-primary text-3xl font-bold shadow-lg mb-2 border-4 border-teal-200">
            {profile.lifePathNumber}
          </div>
          <h1 className="text-white text-2xl font-bold leading-tight drop-shadow-sm">Hồ sơ Thần Số Học</h1>
          <p className="text-teal-50 text-sm font-medium opacity-90">Báo cáo chi tiết dành riêng cho {user.name}</p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          
          {/* Row 1 */}
          <DetailCard 
            icon={Sparkles} 
            title="Tổng quan tính cách" 
            content={profile.generalPersonality} 
            colorClass="text-purple-600"
          />
          <DetailCard 
            icon={BookOpen} 
            title="Phong cách học tập" 
            content={profile.learningStyle} 
            colorClass="text-blue-600"
          />

          {/* Row 2 */}
          <DetailCard 
            icon={Target} 
            title="Khiếu năng lực tập trung" 
            content={profile.focusCapability} 
            colorClass="text-red-600"
          />
          <DetailCard 
            icon={Zap} 
            title="Động lực học tập" 
            content={profile.learningMotivation} 
            colorClass="text-orange-600"
          />

          {/* Row 3 */}
          <DetailCard 
            icon={Puzzle} 
            title="Cách tiếp cận bài toán" 
            content={profile.mathApproach} 
            colorClass="text-indigo-600"
          />
          <DetailCard 
            icon={Check} 
            title="Điểm mạnh nổi bật" 
            content={profile.strengths} 
            colorClass="text-green-600"
          />

          {/* Row 4 */}
          <DetailCard 
            icon={AlertTriangle} 
            title="Thách thức cần khắc phục" 
            content={profile.challenges} 
            colorClass="text-amber-600"
          />
          <DetailCard 
            icon={Award} 
            title="Phương pháp học hiệu quả" 
            content={profile.effectiveMethods} 
            colorClass="text-cyan-600"
          />

          {/* Row 5 */}
          <DetailCard 
            icon={Home} 
            title="Môi trường học tập lý tưởng" 
            content={profile.idealEnvironment} 
            colorClass="text-pink-600"
          />
          <DetailCard 
            icon={MessageCircle} 
            title="Kết luận & Khuyến nghị" 
            content={profile.conclusion} 
            colorClass="text-teal-600"
          />

        </div>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-20 px-6 pt-4 pb-8 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[2rem] max-w-md mx-auto md:max-w-full md:bg-transparent md:border-none md:shadow-none pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto md:bg-white md:p-4 md:rounded-2xl md:shadow-xl">
            <button 
            onClick={onNext}
            className="w-full flex cursor-pointer items-center justify-center rounded-2xl h-14 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 text-white text-lg font-bold shadow-xl shadow-slate-900/20 group"
            >
            <span>Thiết lập lộ trình học</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};
