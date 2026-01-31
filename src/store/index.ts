import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Video, 
  UserWord, 
  CheckIn, 
  StudyRecord, 
  Note,
  DailyTask,
  SubtitleMode 
} from '@/types';

// 用户学习状态 Store
interface LearningState {
  // 生词本
  vocabulary: UserWord[];
  addToVocabulary: (wordId: string, sourceVideoId: string) => void;
  removeFromVocabulary: (wordId: string) => void;
  updateWordStatus: (wordId: string, status: UserWord['status']) => void;
  getWordStatus: (wordId: string) => UserWord | undefined;
  
  // 学习记录
  studyRecords: StudyRecord[];
  addStudyRecord: (record: StudyRecord) => void;
  
  // 学习统计
  totalStudyTime: number;
  addStudyTime: (minutes: number) => void;
  
  // 观看记录
  watchedVideos: string[];
  markVideoWatched: (videoId: string) => void;
  isVideoWatched: (videoId: string) => boolean;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      vocabulary: [],
      studyRecords: [],
      totalStudyTime: 0,
      watchedVideos: [],

      addToVocabulary: (wordId: string, sourceVideoId: string) => {
        const exists = get().vocabulary.find(v => v.wordId === wordId);
        if (exists) return;
        
        const newWord: UserWord = {
          wordId,
          status: 'new',
          addedAt: new Date().toISOString(),
          lastReviewed: null,
          reviewCount: 0,
          correctCount: 0,
          sourceVideoId,
        };
        set(state => ({
          vocabulary: [...state.vocabulary, newWord],
        }));
      },

      removeFromVocabulary: (wordId: string) => {
        set(state => ({
          vocabulary: state.vocabulary.filter(v => v.wordId !== wordId),
        }));
      },

      updateWordStatus: (wordId: string, status: UserWord['status']) => {
        set(state => ({
          vocabulary: state.vocabulary.map(v =>
            v.wordId === wordId
              ? { ...v, status, lastReviewed: new Date().toISOString(), reviewCount: v.reviewCount + 1 }
              : v
          ),
        }));
      },

      getWordStatus: (wordId: string) => {
        return get().vocabulary.find(v => v.wordId === wordId);
      },

      addStudyRecord: (record: StudyRecord) => {
        set(state => ({
          studyRecords: [...state.studyRecords, record],
        }));
      },

      addStudyTime: (minutes: number) => {
        set(state => ({
          totalStudyTime: state.totalStudyTime + minutes,
        }));
      },

      markVideoWatched: (videoId: string) => {
        if (!get().watchedVideos.includes(videoId)) {
          set(state => ({
            watchedVideos: [...state.watchedVideos, videoId],
          }));
        }
      },

      isVideoWatched: (videoId: string) => {
        return get().watchedVideos.includes(videoId);
      },
    }),
    {
      name: 'learning-storage',
    }
  )
);

// 打卡 Store
interface CheckInState {
  checkIns: CheckIn[];
  streak: number;
  lastCheckIn: string | null;
  todayCheckIn: CheckIn | null;
  
  doCheckIn: (tasks: Partial<CheckIn>) => void;
  getCheckInByDate: (date: string) => CheckIn | undefined;
  getMonthlyCheckIns: (year: number, month: number) => CheckIn[];
  isCheckedInToday: () => boolean;
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkIns: [],
      streak: 0,
      lastCheckIn: null,
      todayCheckIn: null,

      doCheckIn: (tasks: Partial<CheckIn>) => {
        const today = new Date().toISOString().split('T')[0];
        const existing = get().checkIns.find(c => c.date === today);
        
        if (existing) {
          // 更新今日打卡
          set(state => ({
            checkIns: state.checkIns.map(c =>
              c.date === today ? { ...c, ...tasks, completed: true } : c
            ),
            todayCheckIn: { ...existing, ...tasks, completed: true },
          }));
        } else {
          // 新建今日打卡
          const newCheckIn: CheckIn = {
            id: `ci-${Date.now()}`,
            date: today,
            listenMinutes: tasks.listenMinutes || 0,
            wordPractice: tasks.wordPractice || 0,
            videoCompleted: tasks.videoCompleted || 0,
            reviewedWords: tasks.reviewedWords || 0,
            completed: true,
          };
          
          // 计算连续打卡
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const hasYesterday = get().checkIns.some(c => c.date === yesterdayStr);
          
          const newStreak = hasYesterday ? get().streak + 1 : 1;
          
          set(state => ({
            checkIns: [...state.checkIns, newCheckIn],
            todayCheckIn: newCheckIn,
            streak: newStreak,
            lastCheckIn: today,
          }));
        }
      },

      getCheckInByDate: (date: string) => {
        return get().checkIns.find(c => c.date === date);
      },

      getMonthlyCheckIns: (year: number, month: number) => {
        return get().checkIns.filter(c => {
          const date = new Date(c.date);
          return date.getFullYear() === year && date.getMonth() === month;
        });
      },

      isCheckedInToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().checkIns.some(c => c.date === today && c.completed);
      },
    }),
    {
      name: 'checkin-storage',
    }
  )
);

// 播放器状态 Store
interface PlayerState {
  currentVideo: Video | null;
  currentTime: number;
  playbackRate: number;
  isPlaying: boolean;
  subtitleMode: SubtitleMode;
  currentSentenceIndex: number;
  loopSentence: boolean;
  volume: number;
  
  setCurrentVideo: (video: Video | null) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  togglePlay: () => void;
  setSubtitleMode: (mode: SubtitleMode) => void;
  setCurrentSentenceIndex: (index: number) => void;
  toggleLoopSentence: () => void;
  setVolume: (volume: number) => void;
  playSentence: (index: number) => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  currentVideo: null,
  currentTime: 0,
  playbackRate: 1,
  isPlaying: false,
  subtitleMode: 'bilingual',
  currentSentenceIndex: 0,
  loopSentence: false,
  volume: 1,

  setCurrentVideo: (video: Video | null) => {
    set({ 
      currentVideo: video, 
      currentTime: 0, 
      currentSentenceIndex: 0,
      isPlaying: false 
    });
  },

  setCurrentTime: (time: number) => {
    set({ currentTime: time });
  },

  setPlaybackRate: (rate: number) => {
    set({ playbackRate: rate });
  },

  togglePlay: () => {
    set(state => ({ isPlaying: !state.isPlaying }));
  },

  setSubtitleMode: (mode: SubtitleMode) => {
    set({ subtitleMode: mode });
  },

  setCurrentSentenceIndex: (index: number) => {
    set({ currentSentenceIndex: index });
  },

  toggleLoopSentence: () => {
    set(state => ({ loopSentence: !state.loopSentence }));
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  playSentence: (index: number) => {
    const video = get().currentVideo;
    if (!video || !video.sentences[index]) return;
    
    const sentence = video.sentences[index];
    set({
      currentSentenceIndex: index,
      currentTime: sentence.startTime,
      isPlaying: true,
    });
  },
}));

// 笔记 Store
interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'likes'>) => void;
  deleteNote: (noteId: string) => void;
  getNotesByVideo: (videoId: string) => Note[];
  getNotesByUser: (userId: string) => Note[];
  likeNote: (noteId: string) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: `note-${Date.now()}`,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        set(state => ({
          notes: [...state.notes, newNote],
        }));
      },

      deleteNote: (noteId: string) => {
        set(state => ({
          notes: state.notes.filter(n => n.id !== noteId),
        }));
      },

      getNotesByVideo: (videoId: string) => {
        return get().notes.filter(n => n.videoId === videoId);
      },

      getNotesByUser: (userId: string) => {
        return get().notes.filter(n => n.userId === userId);
      },

      likeNote: (noteId: string) => {
        set(state => ({
          notes: state.notes.map(n =>
            n.id === noteId ? { ...n, likes: n.likes + 1 } : n
          ),
        }));
      },
    }),
    {
      name: 'note-storage',
    }
  )
);

// 每日任务 Store
interface TaskState {
  tasks: DailyTask[];
  todayTasks: DailyTask[];
  
  initTodayTasks: () => void;
  updateTaskProgress: (taskType: DailyTask['type'], progress: number) => void;
  completeTask: (taskType: DailyTask['type']) => void;
  getCompletedCount: () => number;
  getTotalCount: () => number;
  allCompleted: () => boolean;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      todayTasks: [],

      initTodayTasks: () => {
        const defaultTasks: DailyTask[] = [
          { id: 't1', type: 'listen', target: 30, current: 0, unit: '分钟', completed: false },
          { id: 't2', type: 'practice', target: 10, current: 0, unit: '个', completed: false },
          { id: 't3', type: 'review', target: 20, current: 0, unit: '个', completed: false },
          { id: 't4', type: 'video', target: 1, current: 0, unit: '个', completed: false },
        ];
        set({ todayTasks: defaultTasks });
      },

      updateTaskProgress: (taskType: DailyTask['type'], progress: number) => {
        set(state => ({
          todayTasks: state.todayTasks.map(t =>
            t.type === taskType
              ? { ...t, current: Math.min(t.current + progress, t.target), completed: t.current + progress >= t.target }
              : t
          ),
        }));
      },

      completeTask: (taskType: DailyTask['type']) => {
        set(state => ({
          todayTasks: state.todayTasks.map(t =>
            t.type === taskType ? { ...t, current: t.target, completed: true } : t
          ),
        }));
      },

      getCompletedCount: () => {
        return get().todayTasks.filter(t => t.completed).length;
      },

      getTotalCount: () => {
        return get().todayTasks.length;
      },

      allCompleted: () => {
        return get().todayTasks.every(t => t.completed);
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
