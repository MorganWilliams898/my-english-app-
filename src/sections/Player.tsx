import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  ChevronLeft,
  BookOpen,
  Type,
  MessageSquare,
  Plus,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { videos, getCategoryName, getLevelInfo, commonWords } from '@/data/videos';
import { usePlayerStore, useLearningStore, useNoteStore } from '@/store';
import type { Word, SubtitleMode } from '@/types';

export default function Player() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWordDialog, setShowWordDialog] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const {
    currentVideo,
    currentTime,
    playbackRate,
    isPlaying,
    subtitleMode,
    currentSentenceIndex,
    loopSentence,
    volume,
    setCurrentVideo,
    setCurrentTime,
    setPlaybackRate,
    togglePlay,
    setSubtitleMode,
    setCurrentSentenceIndex,
    toggleLoopSentence,
    setVolume,
    playSentence,
  } = usePlayerStore();

  const { addToVocabulary, getWordStatus } = useLearningStore();
  const { addNote, getNotesByVideo } = useNoteStore();

  // Load video
  useEffect(() => {
    if (videoId) {
      const video = videos.find((v) => v.id === videoId);
      if (video) {
        setCurrentVideo(video);
      } else {
        navigate('/library');
      }
    }
    return () => {
      setCurrentVideo(null);
    };
  }, [videoId, setCurrentVideo, navigate]);

  // Update current sentence based on time
  useEffect(() => {
    if (!currentVideo) return;

    const currentIndex = currentVideo.sentences.findIndex(
      (s, i) =>
        currentTime >= s.startTime &&
        currentTime < (currentVideo.sentences[i + 1]?.startTime || Infinity)
    );

    if (currentIndex !== -1 && currentIndex !== currentSentenceIndex) {
      setCurrentSentenceIndex(currentIndex);
    }
  }, [currentTime, currentVideo, currentSentenceIndex, setCurrentSentenceIndex]);

  // Handle time update from video
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [setCurrentTime]);

  // Handle sentence click
  const handleSentenceClick = (index: number) => {
    playSentence(index);
    if (videoRef.current) {
      videoRef.current.currentTime = currentVideo?.sentences[index].startTime || 0;
    }
  };

  // Handle word click
  const handleWordClick = (word: string) => {
    const normalizedWord = word.toLowerCase().replace(/[^a-z]/g, '');
    const wordData = commonWords[normalizedWord] || currentVideo?.vocabulary.find(
      (w) => w.word.toLowerCase() === normalizedWord
    );

    if (wordData) {
      setSelectedWord(wordData);
      setShowWordDialog(true);
    }
  };

  // Add to vocabulary
  const handleAddToVocabulary = () => {
    if (selectedWord && currentVideo) {
      addToVocabulary(selectedWord.id, currentVideo.id);
      setShowWordDialog(false);
    }
  };

  // Add note
  const handleAddNote = () => {
    if (noteContent.trim() && currentVideo) {
      addNote({
        userId: 'user-1',
        videoId: currentVideo.id,
        content: noteContent,
      });
      setNoteContent('');
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Speed options
  const speedOptions = [0.5, 0.7, 0.8, 0.9, 1, 1.2, 1.5, 2];

  // Subtitle modes
  const subtitleModes: { value: SubtitleMode; label: string }[] = [
    { value: 'bilingual', label: '中英双语' },
    { value: 'english', label: '仅英文' },
    { value: 'chinese', label: '仅中文' },
    { value: 'none', label: '无字幕' },
  ];

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c5b8a5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9a9a9a]">加载中...</p>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(currentVideo.level);
  const notes = getNotesByVideo(currentVideo.id);
  const isWordInVocabulary = selectedWord ? getWordStatus(selectedWord.id) : undefined;

  return (
    <section className="min-h-screen bg-[#1a1a1a] pt-20">
      {/* Header */}
      <div className="border-b border-[#4a4a4a] bg-[#2a2a2a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/library')}
              className="text-[#9a9a9a] hover:text-[#f8f5f0]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-medium text-[#f8f5f0] line-clamp-1">
                {currentVideo.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-[#3a3a3a] text-[#9a9a9a] text-xs"
                >
                  {getCategoryName(currentVideo.category)}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: `${levelInfo?.color}20`,
                    color: levelInfo?.color,
                  }}
                >
                  {levelInfo?.name}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => usePlayerStore.setState({ isPlaying: true })}
                onPause={() => usePlayerStore.setState({ isPlaying: false })}
              />
              
              {/* Custom Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!isPlaying && (
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full bg-[#c5b8a5]/90 hover:bg-[#c5b8a5] pointer-events-auto"
                    onClick={togglePlay}
                  >
                    <Play className="w-8 h-8 text-[#0d0d0d] ml-1" />
                  </Button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-[#2a2a2a] rounded-2xl p-4 space-y-4">
              {/* Progress */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#9a9a9a] w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={currentVideo.duration}
                  step={1}
                  onValueChange={([value]) => {
                    setCurrentTime(value);
                    if (videoRef.current) {
                      videoRef.current.currentTime = value;
                    }
                  }}
                  className="flex-1"
                />
                <span className="text-sm text-[#9a9a9a] w-12">
                  {formatTime(currentVideo.duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-[#f8f5f0] hover:bg-[#3a3a3a]"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newIndex = Math.max(0, currentSentenceIndex - 1);
                      handleSentenceClick(newIndex);
                    }}
                    className="text-[#9a9a9a] hover:text-[#f8f5f0] hover:bg-[#3a3a3a]"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newIndex = Math.min(
                        currentVideo.sentences.length - 1,
                        currentSentenceIndex + 1
                      );
                      handleSentenceClick(newIndex);
                    }}
                    className="text-[#9a9a9a] hover:text-[#f8f5f0] hover:bg-[#3a3a3a]"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLoopSentence}
                    className={`hover:bg-[#3a3a3a] ${
                      loopSentence ? 'text-[#c5b8a5]' : 'text-[#9a9a9a]'
                    }`}
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVolume(volume === 0 ? 1 : 0)}
                      className="text-[#9a9a9a] hover:text-[#f8f5f0] hover:bg-[#3a3a3a]"
                    >
                      {volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      step={10}
                      onValueChange={([value]) => setVolume(value / 100)}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#9a9a9a]">倍速</span>
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(Number(e.target.value))}
                    className="bg-[#3a3a3a] text-[#f8f5f0] rounded-lg px-3 py-1 text-sm border border-[#4a4a4a] focus:border-[#c5b8a5] outline-none"
                  >
                    {speedOptions.map((speed) => (
                      <option key={speed} value={speed}>
                        {speed}x
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Subtitles */}
            {subtitleMode !== 'none' && (
              <div className="bg-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-[#9a9a9a]">字幕</h3>
                  <div className="flex items-center gap-2">
                    {subtitleModes.map((mode) => (
                      <Button
                        key={mode.value}
                        variant={subtitleMode === mode.value ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSubtitleMode(mode.value)}
                        className={
                          subtitleMode === mode.value
                            ? 'bg-[#c5b8a5] text-[#0d0d0d]'
                            : 'text-[#9a9a9a] hover:text-[#f8f5f0]'
                        }
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Sentence */}
                {currentVideo.sentences[currentSentenceIndex] && (
                  <div className="text-center space-y-3">
                    {(subtitleMode === 'bilingual' || subtitleMode === 'english') && (
                      <p className="text-xl text-[#f8f5f0] leading-relaxed">
                        {currentVideo.sentences[currentSentenceIndex].english
                          .split(' ')
                          .map((word, i) => (
                            <span
                              key={i}
                              className="cursor-pointer hover:text-[#c5b8a5] transition-colors mx-1"
                              onClick={() => handleWordClick(word)}
                            >
                              {word}
                            </span>
                          ))}
                      </p>
                    )}
                    {(subtitleMode === 'bilingual' || subtitleMode === 'chinese') && (
                      <p className="text-lg text-[#9a9a9a]">
                        {currentVideo.sentences[currentSentenceIndex].chinese}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Tabs defaultValue="sentences" className="w-full">
              <TabsList className="w-full bg-[#2a2a2a] p-1">
                <TabsTrigger
                  value="sentences"
                  className="flex-1 data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
                >
                  <Type className="w-4 h-4 mr-2" />
                  句子
                </TabsTrigger>
                <TabsTrigger
                  value="vocabulary"
                  className="flex-1 data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  词汇
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="flex-1 data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  笔记
                </TabsTrigger>
              </TabsList>

              {/* Sentences Tab */}
              <TabsContent value="sentences" className="mt-4">
                <div className="bg-[#2a2a2a] rounded-2xl p-4 max-h-[500px] overflow-y-auto">
                  <div className="space-y-2">
                    {currentVideo.sentences.map((sentence, index) => (
                      <div
                        key={sentence.id}
                        onClick={() => handleSentenceClick(index)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          currentSentenceIndex === index
                            ? 'bg-[#c5b8a5]/20 border border-[#c5b8a5]/50'
                            : 'hover:bg-[#3a3a3a] border border-transparent'
                        }`}
                      >
                        <p className="text-sm text-[#f8f5f0] mb-1">{sentence.english}</p>
                        <p className="text-xs text-[#6a6a6a]">{sentence.chinese}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Vocabulary Tab */}
              <TabsContent value="vocabulary" className="mt-4">
                <div className="bg-[#2a2a2a] rounded-2xl p-4 max-h-[500px] overflow-y-auto">
                  <div className="space-y-3">
                    {currentVideo.vocabulary.map((word) => {
                      const isAdded = getWordStatus(word.id);
                      return (
                        <div
                          key={word.id}
                          className="p-3 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-lg font-medium text-[#f8f5f0]">
                                {word.word}
                              </p>
                              <p className="text-sm text-[#9a9a9a]">
                                {word.phonetic} {word.partOfSpeech}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (!isAdded) {
                                  addToVocabulary(word.id, currentVideo.id);
                                }
                              }}
                              className={isAdded ? 'text-[#7c9a6e]' : 'text-[#9a9a9a]'}
                            >
                              {isAdded ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-[#9a9a9a] mt-2">{word.translation}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-4">
                <div className="bg-[#2a2a2a] rounded-2xl p-4">
                  <Textarea
                    placeholder="添加学习笔记..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="bg-[#3a3a3a] border-[#4a4a4a] text-[#f8f5f0] placeholder:text-[#6a6a6a] mb-3 min-h-[100px]"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!noteContent.trim()}
                    className="w-full bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] disabled:opacity-50"
                  >
                    添加笔记
                  </Button>

                  {/* Notes List */}
                  <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-[#3a3a3a]"
                      >
                        <p className="text-sm text-[#f8f5f0]">{note.content}</p>
                        <p className="text-xs text-[#6a6a6a] mt-2">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Word Dialog */}
      <Dialog open={showWordDialog} onOpenChange={setShowWordDialog}>
        <DialogContent className="bg-[#2a2a2a] border-[#4a4a4a] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f8f5f0] flex items-center gap-3">
              <span className="text-2xl">{selectedWord?.word}</span>
              <span className="text-sm text-[#9a9a9a]">{selectedWord?.phonetic}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#9a9a9a]">
                {selectedWord?.partOfSpeech}
              </p>
              <p className="text-lg text-[#f8f5f0] mt-1">
                {selectedWord?.translation}
              </p>
            </div>
            <div className="bg-[#3a3a3a] rounded-xl p-4">
              <p className="text-sm text-[#9a9a9a] mb-2">例句</p>
              <p className="text-[#f8f5f0]">{selectedWord?.example}</p>
              <p className="text-sm text-[#6a6a6a] mt-1">
                {selectedWord?.exampleTranslation}
              </p>
            </div>
            <Button
              onClick={handleAddToVocabulary}
              disabled={!!isWordInVocabulary}
              className="w-full bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] disabled:opacity-50"
            >
              {isWordInVocabulary ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  已添加到生词本
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  添加到生词本
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
