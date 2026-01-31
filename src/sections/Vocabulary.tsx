import { useState } from 'react';
import { Volume2, BookOpen, Check, RotateCcw, Search, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLearningStore } from '@/store';
import { videos, commonWords } from '@/data/videos';
import type { Word, WordStatus } from '@/types';

// 获取单词详情
const getWordDetails = (wordId: string): Word | undefined => {
  return commonWords[wordId] || Object.values(commonWords).find(w => w.id === wordId);
};

// 获取来源视频
const getSourceVideo = (videoId: string) => {
  return videos.find(v => v.id === videoId);
};

export default function Vocabulary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showWordDialog, setShowWordDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<WordStatus | 'all'>('all');

  const { vocabulary, updateWordStatus, removeFromVocabulary } = useLearningStore();

  // 过滤单词
  const filteredVocabulary = vocabulary.filter((item) => {
    const word = getWordDetails(item.wordId);
    if (!word) return false;

    const matchesSearch =
      searchQuery === '' ||
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === 'all' || item.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  // 统计
  const stats = {
    all: vocabulary.length,
    new: vocabulary.filter((v) => v.status === 'new').length,
    learning: vocabulary.filter((v) => v.status === 'learning').length,
    mastered: vocabulary.filter((v) => v.status === 'mastered').length,
  };

  // 播放发音
  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // 打开单词详情
  const openWordDetail = (wordId: string) => {
    const word = getWordDetails(wordId);
    if (word) {
      setSelectedWord(word);
      setShowWordDialog(true);
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: WordStatus) => {
    switch (status) {
      case 'new':
        return 'bg-[#6b8b9a]';
      case 'learning':
        return 'bg-[#d4a574]';
      case 'mastered':
        return 'bg-[#7c9a6e]';
    }
  };

  // 获取状态名称
  const getStatusName = (status: WordStatus) => {
    switch (status) {
      case 'new':
        return '新词';
      case 'learning':
        return '学习中';
      case 'mastered':
        return '已掌握';
    }
  };

  return (
    <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-2">
              生词本
            </h1>
            <p className="text-[#9a9a9a]">
              管理你的学习词汇，按艾宾浩斯曲线科学复习
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-medium text-[#c5b8a5]">{stats.mastered}</p>
              <p className="text-sm text-[#6a6a6a]">已掌握 / {stats.all}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '全部单词', value: stats.all, color: '#c5b8a5' },
            { label: '新词', value: stats.new, color: '#6b8b9a' },
            { label: '学习中', value: stats.learning, color: '#d4a574' },
            { label: '已掌握', value: stats.mastered, color: '#7c9a6e' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#2a2a2a] rounded-xl p-4 border border-[#4a4a4a]"
            >
              <p className="text-sm text-[#9a9a9a] mb-1">{stat.label}</p>
              <p className="text-2xl font-medium" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a6a6a]" />
            <Input
              placeholder="搜索单词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2a2a2a] border-[#4a4a4a] text-[#f8f5f0] placeholder:text-[#6a6a6a]"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WordStatus | 'all')}>
          <TabsList className="bg-[#2a2a2a] p-1 mb-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              全部
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              新词
            </TabsTrigger>
            <TabsTrigger
              value="learning"
              className="data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              学习中
            </TabsTrigger>
            <TabsTrigger
              value="mastered"
              className="data-[state=active]:bg-[#3a3a3a] data-[state=active]:text-[#f8f5f0] text-[#9a9a9a]"
            >
              已掌握
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredVocabulary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVocabulary.map((item) => {
                  const word = getWordDetails(item.wordId);
                  if (!word) return null;

                  const sourceVideo = getSourceVideo(item.sourceVideoId);

                  return (
                    <div
                      key={item.wordId}
                      className="bg-[#2a2a2a] rounded-2xl p-5 border border-[#4a4a4a] hover:border-[#c5b8a5] transition-all group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3
                            className="text-xl font-medium text-[#f8f5f0] cursor-pointer hover:text-[#c5b8a5]"
                            onClick={() => openWordDetail(item.wordId)}
                          >
                            {word.word}
                          </h3>
                          <button
                            onClick={() => playAudio(word.word)}
                            className="text-[#6a6a6a] hover:text-[#c5b8a5] transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <Badge
                          className={`${getStatusColor(item.status)} text-white text-xs`}
                        >
                          {getStatusName(item.status)}
                        </Badge>
                      </div>

                      {/* Phonetic & Meaning */}
                      <p className="text-sm text-[#9a9a9a] mb-1">{word.phonetic}</p>
                      <p className="text-[#f8f5f0] mb-3">{word.translation}</p>

                      {/* Example */}
                      <p className="text-sm text-[#6a6a6a] line-clamp-2 mb-4">
                        {word.example}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#4a4a4a]">
                        <div className="flex items-center gap-2">
                          {item.status !== 'mastered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateWordStatus(item.wordId, 'mastered')}
                              className="text-[#7c9a6e] hover:bg-[#7c9a6e]/20"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              掌握
                            </Button>
                          )}
                          {item.status === 'mastered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateWordStatus(item.wordId, 'learning')}
                              className="text-[#d4a574] hover:bg-[#d4a574]/20"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              重学
                            </Button>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#6a6a6a] hover:text-[#f8f5f0]"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#2a2a2a] border-[#4a4a4a]">
                            <DropdownMenuItem
                              onClick={() => openWordDetail(item.wordId)}
                              className="text-[#f8f5f0] hover:bg-[#3a3a3a] cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => removeFromVocabulary(item.wordId)}
                              className="text-[#b07070] hover:bg-[#b07070]/20 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Source */}
                      {sourceVideo && (
                        <p className="text-xs text-[#6a6a6a] mt-3">
                          来源: {sourceVideo.title}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#6a6a6a]" />
                </div>
                <h3 className="text-xl text-[#f8f5f0] mb-2">
                  {vocabulary.length === 0 ? '生词本为空' : '没有找到匹配的单词'}
                </h3>
                <p className="text-[#6a6a6a]">
                  {vocabulary.length === 0
                    ? '在学习过程中点击单词添加到生词本'
                    : '尝试调整搜索条件'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Word Detail Dialog */}
        <Dialog open={showWordDialog} onOpenChange={setShowWordDialog}>
          <DialogContent className="bg-[#2a2a2a] border-[#4a4a4a] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#f8f5f0] flex items-center gap-3">
                <span className="text-2xl">{selectedWord?.word}</span>
                <button
                  onClick={() => selectedWord && playAudio(selectedWord.word)}
                  className="text-[#6a6a6a] hover:text-[#c5b8a5]"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#9a9a9a]">
                  {selectedWord?.phonetic} {selectedWord?.partOfSpeech}
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
