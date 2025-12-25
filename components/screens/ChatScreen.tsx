import React from 'react';
import { ChevronLeft, MoreVertical, Route, Calculator, Brain, LifeBuoy, Plus, Mic, Send } from 'lucide-react';

export const ChatScreen = () => {
  return (
    <div className="bg-primary-surface dark:bg-dark-bg font-display h-screen flex flex-col overflow-hidden text-gray-900 dark:text-white transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center flex-1 mx-2">
          <h2 className="text-lg font-bold leading-tight tracking-tight">Trợ lý Học tập AI</h2>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs text-teal-600 dark:text-gray-400 font-medium">Đang hoạt động</span>
          </div>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MoreVertical />
        </button>
      </header>

      {/* Main Chat */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 scroll-smooth bg-gradient-to-b from-primary/5 to-primary-surface dark:from-primary/5 dark:to-dark-bg relative">
        <div className="flex justify-center mb-6">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-medium">Hôm nay, 10:30</span>
        </div>

        {/* AI Message */}
        <div className="flex items-end gap-3 mb-6 animate-fade-in-up">
          <div className="relative shrink-0">
            <div className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border-2 border-white dark:border-gray-600 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxFoFckWvUOySFEn5vYjE7CQAY1fArdTKZzuAfZ1JH_MXWGFOcoEzhPO7poPrsyIvdJot5ccD7NyBv0fGMnMFAJv-5Hen1WSdOjvAx-qFusi8OPqlWXiolrdt2o6VeAToc0q39_SUsS7bw9OYdcPTJlzpxLElqvMiVjO2PyskLHJ_s_zdWPGIWCQ8XuKkJvfahbJ2nNB3sHWo5uX03-Y5wdF6heCqSTr-nx8x0fOadCtEmZsXZ70nR-xL1NxfP8iWHp90144kOU-8")' }}></div>
          </div>
          <div className="flex flex-col gap-1 items-start max-w-[80%]">
             <span className="text-teal-600 dark:text-gray-400 text-xs font-medium">AI Tutor</span>
             <div className="p-3.5 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed border border-gray-100 dark:border-gray-700">
               <p>Xin chào! Mình là AI trợ giảng của bạn. Dựa trên phân tích thần số học, hôm nay là ngày tuyệt vời để bạn thử sức với <strong>Hình học không gian</strong>. Bạn cần mình giúp gì không?</p>
             </div>
          </div>
        </div>

        {/* Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-1 pl-1">
           {[
             { icon: Route, label: 'Lộ trình học' },
             { icon: Calculator, label: 'Giải bài tập' },
             { icon: Brain, label: 'Thần số học' },
             { icon: LifeBuoy, label: 'Hỗ trợ' }
           ].map((chip, i) => (
             <button key={i} className="flex shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary transition-all pl-3 pr-4 py-1.5 shadow-sm group">
               <chip.icon className="text-primary w-[18px] h-[18px]" />
               <p className="text-xs font-medium group-hover:text-primary-dark">{chip.label}</p>
             </button>
           ))}
        </div>

        {/* User Message */}
        <div className="flex items-end gap-3 mb-6 justify-end">
          <div className="flex flex-col gap-1 items-end max-w-[80%]">
             <div className="p-3.5 bg-primary rounded-2xl rounded-br-none shadow-md text-sm text-[#102221] font-medium leading-relaxed">
               <p>Mình đang gặp khó khăn với bài tập về hình nón. Bạn có thể giải thích công thức tính thể tích không?</p>
             </div>
             <span className="text-[10px] text-gray-400 font-medium mt-1">Đã xem 10:32</span>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex items-end gap-3 mb-6">
           <div className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 shrink-0 border-2 border-white dark:border-gray-600 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBN3W2Wlp8PuXmxW-lt9TWa4nAmLGXylotsT0TbKeC8f-9Pj0XWS8h1u-s1wEti1Ok-H2Jom47piHBav7hCY4WkQRb3y-RyIm05IgEsfG4fjtKKwiLxx4sV4P3p2D6LIJRIC9IY3RJSoe5vVz-TtyRjodDiNKNHARtZXoiTTjl2K_zQruJHzeUagFwxfcscYxGkmkAEFgxdRnWkTM9VKnFnUOmUMkJ35xJ6c3owQCKysnWC0GYlIF-LhbLqgjtM2kliBfdmIjLBEtY")' }}></div>
           <div className="flex flex-col gap-1 items-start max-w-[85%]">
              <span className="text-teal-600 dark:text-gray-400 text-xs font-medium">AI Tutor</span>
              <div className="p-3.5 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed border border-gray-100 dark:border-gray-700">
                <p className="mb-2">Đừng lo! Công thức tính thể tích hình nón là:</p>
                <div className="bg-primary-surface dark:bg-dark-bg p-3 rounded-lg border-l-4 border-primary mb-2 font-mono text-xs">
                  V = 1/3 * π * r² * h
                </div>
                <p>Hãy chụp ảnh bài tập hoặc nhập số liệu cụ thể vào đây, mình sẽ hướng dẫn bạn giải chi tiết từng bước nhé. 📸</p>
              </div>
           </div>
        </div>
      </main>

      {/* Input */}
      <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 p-3 pb-6 z-30">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <button className="flex shrink-0 items-center justify-center rounded-full size-11 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Plus />
          </button>
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
            <input className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 py-1.5 p-0" placeholder="Hỏi về bài toán..." type="text"/>
            <button className="ml-2 text-gray-400 hover:text-primary transition-colors">
              <Mic size={20} />
            </button>
          </div>
          <button className="flex shrink-0 items-center justify-center rounded-full size-11 bg-primary text-[#102221] hover:bg-primary-dark shadow-md hover:shadow-lg transition-all transform active:scale-95">
             <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
