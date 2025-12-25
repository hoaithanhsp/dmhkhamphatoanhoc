
import React from 'react';
import { ScreenName, UserProfile } from '../types';
import { Home, Map, BarChart2, User, Gamepad2, LogOut, Calculator, Settings } from 'lucide-react';

interface Props {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onLogout?: () => void;
  user: UserProfile;
}

export const SidebarNavigation: React.FC<Props> = ({ currentScreen, onNavigate, onLogout, user }) => {
  const tabs = [
    { id: ScreenName.LEARNING_PATH, icon: Home, label: 'Lộ trình học' },
    { id: ScreenName.GAMES, icon: Gamepad2, label: 'Vui chơi & Giải trí' },
    { id: ScreenName.CHAT, icon: Map, label: 'AI Tutor' },
    { id: ScreenName.PARENT_REPORT, icon: BarChart2, label: 'Báo cáo phụ huynh' },
    { id: ScreenName.PROFILE, icon: User, label: 'Hồ sơ cá nhân' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="p-5 flex items-start gap-3 border-b border-gray-50">
        <div className="bg-primary/10 p-2 rounded-xl text-primary mt-1 shrink-0">
          <Calculator size={20} />
        </div>
        <h1 className="text-sm font-bold text-teal-900 tracking-tight leading-snug uppercase">
          KHÁM PHÁ TOÁN HỌC<br />CÙNG ĐẶNG MINH HẢI
        </h1>
      </div>

      {/* API Key Warning Button - Required by Guidelines */}
      <div className="px-4 pt-4">
        <button
          onClick={() => onNavigate(ScreenName.SETTINGS)}
          className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl p-2.5 flex flex-col items-center justify-center gap-0.5 transition-colors text-center group"
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <Settings size={14} />
            <span>Settings (API Key)</span>
          </div>
          <span className="text-[10px] font-medium text-red-500">Lấy API key để sử dụng app</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group text-left ${isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}
              />
              <span className="text-sm">{tab.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(13,148,136,0.6)]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => onNavigate(ScreenName.SETTINGS)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${currentScreen === ScreenName.SETTINGS ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC_7zYYlnD7-370wtxea2JLC3eyaT9HiyvE8Fasm1QPb0CHRCjmRRv9vWny5FbQzSshnbzDlDsnm2tC3ZkCKnQP_W8WvfiZ4cUh0V7Wupw9yC8kfadRogNZOZ0q36zk1GQZcpyvf89iPySBHxHd3QQ-TfunYawNKuDCM8Utm9uWZ1YdnvMZTSyx08owUTbM3MJUCkZuqQPOvd681CnxqeKmKswzgk_Vx4B8GR36Jsncj4UftqrRvx9dlv640fMgICfmHDrTh57pnI" className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{user.name || "Học sinh"}</p>
            <p className="text-[10px] text-gray-400">Lớp {user.grade}</p>
          </div>
        </button>
      </div>
    </div>
  );
};