import { useState, useEffect } from 'react';
import { Volume2, Check, X, SkipForward, Trophy, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { videos, commonWords } from '@/data/videos';
import { useLearningStore, useTaskStore } from '@/store';
import type { Word } from '@/types';

// 听写练习
function DictationPractice() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [streak, setStreak] = useState(0);

  const { addToVocabulary } = useLearningStore();
  const { updateTaskProgress } = useTaskStore();

  // 获取所有可用单词
  const allWords = Object.values(commonWords);

  useEffect(() => {
    nextWord();
  }, []);

  const nextWord = () => {
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    setCurrentWord(randomWord);
    setUserInput('');
    setShowResult(false);
    setIsCorrect(false);
  };

  const checkAnswer = () => {
    if (!currentWord || !userInput.trim()) return;

    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempted((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      updateTaskProgress('practice', 1);
    } else {
      setStreak(0);
      // 添加到生词本
      addToVocabulary(currentWord.id, 'practice');
    }
  };

  const playAudio = () => {
    if (currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        nextWord();
      } else {
        checkAnswer();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#d4a574]" />
            <span className="text-[#f8f5f0]">
              正确: <span className="text-[#7c9a6e] font-medium">{score}</span>
            </span>
          </div>
          <div className="text-[#6a6a6a]">/</div>
          <span className="text-[#9a9a9a]">总计: {totalAttempted}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#c5b8a5]" />
          <span className="text-[#f8f5f0]">
            连击: <span className="text-[#c5b8a5] font-medium">{streak}</span>
          </span>
        </div>
      </div>

      {/* Practice Area */}
      {currentWord && (
        <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center">
          {/* Audio Button */}
          <button
            onClick={playAudio}
            className="w-20 h-20 rounded-full bg-[#c5b8a5]/20 flex items-center justify-center mx-auto mb-8 hover:bg-[#c5b8a5]/30 transition-colors"
          >
            <Volume2 className="w-8 h-8 text-[#c5b8a5]" />
          </button>

          <p className="text-[#9a9a9a] mb-6">听音频，输入你听到的单词</p>

          {/* Input */}
          <div className="flex gap-3 mb-6">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入单词..."
              disabled={showResult}
              className={`flex-1 bg-[#3a3a3a] border-[#4a4a4a] text-[#f8f5f0] placeholder:text-[#6a6a6a] text-center text-lg py-6 ${
                showResult
                  ? isCorrect
                    ? 'border-[#7c9a6e] focus:border-[#7c9a6e]'
                    : 'border-[#b07070] focus:border-[#b07070]'
                  : ''
              }`}
            />
          </div>

          {/* Result */}
          {showResult && (
            <div
              className={`p-4 rounded-xl mb-6 ${
                isCorrect ? 'bg-[#7c9a6e]/20' : 'bg-[#b07070]/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-[#7c9a6e]" />
                    <span className="text-[#7c9a6e] font-medium">回答正确!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-[#b07070]" />
                    <span className="text-[#b07070] font-medium">回答错误</span>
                  </>
                )}
              </div>
              {!isCorrect && (
                <p className="text-[#f8f5f0]">
                  正确答案是: <span className="text-[#c5b8a5] font-medium">{currentWord.word}</span>
                </p>
              )}
              <p className="text-sm text-[#9a9a9a] mt-2">{currentWord.translation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            {!showResult ? (
              <Button
                onClick={checkAnswer}
                disabled={!userInput.trim()}
                className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] px-8"
              >
                检查
              </Button>
            ) : (
              <Button
                onClick={nextWord}
                className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] px-8"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                下一题
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 选词填空
function FillInBlankPractice() {
  const [currentQuestion, setCurrentQuestion] = useState<{
    sentence: string;
    translation: string;
    answer: string;
    options: string[];
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  const { addToVocabulary } = useLearningStore();
  const { updateTaskProgress } = useTaskStore();

  // 生成题目
  const generateQuestion = () => {
    const allWords = Object.values(commonWords);
    const answer = allWords[Math.floor(Math.random() * allWords.length)];
    
    // 从视频中找一个包含该单词的句子，或生成一个
    let sentence = '';
    let translation = '';
    
    for (const video of videos) {
      const foundSentence = video.sentences.find(s => 
        s.english.toLowerCase().includes(answer.word.toLowerCase())
      );
      if (foundSentence) {
        sentence = foundSentence.english.replace(
          new RegExp(answer.word, 'gi'),
          '______'
        );
        translation = foundSentence.chinese;
        break;
      }
    }

    if (!sentence) {
      sentence = `The ______ is very important in this context.`;
      translation = `${answer.translation}在这个语境中非常重要。`;
    }

    // 生成选项
    const options = [answer.word];
    while (options.length < 4) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.includes(randomWord.word)) {
        options.push(randomWord.word);
      }
    }
    options.sort(() => Math.random() - 0.5);

    setCurrentQuestion({ sentence, translation, answer: answer.word, options });
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const checkAnswer = () => {
    if (!selectedOption || !currentQuestion) return;

    const correct = selectedOption.toLowerCase() === currentQuestion.answer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempted((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 1);
      updateTaskProgress('practice', 1);
    } else {
      const word = Object.values(commonWords).find(w => w.word === currentQuestion.answer);
      if (word) {
        addToVocabulary(word.id, 'practice');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#d4a574]" />
            <span className="text-[#f8f5f0]">
              正确: <span className="text-[#7c9a6e] font-medium">{score}</span>
            </span>
          </div>
          <div className="text-[#6a6a6a]">/</div>
          <span className="text-[#9a9a9a]">总计: {totalAttempted}</span>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="bg-[#2a2a2a] rounded-2xl p-8">
          {/* Sentence */}
          <div className="mb-6">
            <p className="text-xl text-[#f8f5f0] text-center leading-relaxed mb-3">
              {currentQuestion.sentence}
            </p>
            <p className="text-sm text-[#6a6a6a] text-center">
              {currentQuestion.translation}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => !showResult && setSelectedOption(option)}
                disabled={showResult}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedOption === option
                    ? showResult
                      ? option.toLowerCase() === currentQuestion.answer.toLowerCase()
                        ? 'border-[#7c9a6e] bg-[#7c9a6e]/20'
                        : 'border-[#b07070] bg-[#b07070]/20'
                      : 'border-[#c5b8a5] bg-[#c5b8a5]/20'
                    : showResult && option.toLowerCase() === currentQuestion.answer.toLowerCase()
                    ? 'border-[#7c9a6e] bg-[#7c9a6e]/20'
                    : 'border-[#4a4a4a] hover:border-[#6a6a6a]'
                }`}
              >
                <span className="text-[#f8f5f0]">{option}</span>
              </button>
            ))}
          </div>

          {/* Result */}
          {showResult && (
            <div
              className={`p-4 rounded-xl mb-6 text-center ${
                isCorrect ? 'bg-[#7c9a6e]/20' : 'bg-[#b07070]/20'
              }`}
            >
              {isCorrect ? (
                <span className="text-[#7c9a6e] font-medium">回答正确!</span>
              ) : (
                <span className="text-[#b07070] font-medium">回答错误</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            {!showResult ? (
              <Button
                onClick={checkAnswer}
                disabled={!selectedOption}
                className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] px-8"
              >
                检查
              </Button>
            ) : (
              <Button
                onClick={generateQuestion}
                className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] px-8"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                下一题
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 短语搭配
function PhrasePractice() {
  const phrases = [
    { phrase: 'look forward to', meaning: '期待', example: 'I look forward to meeting you.' },
    { phrase: 'take care of', meaning: '照顾', example: 'Please take care of yourself.' },
    { phrase: 'get along with', meaning: '与...相处', example: 'Do you get along with him?' },
    { phrase: 'give up', meaning: '放弃', example: 'Never give up on your dreams.' },
    { phrase: 'put off', meaning: '推迟', example: 'Don\'t put off your work.' },
    { phrase: 'turn on', meaning: '打开', example: 'Please turn on the light.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [learned, setLearned] = useState<Set<number>>(new Set());

  const currentPhrase = phrases[currentIndex];

  const nextPhrase = () => {
    setCurrentIndex((prev) => (prev + 1) % phrases.length);
    setShowMeaning(false);
  };

  const markAsLearned = () => {
    setLearned((prev) => new Set(prev).add(currentIndex));
  };

  const progress = (learned.size / phrases.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#9a9a9a]">学习进度</span>
          <span className="text-[#c5b8a5]">{learned.size} / {phrases.length}</span>
        </div>
        <Progress value={progress} className="h-2 bg-[#3a3a3a]" />
      </div>

      {/* Card */}
      <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center">
        <div className="mb-8">
          <p className="text-3xl font-medium text-[#f8f5f0] mb-4">
            {currentPhrase.phrase}
          </p>
          <button
            onClick={() => setShowMeaning(!showMeaning)}
            className="text-[#c5b8a5] hover:underline text-sm"
          >
            {showMeaning ? '隐藏释义' : '显示释义'}
          </button>
        </div>

        {showMeaning && (
          <div className="bg-[#3a3a3a] rounded-xl p-6 mb-8 animate-fade-in">
            <p className="text-xl text-[#c5b8a5] mb-3">{currentPhrase.meaning}</p>
            <p className="text-[#9a9a9a]">{currentPhrase.example}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {!learned.has(currentIndex) && (
            <Button
              onClick={markAsLearned}
              variant="outline"
              className="border-[#7c9a6e] text-[#7c9a6e] hover:bg-[#7c9a6e]/20"
            >
              <Check className="w-4 h-4 mr-2" />
              标记为已掌握
            </Button>
          )}
          <Button
            onClick={nextPhrase}
            className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8]"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            下一个
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Practice() {
  return (
    <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-4">
            词句练习
          </h1>
          <p className="text-[#9a9a9a]">
            通过听写、填空等练习方式，巩固所学词汇和表达
          </p>
        </div>

        {/* Practice Tabs */}
        <Tabs defaultValue="dictation" className="w-full">
          <TabsList className="w-full max-w-md mx-auto bg-[#2a2a2a] p-1 mb-8">
            <TabsTrigger
              value="dictation"
              className="flex-1 data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              听写练习
            </TabsTrigger>
            <TabsTrigger
              value="fillblank"
              className="flex-1 data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              <Target className="w-4 h-4 mr-2" />
              选词填空
            </TabsTrigger>
            <TabsTrigger
              value="phrases"
              className="flex-1 data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              短语搭配
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dictation">
            <DictationPractice />
          </TabsContent>

          <TabsContent value="fillblank">
            <FillInBlankPractice />
          </TabsContent>

          <TabsContent value="phrases">
            <PhrasePractice />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
