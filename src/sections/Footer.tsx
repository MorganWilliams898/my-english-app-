import { Link } from 'react-router-dom';
import { Headphones, Github, Mail, Twitter } from 'lucide-react';

const footerLinks = {
  product: [
    { label: '素材库', href: '/library' },
    { label: '学习', href: '/learn' },
    { label: '练习', href: '/practice' },
    { label: '生词本', href: '/vocabulary' },
  ],
  support: [
    { label: '使用指南', href: '#' },
    { label: '常见问题', href: '#' },
    { label: '反馈建议', href: '#' },
  ],
  about: [
    { label: '关于我们', href: '#' },
    { label: '隐私政策', href: '#' },
    { label: '服务条款', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#2a2a2a]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5b8a5] to-[#8b7d6b] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-[#0d0d0d]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-[#f8f5f0]">
                  英语听力
                </span>
                <span className="text-xs text-[#6a6a6a]">English Listening</span>
              </div>
            </Link>
            <p className="text-[#6a6a6a] mb-6 max-w-sm">
              让英语学习更高效、更有趣。通过 YouTube 精选素材，结合变速听力、智能字幕、词句拆解，打造完整学习闭环。
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#6a6a6a] hover:text-[#f8f5f0] hover:bg-[#3a3a3a] transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#6a6a6a] hover:text-[#f8f5f0] hover:bg-[#3a3a3a] transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-[#6a6a6a] hover:text-[#f8f5f0] hover:bg-[#3a3a3a] transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#f8f5f0] font-medium mb-4">产品</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#6a6a6a] hover:text-[#c5b8a5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#f8f5f0] font-medium mb-4">支持</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#6a6a6a] hover:text-[#c5b8a5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#f8f5f0] font-medium mb-4">关于</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#6a6a6a] hover:text-[#c5b8a5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#2a2a2a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6a6a6a]">
            &copy; {new Date().getFullYear()} 英语听力学习. All rights reserved.
          </p>
          <p className="text-sm text-[#6a6a6a]">
            Made with love for English learners
          </p>
        </div>
      </div>
    </footer>
  );
}
