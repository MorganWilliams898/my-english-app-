import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Library from './sections/Library';
import Player from './sections/Player';
import Practice from './sections/Practice';
import Vocabulary from './sections/Vocabulary';
import Review from './sections/Review';
import Dashboard from './sections/Dashboard';
import Footer from './sections/Footer';

// 首页
function HomePage() {
  return (
    <>
      <Hero />
      <div className="py-20 bg-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-4">
              为什么选择我们
            </h2>
            <p className="text-[#9a9a9a] max-w-2xl mx-auto">
              专为英语学习者打造，提供科学、高效、有趣的听力学习体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '精选素材',
                description: '从 YouTube 精选优质英语学习视频，按难度分级，涵盖日常、职场、旅游等多种场景',
                icon: '🎬',
              },
              {
                title: '智能学习',
                description: '变速播放、单句循环、点击查词，让听力学习更高效、更沉浸',
                icon: '🎯',
              },
              {
                title: '科学复习',
                description: '基于艾宾浩斯遗忘曲线，智能安排复习计划，让记忆更持久',
                icon: '📚',
              },
              {
                title: '词句拆解',
                description: '逐句解析，重点词汇标注，帮助你深入理解每一个表达',
                icon: '🔍',
              },
              {
                title: '练习巩固',
                description: '听写、填空、短语搭配等多种练习方式，检验学习效果',
                icon: '✏️',
              },
              {
                title: '打卡激励',
                description: '每日任务、连续打卡、成就系统，让学习更有动力',
                icon: '🔥',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#2a2a2a] rounded-2xl p-8 border border-[#4a4a4a] hover:border-[#c5b8a5] transition-all card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium text-[#f8f5f0] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#9a9a9a] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="py-20 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-4">
              学习流程
            </h2>
            <p className="text-[#9a9a9a]">
              输入 → 理解 → 练习 → 巩固 → 复盘，打造完整学习闭环
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {[
              { step: '1', title: '选择素材', desc: '按难度和兴趣挑选视频' },
              { step: '2', title: '沉浸学习', desc: '变速听力，智能字幕' },
              { step: '3', title: '词句练习', desc: '听写、填空巩固' },
              { step: '4', title: '复习巩固', desc: '科学安排复习' },
              { step: '5', title: '每日打卡', desc: '记录学习轨迹' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#c5b8a5] flex items-center justify-center text-[#0d0d0d] font-medium">
                    {item.step}
                  </div>
                  <p className="text-[#f8f5f0] font-medium mt-3">{item.title}</p>
                  <p className="text-sm text-[#6a6a6a]">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block w-16 h-px bg-[#4a4a4a]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// 学习页面（视频播放器）
function LearnPage() {
  return <Player />;
}

// 素材库页面
function LibraryPage() {
  return <Library />;
}

// 练习页面
function PracticePage() {
  return <Practice />;
}

// 生词本页面
function VocabularyPage() {
  return <Vocabulary />;
}

// 复习页面
function ReviewPage() {
  return <Review />;
}

// 打卡/仪表盘页面
function DashboardPage() {
  return <Dashboard />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1a1a1a]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/learn/:videoId" element={<LearnPage />} />
            <Route path="/learn" element={<LibraryPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/vocabulary" element={<VocabularyPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
