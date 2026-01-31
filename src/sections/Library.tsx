import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Play, Clock, BookOpen, Heart, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { videos, categories, levels, getCategoryName, getLevelInfo } from '@/data/videos';
import type { VideoCategory, DifficultyLevel } from '@/types';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        searchQuery === '' ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || video.category === selectedCategory;

      const matchesLevel = selectedLevel === 'all' || video.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const toggleFavorite = (videoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="min-h-screen bg-[#1a1a1a] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-light text-[#f8f5f0] mb-4">
            素材库
          </h1>
          <p className="text-[#9a9a9a]">
            精选 YouTube 英语学习素材，按难度分级，助你循序渐进提升听力
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a6a6a]" />
            <Input
              placeholder="搜索视频标题、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2a2a2a] border-[#4a4a4a] text-[#f8f5f0] placeholder:text-[#6a6a6a] focus:border-[#c5b8a5] focus:ring-[#c5b8a5]/20"
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-[#4a4a4a] text-[#f8f5f0] hover:bg-[#2a2a2a] min-w-[140px]"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedCategory === 'all'
                  ? '全部分类'
                  : getCategoryName(selectedCategory)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2a2a2a] border-[#4a4a4a]">
              <DropdownMenuItem
                onClick={() => setSelectedCategory('all')}
                className="text-[#f8f5f0] hover:bg-[#3a3a3a] cursor-pointer"
              >
                全部分类
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-[#f8f5f0] hover:bg-[#3a3a3a] cursor-pointer"
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Level Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-[#4a4a4a] text-[#f8f5f0] hover:bg-[#2a2a2a] min-w-[140px]"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {selectedLevel === 'all'
                  ? '全部难度'
                  : getLevelInfo(selectedLevel)?.name}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2a2a2a] border-[#4a4a4a]">
              <DropdownMenuItem
                onClick={() => setSelectedLevel('all')}
                className="text-[#f8f5f0] hover:bg-[#3a3a3a] cursor-pointer"
              >
                全部难度
              </DropdownMenuItem>
              {levels.map((level) => (
                <DropdownMenuItem
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className="text-[#f8f5f0] hover:bg-[#3a3a3a] cursor-pointer"
                >
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: level.color }}
                  />
                  {level.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#9a9a9a]">
            共 <span className="text-[#c5b8a5] font-medium">{filteredVideos.length}</span> 个视频
          </p>
          {(selectedCategory !== 'all' || selectedLevel !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSearchQuery('');
              }}
              className="text-[#8b7d6b] hover:text-[#c5b8a5]"
            >
              清除筛选
            </Button>
          )}
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => {
              const levelInfo = getLevelInfo(video.level);
              const isFavorite = favorites.has(video.id);

              return (
                <Link
                  key={video.id}
                  to={`/learn/${video.id}`}
                  className="group bg-[#2a2a2a] rounded-2xl overflow-hidden border border-[#4a4a4a] hover:border-[#c5b8a5] transition-all duration-300 card-hover opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/640x360/2a2a2a/c5b8a5?text=${encodeURIComponent(video.title)}`;
                      }}
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#c5b8a5] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 text-[#0d0d0d] ml-1" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 text-xs text-[#f8f5f0] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(video.duration)}
                    </div>
                    {/* Favorite button */}
                    <button
                      onClick={(e) => toggleFavorite(video.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFavorite ? 'fill-[#b07070] text-[#b07070]' : 'text-[#f8f5f0]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category & Level */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-[#3a3a3a] text-[#9a9a9a] text-xs"
                      >
                        {getCategoryName(video.category)}
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

                    {/* Title */}
                    <h3 className="text-lg font-medium text-[#f8f5f0] mb-2 line-clamp-2 group-hover:text-[#c5b8a5] transition-colors">
                      {video.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#6a6a6a] line-clamp-2 mb-4">
                      {video.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#6a6a6a]">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {video.vocabularyCount} 词
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(video.duration)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#6a6a6a]" />
            </div>
            <h3 className="text-xl text-[#f8f5f0] mb-2">未找到相关视频</h3>
            <p className="text-[#6a6a6a]">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>
    </section>
  );
}
