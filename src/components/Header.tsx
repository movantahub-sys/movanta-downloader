/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Download, Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage } from '../translations';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

// Languages array definition for supported selector options
const actualLanguages: Array<{ code: SupportedLanguage; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Indonesia' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ko', label: '한국어' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'it', label: 'Italiano' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' }
];

export default function Header({
  currentView,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  language,
  onChangeLanguage,
  t,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('home') },
    { id: 'history', label: t('history') },
    { id: 'faq', label: t('faqTitle') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <header 
      id="app-header" 
      className={`sticky top-3 sm:top-4 z-40 mx-auto max-w-7xl w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] rounded-2xl glass transition-all duration-300 ${
        scrolled 
          ? isDarkMode 
            ? 'bg-slate-950/85 border-indigo-500/20 shadow-xl shadow-indigo-950/30 py-0.5' 
            : 'bg-white/95 border-slate-200/80 shadow-md shadow-slate-100/50 py-0.5'
          : isDarkMode 
            ? 'bg-slate-950/40 border-white/5 py-2' 
            : 'bg-white/60 border-slate-200/50 py-2'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-2">
        {/* Brand Logo */}
        <div 
          id="header-brand" 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-indigo-600">
            <img 
              src="/src/assets/images/movanta_logo_1784483154778.jpg" 
              alt="Movanta Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className={`text-base sm:text-lg font-bold tracking-tight flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Movanta 
              <span className="text-[9px] font-semibold text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full ml-2 uppercase tracking-wide">
                PREMIUM
              </span>
            </h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Universal Media Extraction</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs font-semibold tracking-wider transition-all uppercase ${
                currentView === item.id || (item.id === 'home' && currentView === 'downloader')
                  ? isDarkMode 
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30' 
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-xs'
                  : isDarkMode
                    ? 'hover:bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
                    : 'hover:bg-slate-100/70 text-slate-600 hover:text-slate-900 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Toolbar (Theme Switcher, Language Selector, Mobile Toggle) */}
        <div id="header-toolbar" className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Active Server Badge (Hidden on mobile & tablets to prevent crowding) */}
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${
            isDarkMode 
              ? 'bg-slate-800/40 border-slate-700/50 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            <span className="status-dot status-online"></span>
            <span>Server: Frankfurt-01</span>
          </div>
          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button
              id="language-selector-btn"
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-medium cursor-pointer ${
                isDarkMode 
                  ? 'border-white/10 hover:bg-slate-800/50 text-gray-300' 
                  : 'border-slate-200 hover:bg-slate-100 text-gray-600'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase hidden lg:inline">{language}</span>
            </button>
            <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden max-h-80 overflow-y-auto hidden group-focus-within:block hover:block transition-all z-50 ${
              isDarkMode 
                ? 'bg-[#151824] border-[#ffffff10]' 
                : 'bg-white border-[#00000010]'
            }`}>
              {actualLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onChangeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                    language === lang.code
                      ? isDarkMode
                        ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
                        : 'bg-indigo-50 text-indigo-600 font-semibold'
                      : isDarkMode
                        ? 'hover:bg-[#ffffff08] text-gray-300 hover:text-white'
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Switcher Button */}
          <button
            id="theme-switcher-btn"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDarkMode 
                ? 'border-white/10 hover:bg-slate-800/50 text-blue-400' 
                : 'border-slate-200 hover:bg-slate-100 text-amber-500'
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDarkMode 
                ? 'border-white/10 hover:bg-slate-800/50 text-gray-300' 
                : 'border-slate-200 hover:bg-slate-100 text-gray-600'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile/Tablet Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-drawer" 
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute top-[calc(100%+0.5rem)] left-0 right-0 z-50 rounded-2xl shadow-2xl border p-3.5 space-y-1.5 ${
              isDarkMode 
                ? 'bg-slate-950/95 border-indigo-500/25 backdrop-blur-xl shadow-indigo-950/50' 
                : 'bg-white/95 border-slate-200/90 backdrop-blur-xl shadow-slate-200/50'
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all block cursor-pointer ${
                  currentView === item.id || (item.id === 'home' && currentView === 'downloader')
                    ? isDarkMode 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/15'
                    : isDarkMode
                      ? 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
