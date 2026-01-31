import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Check, Eye, EyeOff, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLearningStore, useCheckInStore, useTaskStore } from '@/store';
import { commonWords } from '@/data/videos';
import type { Word } from '@/types';

// 获取单词详情
const getWordDetails = (wordId: string): Word | undefined => {
  return commonWords[wordId] || Object.values(commonWords).find(w => w.id === wordId);
};

export default function Review() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [reviewStats, setReviewStats] = useState({ correct: 0, incorrect: 0 });
  const [reviewList, setReviewList] = useState<string[]>([]);

  const { vocabulary, updateWordStatus } = useLearningStore();
  const { doCheckIn } = useCheckInStore();
  const { updateTaskProgress } = useTaskStore();

  // 获取今日需要复习的单词
  useEffect(() => {
    const wordsToReview = vocabulary
      .filter((v) => v.status === 'new' || v.status === 'learning')
      .slice(0, 20)
      .map((v) => v.wordId);
    
    setReviewList(wordsToReview);
  }, [vocabulary]);

  const currentWord = reviewList[currentIndex] ? getWordDetails(reviewList[currentIndex]) : null;
  const progress = reviewList.length > 0 ? ((currentIndex) / reviewList.length) * 100 : 0;

  // 标记为掌握
  const markAsMastered = () => {
    if (reviewList[currentIndex]) {
      updateWordStatus(reviewList[currentIndex], 'mastered');
      setReviewStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      updateTaskProgress('review', 1);
    }
    nextCard();
  };

  // 标记为未掌握
  const markAsNotMastered = () => {
    if (reviewList[currentIndex]) {
      updateWordStatus(reviewList[currentIndex], 'learning');
      setReviewStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    nextCard();
  };

  // 下一张卡片
  const nextCard = () => {
    setShowMeaning(false);
    if (currentIndex < reviewList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setReviewComplete(true);
      // 完成复习，更新打卡
      doCheckIn({ reviewedWords: reviewStats.correct + 1 });
    }
  };

  // 重新开始
  const restart = () => {
    setCurrentIndex(0);
    setShowMeaning(false);
    setReviewComplete(false);
    setReviewStats({ correct: 0, incorrect: 0 });
  };

  // 播放发音
  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (reviewList.length === 0) {
    return (
      <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#7c9a6e]" />
            </div>
            <h2 className="text-2xl text-[#f8f5f0] mb-2">今日复习已完成</h2>
            <p className="text-[#6a6a6a]">你的生词本中没有需要复习的单词</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviewComplete) {
    return (
      <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c5b8a5] to-[#d4c4a8] flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-[#0d0d0d]" />
            </div>
            <h2 className="text-3xl font-light text-[#f8f5f0] mb-4">
              复习完成!
            </h2>
            <p className="text-[#9a9a9a] mb-8">
              坚持学习，你的英语会越来越好
            </p>

            {/* Stats */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-medium text-[#7c9a6e] mb-1">
                    {reviewStats.correct}
                  </p>
                  <p className="text-sm text-[#9a9a9a]">已掌握</p>
                </div>
                <div>
                  <p className="text-3xl font-medium text-[#d4a574] mb-1">
                    {reviewStats.incorrect}
                  </p>
                  <p className="text-sm text-[#9a9a9a]">需重练</p>
                </div>
              </div>
            </div>

            <Button
              onClick={restart}
              className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] px-8"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              再次复习
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-4">
            今日复习
          </h1>
          <p className="text-[#9a9a9a]">
            基于艾宾浩斯遗忘曲线，科学安排复习计划
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#9a9a9a]">
              进度 {currentIndex + 1} / {reviewList.length}
            </span>
            <span className="text-sm text-[#c5b8a5]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#3a3a3a]" />
        </div>

        {/* Flashcard */}
        {currentWord && (
          <div className="max-w-lg mx-auto">
            <div className="bg-[#2a2a2a] rounded-3xl p-8 md:p-12 text-center border border-[#4a4a4a]">
              {/* Word */}
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-medium text-[#f8f5f0] mb-4">
                  {currentWord.word}
                </h2>
                <button
                  onClick={() => playAudio(currentWord.word)}
                  className="text-[#6a6a6a] hover:text-[#c5b8a5] transition-colors"
                >
                  {currentWord.phonetic}
                </button>
              </div>

              {/* Toggle Meaning */}
              <button
                onClick={() => setShowMeaning(!showMeaning)}
                className="flex items-center gap-2 mx-auto text-[#c5b8a5] hover:underline mb-8"
              >
                {showMeaning ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    隐藏释义
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    显示释义
                  </>
                )}
              </button>

              {/* Meaning */}
              {showMeaning && (
                <div className="bg-[#3a3a3a] rounded-2xl p-6 mb-8 animate-fade-in">
                  <p className="text-lg text-[#c5b8a5] mb-2">
                    {currentWord.translation}
                  </p>
                  <p className="text-sm text-[#9a9a9a]">
                    {currentWord.partOfSpeech}
                  </p>
                  <p className="text-[#f8f5f0] mt-4">{currentWord.example}</p>
                  <p className="text-sm text-[#6a6a6a] mt-2">
                    {currentWord.exampleTranslation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={markAsNotMastered}
                  className="border-[#d4a574] text-[#d4a574] hover:bg-[#d4a574]/20 px-8"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  未掌握
                </Button>
                <Button
                  size="lg"
                  onClick={markAsMastered}
                  className="bg-[#7c9a6e] text-white hover:bg-[#6b8a5e] px-8"
                >
                  已掌握
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Tips */}
            <p className="text-center text-sm text-[#6a6a6a] mt-6">
              左滑标记为未掌握，右滑标记为已掌握
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
