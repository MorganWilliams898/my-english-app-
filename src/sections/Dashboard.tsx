import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Play,
  Trophy,
  Flame,
  Target,
  Check,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLearningStore, useCheckInStore, useTaskStore } from '@/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 生成模拟学习数据
const generateStudyData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      minutes: Math.floor(Math.random() * 60) + 20,
    });
  }
  return data;
};

export default function Dashboard() {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [studyData] = useState(generateStudyData());
  const [confetti, setConfetti] = useState(false);

  const { totalStudyTime, vocabulary, watchedVideos } = useLearningStore();
  const { streak, isCheckedInToday, doCheckIn } = useCheckInStore();
  const { todayTasks, initTodayTasks, getCompletedCount, getTotalCount } = useTaskStore();

  // 初始化今日任务
  useEffect(() => {
    if (todayTasks.length === 0) {
      initTodayTasks();
    }
  }, [todayTasks.length, initTodayTasks]);

  // 打卡
  const handleCheckIn = () => {
    if (!isCheckedInToday()) {
      doCheckIn({
        listenMinutes: todayTasks.find(t => t.type === 'listen')?.current || 0,
        wordPractice: todayTasks.find(t => t.type === 'practice')?.current || 0,
        videoCompleted: todayTasks.find(t => t.type === 'video')?.current || 0,
        reviewedWords: todayTasks.find(t => t.type === 'review')?.current || 0,
      });
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
    setShowCheckInDialog(true);
  };

  // 获取当前月份的天数
  const getDaysInMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth();
  const { getMonthlyCheckIns } = useCheckInStore();
  const monthlyCheckIns = getMonthlyCheckIns(year, month);
  const checkedInDates = new Set(monthlyCheckIns.map(c => parseInt(c.date.split('-')[2])));

  const checkedIn = isCheckedInToday();
  const completedTasks = getCompletedCount();
  const totalTasks = getTotalCount();

  return (
    <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-2">
              学习管理
            </h1>
            <p className="text-[#9a9a9a]">追踪你的学习进度，坚持每日打卡</p>
          </div>
          <Button
            onClick={handleCheckIn}
            className={`px-8 py-6 text-lg ${
              checkedIn
                ? 'bg-[#7c9a6e] text-white'
                : 'bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8]'
            }`}
          >
            {checkedIn ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                已打卡
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                今日打卡
              </>
            )}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Clock,
              label: '学习时长',
              value: `${Math.floor(totalStudyTime / 60)}h`,
              subValue: `${totalStudyTime % 60}m`,
              color: '#c5b8a5',
            },
            {
              icon: Play,
              label: '完成视频',
              value: watchedVideos.length.toString(),
              subValue: '个',
              color: '#6b8b9a',
            },
            {
              icon: BookOpen,
              label: '掌握单词',
              value: vocabulary.filter(v => v.status === 'mastered').length.toString(),
              subValue: '个',
              color: '#7c9a6e',
            },
            {
              icon: Flame,
              label: '连续打卡',
              value: streak.toString(),
              subValue: '天',
              color: '#d4a574',
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-[#2a2a2a] rounded-2xl p-5 border border-[#4a4a4a] hover:border-[#c5b8a5] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-sm text-[#9a9a9a] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-medium text-[#f8f5f0]">{stat.value}</p>
                  <p className="text-sm text-[#6a6a6a]">{stat.subValue}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Tasks */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#4a4a4a]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-[#f8f5f0]">今日任务</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#9a9a9a]">
                    {completedTasks}/{totalTasks}
                  </span>
                  <Progress
                    value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}
                    className="w-20 h-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      task.completed ? 'bg-[#7c9a6e]/10' : 'bg-[#3a3a3a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          task.completed ? 'bg-[#7c9a6e]' : 'bg-[#4a4a4a]'
                        }`}
                      >
                        {task.completed ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Target className="w-4 h-4 text-[#9a9a9a]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[#f8f5f0]">
                          {task.type === 'listen' && '听力学习'}
                          {task.type === 'practice' && '词句练习'}
                          {task.type === 'review' && '单词复习'}
                          {task.type === 'video' && '完成视频'}
                        </p>
                        <p className="text-sm text-[#6a6a6a]">
                          {task.current}/{task.target} {task.unit}
                        </p>
                      </div>
                    </div>
                    {task.completed && (
                      <Badge className="bg-[#7c9a6e] text-white">已完成</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Study Trend */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#4a4a4a]">
              <h2 className="text-xl font-medium text-[#f8f5f0] mb-6">学习趋势</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="date" stroke="#6a6a6a" fontSize={12} />
                    <YAxis stroke="#6a6a6a" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2a2a2a',
                        border: '1px solid #4a4a4a',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#f8f5f0' }}
                      itemStyle={{ color: '#c5b8a5' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="minutes"
                      stroke="#c5b8a5"
                      strokeWidth={2}
                      dot={{ fill: '#c5b8a5', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#4a4a4a]">
              <h2 className="text-xl font-medium text-[#f8f5f0] mb-6">打卡日历</h2>
              <div className="grid grid-cols-7 gap-1">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm text-[#6a6a6a] py-2"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate();
                  const isCheckedIn = checkedInDates.has(day);

                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                        isToday
                          ? 'bg-[#c5b8a5] text-[#0d0d0d] font-medium'
                          : isCheckedIn
                          ? 'bg-[#7c9a6e]/30 text-[#7c9a6e]'
                          : 'text-[#9a9a9a] hover:bg-[#3a3a3a]'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#4a4a4a]">
              <h2 className="text-xl font-medium text-[#f8f5f0] mb-6">成就</h2>
              <div className="space-y-3">
                {[
                  {
                    name: '初学者',
                    description: '完成首个视频学习',
                    unlocked: watchedVideos.length >= 1,
                    icon: Play,
                  },
                  {
                    name: '词汇收集者',
                    description: '收藏10个单词',
                    unlocked: vocabulary.length >= 10,
                    icon: BookOpen,
                  },
                  {
                    name: '坚持者',
                    description: '连续打卡7天',
                    unlocked: streak >= 7,
                    icon: Flame,
                  },
                  {
                    name: '听力达人',
                    description: '学习时长达到10小时',
                    unlocked: totalStudyTime >= 600,
                    icon: Trophy,
                  },
                ].map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        achievement.unlocked ? 'bg-[#c5b8a5]/10' : 'bg-[#3a3a3a]/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          achievement.unlocked
                            ? 'bg-[#c5b8a5]'
                            : 'bg-[#4a4a4a]'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            achievement.unlocked ? 'text-[#0d0d0d]' : 'text-[#6a6a6a]'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            achievement.unlocked ? 'text-[#f8f5f0]' : 'text-[#6a6a6a]'
                          }`}
                        >
                          {achievement.name}
                        </p>
                        <p className="text-xs text-[#6a6a6a]">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Star className="w-5 h-5 text-[#d4a574] fill-[#d4a574]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Dialog */}
      <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <DialogContent className="bg-[#2a2a2a] border-[#4a4a4a] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-[#f8f5f0]">
              {checkedIn ? '今日已打卡' : '打卡成功!'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c5b8a5] to-[#d4c4a8] flex items-center justify-center mx-auto mb-6">
              {checkedIn ? (
                <Check className="w-12 h-12 text-[#0d0d0d]" />
              ) : (
                <Calendar className="w-12 h-12 text-[#0d0d0d]" />
              )}
            </div>
            <p className="text-[#f8f5f0] mb-2">
              连续打卡 <span className="text-[#c5b8a5] font-medium">{streak}</span> 天
            </p>
            <p className="text-sm text-[#9a9a9a]">
              {checkedIn
                ? '明天继续加油!'
                : '恭喜你完成了今日学习任务!'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded"
                style={{
                  backgroundColor: ['#c5b8a5', '#d4c4a8', '#7c9a6e', '#d4a574', '#6b8b9a'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `confetti-fall ${1 + Math.random()}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
