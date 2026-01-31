import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Headphones, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Play, value: '10,000+', label: '学习视频' },
  { icon: Headphones, value: '50,000+', label: '活跃用户' },
  { icon: TrendingUp, value: '1M+', label: '学习时长' },
];

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Title animation
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      chars.forEach((char, index) => {
        setTimeout(() => {
          char.classList.add('animate-in');
        }, index * 50);
      });
    }
  }, []);

  const title = '沉浸式英语听力学习';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1a1a1a]">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#2a2520]" />
        
        {/* Animated wave pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c5b8a5" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#c5b8a5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#c5b8a5" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              className="animate-float"
              d="M0,400 Q360,300 720,400 T1440,400 L1440,800 L0,800 Z"
              fill="url(#waveGradient)"
            />
            <path
              className="animate-float"
              style={{ animationDelay: '1s' }}
              d="M0,450 Q360,350 720,450 T1440,450 L1440,800 L0,800 Z"
              fill="url(#waveGradient)"
              opacity="0.5"
            />
            <path
              className="animate-float"
              style={{ animationDelay: '2s' }}
              d="M0,500 Q360,400 720,500 T1440,500 L1440,800 L0,800 Z"
              fill="url(#waveGradient)"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#c5b8a5]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b7d6b]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2a2a] border border-[#4a4a4a] mb-8 animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-[#7c9a6e] animate-pulse" />
            <span className="text-sm text-[#9a9a9a]">YouTube 精选素材</span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#f8f5f0] mb-6 leading-tight"
          >
            {title.split('').map((char, index) => (
              <span
                key={index}
                className="char inline-block opacity-0 translate-y-4 transition-all duration-500"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#9a9a9a] mb-4 max-w-2xl mx-auto animate-fade-in-up stagger-2">
            YouTube素材 · 变速听力 · 智能字幕 · 词句拆解
          </p>
          <p className="text-base text-[#6a6a6a] mb-10 max-w-xl mx-auto animate-fade-in-up stagger-3">
            输入 → 理解 → 练习 → 巩固 → 复盘，打造完整学习闭环
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up stagger-4">
            <Link to="/library">
              <Button
                size="lg"
                className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] px-8 py-6 text-lg font-medium btn-glow animate-pulse-soft"
              >
                开始学习
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/library">
              <Button
                variant="outline"
                size="lg"
                className="border-[#4a4a4a] text-[#f8f5f0] hover:bg-[#2a2a2a] px-8 py-6 text-lg"
              >
                浏览素材库
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up stagger-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-[#8b7d6b] group-hover:text-[#c5b8a5] transition-colors" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-semibold text-[#c5b8a5] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#6a6a6a]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent" />

      <style>{`
        .char.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
