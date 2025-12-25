
import React, { useState } from 'react';
import { ChevronLeft, Brain, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onNext: (proficiency: number, habits: string[], notes: string) => void;
  onBack: () => void;
  // Removed direct setProficiency prop, handling via onNext
}

export const AssessmentScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [level, setLevel] = useState(3);
  const [note, setNote] = useState('');
  
  // Habits state
  const [selectedHabits, setSelectedHabits] = useState<string[]>(['🧩 Thích giải đố']);

  const habitsList = [
    { id: 't1', label: '🐢 Tính toán chậm' },
    { id: 't2', label: '🧩 Thích giải đố' },
    { id: 't3', label: '🦋 Dễ mất tập trung' },
    { id: 't4', label: '🥱 Nhanh chán' },
    { id: 't5', label: '🤖 Tư duy logic' },
    { id: 't6', label: '😨 Sợ số học' },
    { id: 't7', label: '📚 Chăm chỉ' },
    { id: 't8', label: '🎮 Thích vừa học vừa chơi' },
  ];

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLevel(val);
  };

  const toggleHabit = (label: string) => {
    if (selectedHabits.includes(label)) {
      setSelectedHabits(selectedHabits.filter(h => h !== label));
    } else {
      setSelectedHabits([...selectedHabits, label]);
    }
  };

  const handleSubmit = () => {
    onNext(level, selectedHabits, note);
  };

  const proficiencyLabels = ["Yếu", "Trung bình", "Khá", "Xuất sắc"];

  return (
    <div className="bg-primary-surface min-h-screen flex flex-col relative text-gray-900">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-primary-surface/90 backdrop-blur-md">
        <button onClick={onBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-teal-100 transition-colors">
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center">Đánh giá năng lực</h2>
        <div className="flex w-10 items-center justify-end">
          <button onClick={handleSubmit} className="text-gray-500 text-sm font-bold hover:text-primary transition-colors">Bỏ qua</button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-3 px-6 pt-2 pb-6">
        <div className="flex gap-6 justify-between items-end">
          <p className="text-sm font-medium">Bước 2/3</p>
          <div className="flex items-center gap-1 text-primary text-xs font-semibold">
            <Brain className="w-4 h-4" />
            <span>Phân tích AI</span>
          </div>
        </div>
        <div className="rounded-full bg-teal-100 h-2 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '66%' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-24 gap-6">
        <div>
          <h1 className="tracking-tight text-2xl font-bold leading-tight text-left mb-2">
            Khả năng học toán hiện tại của học sinh?
          </h1>
          <p className="text-gray-500 text-base font-normal leading-relaxed">
            Hãy đánh giá trung thực để AI có thể thiết kế lộ trình phù hợp nhất.
          </p>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Học lực chung</h3>
            <span className="text-primary text-sm font-bold bg-teal-100 px-3 py-1 rounded-full">{proficiencyLabels[level - 1]}</span>
          </div>
          <div className="relative pt-2 pb-6">
            <input 
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-primary" 
              type="range" min="1" max="4" 
              value={level}
              onChange={handleLevelChange}
              style={{ accentColor: '#0d9488' }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium px-1">
              <span>Yếu</span>
              <span>Trung bình</span>
              <span className="text-primary font-bold">Khá</span>
              <span>Xuất sắc</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold">Đặc điểm thói quen</h3>
          <p className="text-xs text-gray-500 mb-1">Chọn các từ khóa mô tả đúng nhất (có thể chọn nhiều)</p>
          <div className="flex flex-wrap gap-2.5">
            {habitsList.map(tag => {
              const isChecked = selectedHabits.includes(tag.label);
              return (
                <div key={tag.id} className="relative group">
                  <input 
                    type="checkbox" 
                    id={tag.id} 
                    checked={isChecked}
                    onChange={() => toggleHabit(tag.label)}
                    className="peer sr-only" 
                  />
                  <label 
                    htmlFor={tag.id}
                    className={`cursor-pointer inline-flex items-center justify-center px-4 py-2.5 border rounded-xl text-sm font-medium transition-all select-none shadow-sm
                      ${isChecked 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'border-teal-100 text-slate-600 bg-white hover:border-primary/50'
                      }`}
                  >
                    {tag.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Ghi chú cho AI</h3>
            <span className="text-xs text-primary font-medium bg-teal-100 px-2 py-0.5 rounded">Tùy chọn</span>
          </div>
          <div className="relative">
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white text-sm rounded-xl p-4 border border-teal-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-400 resize-none h-32 leading-relaxed shadow-sm"
              placeholder="Ví dụ: Bé thường gặp khó khăn với các bài toán hình học không gian, nhưng lại tính nhẩm rất nhanh..."
            ></textarea>
            <div className="absolute bottom-3 right-3 text-primary opacity-80 pointer-events-none">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary-surface via-primary-surface to-transparent z-20 flex justify-center w-full max-w-md mx-auto">
        <button 
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <span>Tiếp tục phân tích</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
