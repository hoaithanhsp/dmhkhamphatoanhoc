
import React, { useState, useEffect } from 'react';
import { ScreenName, UserProfile, LearningUnit, QuizResult } from './types';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { StudentInfoScreen } from './components/screens/StudentInfoScreen';
import { AssessmentScreen } from './components/screens/AssessmentScreen';
import { AnalysisResultScreen } from './components/screens/AnalysisResultScreen';
import { LearningPathScreen } from './components/screens/LearningPathScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { QuizResultScreen } from './components/screens/QuizResultScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ParentReportScreen } from './components/screens/ParentReportScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { GameLibraryScreen } from './components/screens/GameLibraryScreen';
import { ClassSelectionScreen } from './components/screens/ClassSelectionScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { SidebarNavigation } from './components/SidebarNavigation';
import { Header } from './components/Header';
import { analyzeProfile } from './utils/numerology';
import { generateLearningPath, generateChallengeUnit, generateComprehensiveTest } from './utils/aiGenerator';
import { Loader2, AlertTriangle, XCircle } from 'lucide-react';

const STORAGE_KEY = 'math_genius_user_data_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.WELCOME);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUnit, setActiveUnit] = useState<LearningUnit | null>(null);

  // Quiz State
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);
  const [isReviewingQuiz, setIsReviewingQuiz] = useState(false);

  // Initialize state with lazy initializer to check localStorage first
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load save data", e);
    }
    // Default fallback if no save found
    return {
      name: 'ĐẶNG MINH HẢI',
      dob: '26/08/2012',
      grade: 8, // Default Grade 8 as requested
      numerologyNumber: 7,
      proficiencyLevel: 3,
      history: []
    };
  });

  // Effect: Save to LocalStorage whenever user changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  // Effect: If user already has a learning path on load, go to Learning Path instead of Welcome (optional UX choice)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.learningPath && parsed.learningPath.length > 0) {
        setCurrentScreen(ScreenName.LEARNING_PATH);
      }
    }
  }, []);


  const handleStudentInfoNext = () => {
    if (user.dob) {
      const analysis = analyzeProfile(user.name, user.dob);
      setUser(prev => ({
        ...prev,
        numerologyNumber: analysis.lifePathNumber,
        numerologyProfile: analysis
      }));
    }
    setCurrentScreen(ScreenName.ASSESSMENT);
  };

  const handleAssessmentNext = (proficiency: number) => {
    setUser(prev => ({ ...prev, proficiencyLevel: proficiency }));
    setCurrentScreen(ScreenName.ANALYSIS_RESULT);
  };

  const handleCreateLearningPath = async (grade: number, topics: string[]) => {
    setIsGenerating(true);
    setError(null);
    const updatedUser = { ...user, grade, selectedTopics: topics };
    setUser(updatedUser);

    try {
      const learningPath = await generateLearningPath(updatedUser, topics);
      setUser(prev => ({
        ...prev,
        learningPath: learningPath
      }));
      setCurrentScreen(ScreenName.LEARNING_PATH);
    } catch (err: any) {
      console.error("Failed to generate path", err);
      setError(err.message || "Đã xảy ra lỗi khi tạo lộ trình.");
      // Stay on current screen or handle appropriately
    } finally {
      setIsGenerating(false);
    }
  };

  // Upgrade/Challenge Unit Logic
  const handleUpgradeUnit = async (unit: LearningUnit) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newUnit = await generateChallengeUnit(user, unit);
      if (newUnit && user.learningPath) {
        // Update the learning path with the new harder unit
        const updatedPath = user.learningPath.map(u =>
          u.id === unit.id ? newUnit : u
        );
        setUser(prev => ({ ...prev, learningPath: updatedPath }));

        // Immediately start the new unit
        setActiveUnit(newUnit);
        setIsReviewingQuiz(false);
        setLastQuizResult(null);
        setCurrentScreen(ScreenName.QUIZ);
      }
    } catch (err: any) {
      console.error("Failed to generate challenge", err);
      setError(err.message || "Không thể tạo bài tập nâng cao.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Comprehensive Test Logic
  const handleComprehensiveTest = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const examUnit = await generateComprehensiveTest(user);
      if (examUnit) {
        setActiveUnit(examUnit);
        setIsReviewingQuiz(false);
        setLastQuizResult(null);
        setCurrentScreen(ScreenName.QUIZ);
      }
    } catch (err: any) {
      console.error("Failed to generate exam", err);
      setError(err.message || "Không thể tạo bài kiểm tra.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizFinish = (result: QuizResult) => {
    // Add timestamp and unit title to result for history
    const finalResult: QuizResult = {
      ...result,
      timestamp: Date.now(),
      unitTitle: activeUnit?.title || "Bài học"
    };

    setLastQuizResult(finalResult);
    setIsReviewingQuiz(false);

    // Update unit status in user profile if it's a regular unit
    if (user.learningPath && activeUnit?.level !== 99) {
      const updatedPath = user.learningPath.map(u => {
        if (u.id === result.unitId) {
          const isPass = (result.score / result.totalQuestions) >= 0.5;
          return { ...u, status: isPass ? 'completed' : 'active' } as any;
        }
        return u;
      });

      // Update User History
      setUser(prev => ({
        ...prev,
        learningPath: updatedPath,
        history: [finalResult, ...(prev.history || [])] // Add new result to start of history
      }));
    } else {
      // Just update history for comprehensive exams
      setUser(prev => ({
        ...prev,
        history: [finalResult, ...(prev.history || [])]
      }));
    }

    setCurrentScreen(ScreenName.QUIZ_RESULT);
  };

  const handleStartReview = () => {
    setIsReviewingQuiz(true);
    setCurrentScreen(ScreenName.QUIZ);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    // Reset to defaults
    setUser({
      name: '',
      dob: '',
      grade: 6,
      numerologyNumber: 0,
      proficiencyLevel: 2,
      history: []
    });
    setCurrentScreen(ScreenName.WELCOME);
  };

  // Simple router function
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.WELCOME:
        return <WelcomeScreen onStart={() => setCurrentScreen(ScreenName.STUDENT_INFO)} />;
      case ScreenName.STUDENT_INFO:
        return <StudentInfoScreen user={user} setUser={setUser} onNext={handleStudentInfoNext} onBack={() => setCurrentScreen(ScreenName.WELCOME)} />;
      case ScreenName.ASSESSMENT:
        return <AssessmentScreen
          onNext={() => handleAssessmentNext(user.proficiencyLevel || 3)}
          onBack={() => setCurrentScreen(ScreenName.STUDENT_INFO)}
          setProficiency={(level) => setUser({ ...user, proficiencyLevel: level })}
        />;
      case ScreenName.ANALYSIS_RESULT:
        return <AnalysisResultScreen
          user={user}
          onNext={() => setCurrentScreen(ScreenName.CLASS_SELECTION)}
          onBack={() => setCurrentScreen(ScreenName.ASSESSMENT)}
        />;
      case ScreenName.CLASS_SELECTION:
        return (
          <ClassSelectionScreen
            currentGrade={user.grade}
            onNext={handleCreateLearningPath}
            onBack={() => setCurrentScreen(ScreenName.ANALYSIS_RESULT)}
            isGenerating={isGenerating}
          />
        );
      case ScreenName.LEARNING_PATH:
        return <LearningPathScreen
          user={user}
          onStartQuiz={(unit) => {
            setActiveUnit(unit);
            setIsReviewingQuiz(false);
            setLastQuizResult(null); // Reset result
            setCurrentScreen(ScreenName.QUIZ);
          }}
          onUpgradeUnit={handleUpgradeUnit}
          onBack={() => setCurrentScreen(ScreenName.CLASS_SELECTION)}
          onStartComprehensiveTest={handleComprehensiveTest}
        />;
      case ScreenName.QUIZ:
        return <QuizScreen
          unit={activeUnit}
          isReviewMode={isReviewingQuiz}
          existingAnswers={isReviewingQuiz ? lastQuizResult?.userAnswers : undefined}
          onFinish={handleQuizFinish}
          onBack={() => isReviewingQuiz ? setCurrentScreen(ScreenName.QUIZ_RESULT) : setCurrentScreen(ScreenName.LEARNING_PATH)}
        />;
      case ScreenName.QUIZ_RESULT:
        return <QuizResultScreen
          result={lastQuizResult}
          onReview={handleStartReview}
          onContinue={() => setCurrentScreen(ScreenName.LEARNING_PATH)}
        />;
      case ScreenName.PROFILE:
        return <ProfileScreen user={user} />;
      case ScreenName.PARENT_REPORT:
        return <ParentReportScreen user={user} />;
      case ScreenName.CHAT:
        return <ChatScreen />;
      case ScreenName.GAMES:
        return <GameLibraryScreen user={user} setUser={setUser} />;
      case ScreenName.SETTINGS:
        return <SettingsScreen user={user} onLogout={handleLogout} onBack={() => setCurrentScreen(ScreenName.PROFILE)} />;
      default:
        return <WelcomeScreen onStart={() => setCurrentScreen(ScreenName.STUDENT_INFO)} />;
    }
  };

  // Check if navigation should be visible
  const isNavigable = [
    ScreenName.LEARNING_PATH,
    ScreenName.PROFILE,
    ScreenName.PARENT_REPORT,
    ScreenName.CHAT,
    ScreenName.GAMES,
    ScreenName.SETTINGS
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-display flex w-full">
      {/* Sidebar for Desktop */}
      {isNavigable && (
        <SidebarNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} user={user} />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen relative overflow-hidden transition-all duration-300 ${isNavigable ? 'md:ml-80' : ''}`}>

        {/* Header with API Settings */}
        <Header />

        {/* Render Screen & Footer */}
        <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar relative flex flex-col">
          <div className="flex-1">
            {renderScreen()}
          </div>

          {/* Footer Promotion (Fixed as per instructions) */}
          <footer className="bg-slate-800 text-slate-300 py-8 px-4 mt-auto border-t border-slate-700 no-print">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                <p className="font-bold text-lg md:text-xl text-blue-200 mb-3 leading-relaxed">
                  ĐĂNG KÝ KHOÁ HỌC THỰC CHIẾN VIẾT SKKN, TẠO APP DẠY HỌC, TẠO MÔ PHỎNG TRỰC QUAN <br className="hidden md:block" />
                  <span className="text-yellow-400">CHỈ VỚI 1 CÂU LỆNH</span>
                </p>
                <a
                  href="https://tinyurl.com/khoahocAI2025"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-900/50"
                >
                  ĐĂNG KÝ NGAY
                </a>
              </div>

              <div className="space-y-2 text-sm md:text-base">
                <p className="font-medium text-slate-400">Mọi thông tin vui lòng liên hệ:</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                  <a
                    href="https://www.facebook.com/tranhoaithanhvicko/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="font-bold">Facebook:</span> tranhoaithanhvicko
                  </a>
                  <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                  <span className="hover:text-emerald-400 transition-colors duration-200 cursor-default flex items-center gap-2">
                    <span className="font-bold">Zalo:</span> 0348296773
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center fixed">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-teal-800 font-bold text-lg animate-pulse">AI đang phân tích & tối ưu hóa...</p>
            <p className="text-sm text-gray-500">Đang điều chỉnh lộ trình dựa trên lịch sử học tập (Cơ chế Fallback AI đang hoạt động...)</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border-2 border-red-100">
              <div className="bg-red-50 p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <AlertTriangle size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2">Đã dừng do lỗi</h3>
                <div className="bg-white px-4 py-3 rounded-xl border border-red-200 w-full text-left">
                  <p className="text-xs font-bold text-gray-400 mb-1">CHI TIẾT LỖI TỪ API:</p>
                  <p className="text-red-600 font-mono text-sm break-words">{error}</p>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <button
                  onClick={() => setError(null)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                >
                  <XCircle size={18} />
                  ĐÓNG CỬA SỔ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation for Mobile */}
        {isNavigable && (
          <BottomNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
}