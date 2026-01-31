import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Headphones, BookOpen, PenTool, Library, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/', label: '首页', icon: null },
  { path: '/library', label: '素材库', icon: Library },
  { path: '/learn', label: '学习', icon: Headphones },
  { path: '/practice', label: '练习', icon: PenTool },
  { path: '/vocabulary', label: '生词本', icon: BookOpen },
  { path: '/dashboard', label: '打卡', icon: Calendar },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1a1a1a]/98 backdrop-blur-md shadow-lg'
          : 'bg-[#1a1a1a]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5b8a5] to-[#8b7d6b] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Headphones className="w-5 h-5 text-[#0d0d0d]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#f8f5f0] leading-tight">
                英语听力
              </span>
              <span className="text-xs text-[#8b7d6b]">English Listening</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                  isActive(item.path)
                    ? 'text-[#c5b8a5]'
                    : 'text-[#9a9a9a] hover:text-[#f8f5f0]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#c5b8a5] rounded-full transition-all duration-300 ${
                    isActive(item.path) ? 'w-6' : 'w-0 group-hover:w-4'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#9a9a9a] hover:text-[#f8f5f0] hover:bg-[#2a2a2a]"
            >
              登录
            </Button>
            <Button
              size="sm"
              className="bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8] btn-glow"
            >
              注册
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#f8f5f0]">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] bg-[#1a1a1a] border-l border-[#4a4a4a] p-0"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#4a4a4a]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c5b8a5] to-[#8b7d6b] flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-[#0d0d0d]" />
                    </div>
                    <span className="font-semibold text-[#f8f5f0]">英语听力</span>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                          isActive(item.path)
                            ? 'bg-[#2a2a2a] text-[#c5b8a5] border-r-2 border-[#c5b8a5]'
                            : 'text-[#9a9a9a] hover:bg-[#2a2a2a] hover:text-[#f8f5f0]'
                        }`}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-[#4a4a4a] space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-[#4a4a4a] text-[#f8f5f0] hover:bg-[#2a2a2a]"
                  >
                    登录
                  </Button>
                  <Button className="w-full bg-[#c5b8a5] text-[#0d0d0d] hover:bg-[#d4c4a8]">
                    注册
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
