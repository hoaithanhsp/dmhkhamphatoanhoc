
import React, { useState, useEffect } from 'react';
import { Settings, Key, ExternalLink, AlertTriangle, Check, CreditCard, Cpu } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'user_gemini_api_key';
const MODELS = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash', description: 'Nhanh nhất & Hiệu quả (Mặc định)', recommended: true },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', description: 'Cân bằng giữa tốc độ & trí tuệ', recommended: false },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Phiên bản ổn định năm ngoái', recommended: false }
];

export const Header: React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [hasKey, setHasKey] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview'); // Just visual preference for now

    useEffect(() => {
        const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (storedKey) {
            setApiKey(storedKey);
            setHasKey(true);
        } else {
            // If no key, show modal automatically on first visit (optional, but good for UX)
            // For now, satisfy the "red text" requirement
        }
    }, []);

    const handleSaveKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
            setHasKey(true);
            setShowSettings(false);
        }
    };

    const handleClearKey = () => {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        setApiKey('');
        setHasKey(false);
    };

    return (
        <>
            {/* HEADER BAR */}
            <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div>
                    {/* Placeholder for Page Title if needed, or left empty */}
                </div>

                <button
                    onClick={() => setShowSettings(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${hasKey
                            ? 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 animate-pulse'
                        }`}
                >
                    <Settings size={18} />
                    <span className="font-medium text-sm">Cài đặt API</span>
                    {!hasKey && (
                        <span className="text-xs font-bold ml-1 hidden md:inline-block">
                            (Lấy API key để sử dụng app)
                        </span>
                    )}
                </button>
            </div>

            {/* SETTINGS MODAL */}
            {showSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Thiết lập hệ thống</h2>
                                    <p className="text-sm text-gray-500">Cấu hình kết nối AI & Model</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-8">

                            {/* API KEY SECTION */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-teal-800 font-bold text-lg">
                                    <Key size={20} />
                                    <h3>Gemini API Key <span className="text-red-500">*</span></h3>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 space-y-2">
                                    <p className="flex items-start gap-2">
                                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                        <span>Bạn cần có Google Gemini API Key để ứng dụng hoạt động.</span>
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <a
                                            href="https://aistudio.google.com/api-keys"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm"
                                        >
                                            <ExternalLink size={14} /> TẠO API KEY MIỄN PHÍ
                                        </a>
                                        <a
                                            href="https://tinyurl.com/hdsdpmTHT"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors text-xs sm:text-sm"
                                        >
                                            <ExternalLink size={14} /> XEM VIDEO HƯỚNG DẪN
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Nhập khóa API của bạn:</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="AIzaSy..."
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all font-mono text-sm"
                                        />
                                        {hasKey && (
                                            <button
                                                onClick={handleClearKey}
                                                className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* MODEL CONFIGURATION */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                                    <Cpu size={20} />
                                    <h3>Cấu hình Model AI</h3>
                                </div>
                                <p className="text-sm text-gray-500">Hệ thống sẽ tự động chuyển đổi sang model dự phòng nếu gặp lỗi.</p>

                                <div className="grid grid-cols-1 gap-3">
                                    {MODELS.map((model) => (
                                        <div
                                            key={model.id}
                                            onClick={() => setSelectedModel(model.id)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedModel === model.id
                                                    ? 'border-teal-500 bg-teal-50/50'
                                                    : 'border-gray-100 hover:border-teal-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-bold ${selectedModel === model.id ? 'text-teal-900' : 'text-gray-700'}`}>
                                                        {model.name}
                                                    </h4>
                                                    {model.recommended && (
                                                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold uppercase rounded-full tracking-wide">Default</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                                            </div>

                                            {selectedModel === model.id ? (
                                                <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center">
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleSaveKey}
                                disabled={!apiKey.trim()}
                                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 ${apiKey.trim() ? 'bg-teal-600 hover:bg-teal-500' : 'bg-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                Lưu Cấu Hình
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
