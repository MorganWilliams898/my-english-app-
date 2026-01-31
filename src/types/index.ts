// 视频分类
export type VideoCategory = 'daily' | 'work' | 'travel' | 'news' | 'academic' | 'movie';

// 难度等级
export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';

// 句子复杂度
export type SentenceComplexity = 'simple' | 'compound' | 'complex';

// 字幕模式
export type SubtitleMode = 'bilingual' | 'chinese' | 'english' | 'none';

// 句子
export interface Sentence {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  english: string;
  chinese: string;
  words: string[];
}

// 单词
export interface Word {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  translation: string;
  example: string;
  exampleTranslation: string;
}

// 视频素材
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: VideoCategory;
  level: DifficultyLevel;
  vocabularyCount: number;
  sentenceComplexity: SentenceComplexity;
  duration: number; // 秒
  sentences: Sentence[];
  vocabulary: Word[];
  tags: string[];
}

// 用户学习状态
export type WordStatus = 'new' | 'learning' | 'mastered';

// 用户单词
export interface UserWord {
  wordId: string;
  status: WordStatus;
  addedAt: string;
  lastReviewed: string | null;
  reviewCount: number;
  correctCount: number;
  sourceVideoId: string;
}

// 学习记录
export interface StudyRecord {
  id: string;
  date: string;
  videoId: string;
  startTime: number;
  endTime: number;
  duration: number;
  wordsLearned: string[];
  notes: string;
}

// 打卡记录
export interface CheckIn {
  id: string;
  date: string;
  listenMinutes: number;
  wordPractice: number;
  videoCompleted: number;
  reviewedWords: number;
  completed: boolean;
}

// 每日任务
export interface DailyTask {
  id: string;
  type: 'listen' | 'practice' | 'review' | 'video';
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

// 用户进度
export interface UserProgress {
  userId: string;
  watchedVideos: string[];
  learnedWords: UserWord[];
  checkInStreak: number;
  lastCheckIn: string | null;
  totalStudyTime: number;
  totalWords: number;
  dailyGoal: {
    listenMinutes: number;
    wordCount: number;
    reviewCount: number;
  };
}

// 学习笔记
export interface Note {
  id: string;
  userId: string;
  videoId: string;
  sentenceId?: string;
  content: string;
  createdAt: string;
  likes: number;
}

// 社区动态
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'note' | 'checkin' | 'achievement';
  content: string;
  videoId?: string;
  videoTitle?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

// 分类信息
export interface CategoryInfo {
  id: VideoCategory;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

// 难度信息
export interface LevelInfo {
  id: DifficultyLevel;
  name: string;
  nameEn: string;
  vocabularyRange: string;
  description: string;
  color: string;
}
