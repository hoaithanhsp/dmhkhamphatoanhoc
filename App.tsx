
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
import { analyzeProfile } from './utils/numerology';
import { generateLearningPath, generateChallengeUnit, generateComprehensiveTest } from './utils/aiGenerator';
import { Loader2, Key } from 'lucide-react';

const STORAGE_KEY = 'math_genius_user_data_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.WELCOME);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleAssessmentNext = (proficiency: number, habits: string[], notes: string) => {
    setUser(prev => ({
      ...prev,
      proficiencyLevel: proficiency,
      learningHabits: habits,
      aiNotes: notes
    }));
    setCurrentScreen(ScreenName.ANALYSIS_RESULT);
  };

  const handleCreateLearningPath = async (grade: number, topics: string[]) => {
    setIsGenerating(true);
    const updatedUser = { ...user, grade, selectedTopics: topics };
    setUser(updatedUser);

    try {
      const learningPath = await generateLearningPath(updatedUser, topics);
      setUser(prev => ({
        ...prev,
        learningPath: learningPath
      }));
      setCurrentScreen(ScreenName.LEARNING_PATH);
    } catch (error) {
      console.error("Failed to generate path", error);
      // Even on error, we might want to stay on selection or show error. 
      // Instructions say: "Hiện thông báo lỗi màu đỏ". 
      // The Error handling is done inside generateLearningPath by throwing, 
      // but here we catch it. We should probably let the user know.
      // For now, I'll alert or let the UI handle it if I had a global error state.
      // But based on instructions, specifically "Process columns waiting -> Stopped on Error", 
      // that seems to apply to the Generation Logic/State.
      // Since I don't have a complex state machine for the generation UI here (just isGenerating boolean),
      // I'll leave the Alert for now or just stay on the screen.
      alert(`Lỗi tạo lộ trình: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Don't navigate to Learning Path if failed
    } finally {
      setIsGenerating(false);
    }
  };

  // Upgrade/Challenge Unit Logic
  const handleUpgradeUnit = async (unit: LearningUnit) => {
    setIsGenerating(true);
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
    } catch (error) {
      console.error("Failed to generate challenge", error);
      alert(`Lỗi tạo bài tập nâng cao: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Comprehensive Test Logic
  const handleComprehensiveTest = async () => {
    setIsGenerating(true);
    try {
      const examUnit = await generateComprehensiveTest(user);
      if (examUnit) {
        setActiveUnit(examUnit);
        setIsReviewingQuiz(false);
        setLastQuizResult(null);
        setCurrentScreen(ScreenName.QUIZ);
      }
    } catch (error) {
      console.error("Failed to generate exam", error);
      alert(`Lỗi tạo bài kiểm tra: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          onNext={handleAssessmentNext}
          onBack={() => setCurrentScreen(ScreenName.STUDENT_INFO)}
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
        return <ChatScreen user={user} />;
      case ScreenName.GAMES:
        return <GameLibraryScreen user={user} setUser={setUser} />;
      case ScreenName.SETTINGS:
        return <SettingsScreen user={user} onLogout={handleLogout} onBack={() => setCurrentScreen(ScreenName.PROFILE)} />;
      default:
        return <WelcomeScreen onStart={() => setCurrentScreen(ScreenName.STUDENT_INFO)} />;
    }
  };

  // API Key Check
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  useEffect(() => {
    const key = localStorage.getItem('user_api_key');
    if (!key) {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim().length > 10) {
      localStorage.setItem('user_api_key', tempApiKey);
      setShowApiKeyModal(false);
    } else {
      alert("Vui lòng nhập API Key hợp lệ");
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
      <div className={`flex-1 flex flex-col min-h-screen relative overflow-hidden transition-all duration-300 ${isNavigable ? 'md:ml-64' : ''}`}>

        {/* Render Screen */}
        <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar relative">
          {renderScreen()}
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
            <p className="text-sm text-gray-500">Đang điều chỉnh lộ trình dựa trên lịch sử học tập</p>
          </div>
        )}

        {/* Bottom Navigation for Mobile */}
        {isNavigable && (
          <BottomNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>

      {/* MANDATORY API KEY MODAL */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-bounce-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Yêu cầu cấu hình</h2>
              <p className="text-gray-500 text-sm mt-2">
                Để sử dụng ứng dụng, bạn cần cung cấp API Key từ Google Gemini.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Nhập API Key bắt đầu bằng AIza..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-2 text-gray-600">
                <p>1. Truy cập <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-primary font-bold underline">Google AI Studio</a>.</p>
                <p>2. Đăng nhập và chọn "Create API Key".</p>
                <p>3. Copy Key và dán vào ô trên.</p>
                <p className="pt-2 italic text-gray-400">
                  Xem hướng dẫn chi tiết: <a href="https://tinyurl.com/hdsdpmTHT" target="_blank" rel="noreferrer" className="text-gray-500 underline">Tại đây</a>
                </p>
              </div>

              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu & Bắt đầu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
