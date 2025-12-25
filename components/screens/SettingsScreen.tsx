
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Brain, UserCog, ChevronRight, Bell, Globe, Shield, Info, FileText, LogOut, X, School, CheckCircle, Trophy, Key, Cpu, ExternalLink } from 'lucide-react';
import { UserProfile } from '../../types';

interface Props {
    user: UserProfile;
    onLogout: () => void;
    onBack: () => void;
}

type ModalType = 'notifications' | 'about' | 'apikey' | null;

const AI_MODELS = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash', desc: 'Tốc độ cao, Phản hồi nhanh (Mặc định)', recommended: true },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', desc: 'Thông minh hơn, Xử lý phức tạp', recommended: false },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Phiên bản ổn định', recommended: false },
];

export const SettingsScreen: React.FC<Props> = ({ user, onLogout, onBack }) => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [apiKey, setApiKey] = useState('');
    const [isVisibleValues, setIsVisibleValues] = useState(false);

    useEffect(() => {
        const key = localStorage.getItem('user_api_key');
        if (key) setApiKey(key);
    }, []);

    const handleSaveKey = (val: string) => {
        setApiKey(val);
        localStorage.setItem('user_api_key', val);
    };

    const getNumerologyTitle = (num: number) => {
        // Simple mapping or fallback
        const titles: Record<number, string> = {
            1: "Người Tiên Phong",
            2: "Người Hòa Giải",
            3: "Người Truyền Cảm Hứng",
            4: "Người Kiến Tạo",
            5: "Người Tự Do",
            6: "Người Chăm Sóc",
            7: "Nhà Tư Duy",
            8: "Người Điều Hành",
            9: "Người Cho Đi",
            11: "Bậc Thầy Trực Giác",
            22: "Kiến Trúc Sư Đại Tài",
            33: "Người Chữa Lành"
        };
        return titles[num] || "Người Khám Phá";
    };

    // --- Notification Logic ---
    const renderNotifications = () => {
        const history = user.history || [];
        const today = new Date().toDateString();

        // Calculate Today's Stats
        const todayLessons = history.filter(h => new Date(h.timestamp || 0).toDateString() === today);
        const todayXP = todayLessons.reduce((acc, h) => acc + (h.score * 10), 0);

        // Calculate Week Stats (Last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekLessons = history.filter(h => new Date(h.timestamp || 0) >= oneWeekAgo);

        return (
            <div className="flex flex-col gap-4">
                {/* Header Summary */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-lg">Cập nhật tiến độ</h3>
                    </div>
                    <p className="text-teal-50 text-sm">Đây là tóm tắt hoạt động học tập của bạn.</p>
                </div>

                {/* Today's Notification */}
                <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Hoạt động hôm nay</h4>
                        {todayLessons.length > 0 ? (
                            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                Bạn đã hoàn thành <strong>{todayLessons.length} bài học</strong> và đạt được <strong>{todayXP} XP</strong> hôm nay. Tiếp tục phát huy nhé!
                            </p>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                Hôm nay bạn chưa làm bài tập nào. Hãy dành chút thời gian để học nhé!
                            </p>
                        )}
                        <span className="text-[10px] text-gray-400 mt-2 block">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {/* Weekly Notification */}
                <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Tổng kết tuần</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                            Trong 7 ngày qua, bạn đã hoàn thành tổng cộng <strong>{weekLessons.length} bài học</strong>.
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block">Cập nhật tự động</span>
                    </div>
                </div>

                {/* System Notification */}
                <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-full shrink-0">
                        <School className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Nhắc nhở ôn tập</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                            Kỳ thi giữa kỳ đang đến gần. Đừng quên kiểm tra phần "Ôn tập" trong Lộ trình học nhé.
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block">Hệ thống</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-primary-surface dark:bg-dark-bg font-display text-gray-900 dark:text-white antialiased min-h-screen flex flex-col relative">
            <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                    <ArrowLeft />
                </button>
                <h1 className="text-lg font-bold leading-tight flex-1 text-center pr-10">Cài đặt</h1>
            </header>

            <main className="flex-1 flex flex-col gap-6 p-4 w-full">

                {/* AI Configuration Section - NEW */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Cpu size={14} className="text-primary" /> Cấu hình AI
                    </h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-4">

                        {/* API Key Input */}
                        <div>
                            <label className="text-sm font-bold block mb-2 flex justify-between">
                                API Key Gemini
                                <span
                                    onClick={() => setIsVisibleValues(!isVisibleValues)}
                                    className="text-xs font-normal text-primary cursor-pointer hover:underline"
                                >
                                    {isVisibleValues ? 'Ẩn' : 'Hiện'}
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={isVisibleValues ? "text" : "password"}
                                    value={apiKey}
                                    onChange={(e) => handleSaveKey(e.target.value)}
                                    placeholder="Nhập API Key của bạn..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                                />
                            </div>
                            <div className="mt-2 text-xs text-gray-500 flex flex-col gap-1">
                                <p className="flex items-center gap-1">
                                    Chưa có key? <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline flex items-center gap-0.5">Lấy Key tại Google AI Studio <ExternalLink size={10} /></a>
                                </p>
                                <p>
                                    <a href="https://tinyurl.com/hdsdpmTHT" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-700 underline">Xem hướng dẫn chi tiết cách lấy key</a>
                                </p>
                            </div>
                        </div>

                        {/* Model Selection */}
                        <div>
                            <p className="text-sm font-bold mb-3">Model sử dụng (Ưu tiên)</p>
                            <div className="grid grid-cols-1 gap-2">
                                {AI_MODELS.map(model => (
                                    <div key={model.id} className={`border rounded-xl p-3 flex items-center gap-3 transition-all ${model.id === 'gemini-3-flash-preview' // Highlight default
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                            : 'border-gray-100 dark:border-gray-700 opacity-80'
                                        }`}>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${model.id === 'gemini-3-flash-preview' ? 'border-primary' : 'border-gray-300'
                                            }`}>
                                            {model.id === 'gemini-3-flash-preview' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{model.name}</span>
                                                {model.recommended && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">Khuyên dùng</span>}
                                            </div>
                                            <p className="text-xs text-gray-500">{model.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 italic">*Hệ thống sẽ tự động chuyển đổi model nếu gặp lỗi quá tải.</p>
                        </div>
                    </div>
                </section>

                {/* Profile */}
                <section className="flex flex-col gap-3">
                    <h3 className="px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Hồ sơ</h3>
                    <div className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="relative shrink-0">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-16 w-16 border-2 border-primary" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAC_7zYYlnD7-370wtxea2JLC3eyaT9HiyvE8Fasm1QPb0CHRCjmRRv9vWny5FbQzSshnbzDlDsnm2tC3ZkCKnQP_W8WvfiZ4cUh0V7Wupw9yC8kfadRogNZOZ0q36zk1GQZcpyvf89iPySBHxHd3QQ-TfunYawNKuDCM8Utm9uWZ1YdnvMZTSyx08owUTbM3MJUCkZuqQPOvd681CnxqeKmKswzgk_Vx4B8GR36Jsncj4UftqrRvx9dlv640fMgICfmHDrTh57pnI")' }}></div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-[#102221] text-xs font-bold size-6 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-bg">
                                {user.numerologyNumber}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                            <h2 className="text-lg font-bold leading-tight truncate">{user.name || "Học Sinh"}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">Học sinh lớp {user.grade}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Brain className="text-primary w-4 h-4" />
                                <span className="text-xs font-medium text-teal-700 dark:text-primary">{getNumerologyTitle(user.numerologyNumber)}</span>
                            </div>
                        </div>
                        <button className="shrink-0 text-gray-400 hover:text-primary transition-colors">
                            <Edit className="w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* Account */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Tài khoản</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group">
                            <div className="flex items-center justify-center rounded-xl bg-primary/10 text-teal-700 dark:text-primary shrink-0 size-10 group-hover:bg-primary group-hover:text-black transition-colors">
                                <UserCog className="w-5 h-5" />
                            </div>
                            <div className="flex-1 truncate">
                                <p className="text-[15px] font-medium">Quản lý tài khoản</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Mật khẩu, Email</p>
                            </div>
                            <ChevronRight className="text-gray-400 w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* General */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Cài đặt chung</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        <button
                            onClick={() => setActiveModal('notifications')}
                            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 shrink-0 size-10">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1 truncate">
                                <p className="text-[15px] font-medium">Thông báo</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Cập nhật tiến độ học tập</p>
                            </div>
                            <ChevronRight className="text-gray-400 w-5 h-5" />
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group">
                            <div className="flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0 size-10">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="flex-1 flex justify-between items-center pr-2">
                                <p className="text-[15px] font-medium truncate">Ngôn ngữ</p>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Tiếng Việt</span>
                            </div>
                            <ChevronRight className="text-gray-400 w-5 h-5" />
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group">
                            <div className="flex items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400 shrink-0 size-10">
                                <Shield className="w-5 h-5" />
                            </div>
                            <p className="text-[15px] font-medium flex-1 truncate">Quyền riêng tư</p>
                            <ChevronRight className="text-gray-400 w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* Info */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin khác</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        <button
                            onClick={() => setActiveModal('about')}
                            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 shrink-0 size-10">
                                <Info className="w-5 h-5" />
                            </div>
                            <p className="text-[15px] font-medium flex-1 truncate">Về ứng dụng</p>
                            <ChevronRight className="text-gray-400 w-5 h-5" />
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group">
                            <div className="flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 shrink-0 size-10">
                                <FileText className="w-5 h-5" />
                            </div>
                            <p className="text-[15px] font-medium flex-1 truncate">Điều khoản sử dụng</p>
                            <ChevronRight className="text-gray-400 w-5 h-5" />
                        </button>
                    </div>
                </section>

                <button onClick={onLogout} className="mt-2 w-full bg-white dark:bg-surface-dark text-rose-500 font-bold py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:bg-rose-50 dark:active:bg-rose-900/20 transition-all flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                </button>

                <div className="pb-6 pt-2 text-center">
                    <p className="text-xs text-gray-500 font-medium">MathAI Education</p>
                    <p className="text-[10px] text-gray-400 mt-1">Phiên bản 1.0.2 (Build 2024)</p>
                </div>
            </main>

            {/* MODAL OVERLAY */}
            {activeModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slide-up relative">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {activeModal === 'notifications' ? 'Thông báo' : activeModal === 'about' ? 'Về ứng dụng' : 'Cấu hình'}
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 overflow-y-auto">
                            {activeModal === 'notifications' && renderNotifications()}

                            {activeModal === 'about' && (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                                        <School size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-teal-900 dark:text-white mb-2 text-center">KHÁM PHÁ TOÁN HỌC CÙNG ĐẶNG MINH HẢI</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                        Ứng dụng học toán thông minh kết hợp trí tuệ nhân tạo và thần số học, giúp cá nhân hóa lộ trình học tập cho từng học sinh.
                                    </p>

                                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800 w-full text-left mb-4">
                                        <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase mb-2">Đội ngũ phát triển</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-normal">
                                            Phát triển bởi thầy <span className="text-primary font-bold">Trần Hoài Thanh</span>
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            THPT Khúc Thừa Dụ - TP Hải Phòng
                                        </p>
                                    </div>

                                    <p className="text-[10px] text-gray-400">
                                        © 2024 Bản quyền thuộc về tác giả.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};