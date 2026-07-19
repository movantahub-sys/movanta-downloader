/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, RefreshCw, X, HelpCircle, FileDown, ArrowUp } from 'lucide-react';
import { MediaMetadata, MediaFormat, HistoryItem, ToastMessage, DownloadQueueItem } from './types';
import { detectLanguage, dictionaries, SupportedLanguage } from './translations';

// Components
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import DownloaderView from './components/DownloaderView';
import HistoryView from './components/HistoryView';
import FaqView from './components/FaqView';
import TermsAndPrivacyView from './components/TermsAndPrivacyView';
import ContactView from './components/ContactView';
import ApiDocsView from './components/ApiDocsView';
import DashboardView from './components/DashboardView';

export default function App() {
  // Navigation View Router State
  const [currentView, setCurrentView] = useState<string>('home');

  // Dark/Light Theme Switcher State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Active Multi-language State (auto-detect browser defaults on load)
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Active Media Extraction Payload State
  const [extractionMetadata, setExtractionMetadata] = useState<MediaMetadata | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Client-persistent History List
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Batch Queue Downloads List
  const [queueItems, setQueueItems] = useState<DownloadQueueItem[]>([]);

  // Floating Toast Notifications List
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Active progress variables for current download
  const [activeDownloadProgress, setActiveDownloadProgress] = useState<number | null>(null);
  const [activeDownloadSpeed, setActiveDownloadSpeed] = useState<string>('0 MB/s');

  // Floating scroll-to-top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-detect dark mode preferences and language
  useEffect(() => {
    // Detect system dark theme preference
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isSystemDark);
      
      // Auto-detect browser default language
      const browserLang = detectLanguage();
      setLanguage(browserLang);

      // Load Cached History items
      const cachedHistory = localStorage.getItem('umd_download_history');
      if (cachedHistory) {
        try {
          setHistoryItems(JSON.parse(cachedHistory));
        } catch (e) {
          console.error('Failed to parse cached history items.');
        }
      }
    }
  }, []);

  // Update DOM class lists and save settings when Theme toggles
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save history items to client local storage when list changes
  const saveHistoryToCache = (newItems: HistoryItem[]) => {
    setHistoryItems(newItems);
    localStorage.setItem('umd_download_history', JSON.stringify(newItems));
  };

  // Safe Multi-language Translation utility wrapper
  const translate = (key: string): string => {
    const dict = dictionaries[language] || dictionaries['en'];
    return (dict as any)[key] || key;
  };

  // Show customized Toast notifications
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto purge toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Perform secure metadata extraction handshake with Backend
  const handleExtractMetadata = async (url: string) => {
    setIsExtracting(true);
    setCurrentView('home'); // transition/keep on home for extraction spinner

    try {
      const response = await fetch('/api/v1/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const result = await response.json();

      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Server extraction handshakes failed.');
      }

      setExtractionMetadata(result.metadata);
      setCurrentView('downloader');
      triggerToast('Metadata successfully extracted and validated!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Connection timeout. Please retry.', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  // Execute safe proxy browser download routing
  const handleExecuteDownload = async (format: MediaFormat, options: any) => {
    if (!extractionMetadata) return;

    setActiveDownloadProgress(1);
    setActiveDownloadSpeed('Calculating connection speed...');

    try {
      // Simulate download progress steps (since downloading is proxied asynchronously)
      const interval = setInterval(() => {
        setActiveDownloadProgress((prev) => {
          if (prev === null) {
            clearInterval(interval);
            return null;
          }
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const increment = Math.floor(Math.random() * 15) + 5;
          return Math.min(100, prev + increment);
        });
        setActiveDownloadSpeed(`${(Math.random() * 8 + 2).toFixed(1)} MB/s`);
      }, 500);

      // Trigger standard REST download endpoint
      const downloadUrl = `/api/v1/download?url=${encodeURIComponent(extractionMetadata.url)}&format=${format.id}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${options.customMetadata?.title || extractionMetadata.title}.${format.container}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to local historical caches
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 10),
        url: extractionMetadata.url,
        platform: extractionMetadata.platform,
        title: options.customMetadata?.title || extractionMetadata.title,
        thumbnail: extractionMetadata.thumbnail,
        quality: format.quality,
        sizeFormatted: format.sizeFormatted,
        timestamp: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'completed',
        progress: 100
      };

      // Ensure interval cleans up on complete
      setTimeout(() => {
        clearInterval(interval);
        setActiveDownloadProgress(null);
        saveHistoryToCache([newHistoryItem, ...historyItems]);
        triggerToast('Media file packaged and downloaded successfully!', 'success');
      }, 4000);

    } catch (err: any) {
      setActiveDownloadProgress(null);
      triggerToast('File compilation failed. Please verify format codecs.', 'error');
    }
  };

  // Add items to Queue panel
  const handleAddDownloadToQueue = (options: any) => {
    if (!extractionMetadata) return;

    const id = Math.random().toString(36).substring(2, 10);
    const newItem: DownloadQueueItem = {
      id,
      url: extractionMetadata.url,
      platform: extractionMetadata.platform,
      title: options.customMetadata?.title || extractionMetadata.title,
      status: 'queued',
      progress: 0,
      sizeFormatted: '24.5 MB'
    };

    setQueueItems((prev) => [...prev, newItem]);
    triggerToast('Added to download queue!', 'success');

    // Simulate batch operations triggering background polling
    setTimeout(() => {
      setQueueItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'downloading', progress: 45 } : item))
      );

      setTimeout(() => {
        setQueueItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'completed', progress: 100 } : item))
        );
        
        // Push completed queue items to local History list too
        const hist: HistoryItem = {
          id: Math.random().toString(36).substring(2, 10),
          url: newItem.url,
          platform: newItem.platform,
          title: newItem.title,
          thumbnail: extractionMetadata.thumbnail,
          quality: '1080p HD',
          sizeFormatted: newItem.sizeFormatted,
          timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'completed',
          progress: 100
        };
        saveHistoryToCache([hist, ...historyItems]);
        triggerToast(`Queue item "${newItem.title}" finished packaging!`, 'success');
      }, 3500);
    }, 2000);
  };

  // Delete individual historical download records
  const handleDeleteHistoryItem = (id: string) => {
    const filtered = historyItems.filter((item) => item.id !== id);
    saveHistoryToCache(filtered);
    triggerToast('Download record deleted.', 'info');
  };

  // Clear entire history catalog
  const handleClearHistory = () => {
    saveHistoryToCache([]);
    triggerToast('All download records cleared.', 'warning');
  };

  // Quick action: Redownload historical item
  const handleRedownloadItem = (item: HistoryItem) => {
    handleExtractMetadata(item.url);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden ${
      isDarkMode ? 'dark text-[#f8f9fa]' : 'text-[#1f2937]'
    }`}>
      {/* 1. Universal animated backdrop matching dark/light presets */}
      <AnimatedBackground isDarkMode={isDarkMode} />

      {/* 2. Premium Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onChangeLanguage={setLanguage}
        t={translate}
      />

      {/* 3. Global Download Progress Loader Bar */}
      {activeDownloadProgress !== null && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 shadow-lg flex items-center justify-between text-white text-xs font-semibold animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            <span className="truncate">Packaging download stream: {activeDownloadProgress}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline font-mono">{activeDownloadSpeed}</span>
            <div className="w-24 sm:w-32 bg-white/20 h-2 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: `${activeDownloadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Background Extraction Spinnier */}
      {isExtracting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="p-3 bg-indigo-600 rounded-full shadow-xl text-white"
          >
            <RefreshCw className="w-8 h-8" />
          </motion.div>
          <span className="text-sm font-semibold text-white tracking-wide animate-pulse">
            {translate('processing')}
          </span>
        </div>
      )}

      {/* 5. Main Content Canvas with smooth slide routing */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {currentView === 'home' && (
              <HomeView
                onExtract={handleExtractMetadata}
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'downloader' && extractionMetadata && (
              <DownloaderView
                metadata={extractionMetadata}
                onBack={() => setCurrentView('home')}
                onDownload={handleExecuteDownload}
                onAddToQueue={handleAddDownloadToQueue}
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                items={historyItems}
                onDeleteItem={handleDeleteHistoryItem}
                onClearAll={handleClearHistory}
                onRedownload={handleRedownloadItem}
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'faq' && (
              <FaqView
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'terms' && (
              <TermsAndPrivacyView
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'privacy' && (
              <TermsAndPrivacyView
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'contact' && (
              <ContactView
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'api-docs' && (
              <ApiDocsView
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}

            {currentView === 'admin' && (
              <DashboardView
                isDarkMode={isDarkMode}
                t={translate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 6. Mobile Queue Status Bar (when queue has active downloads) */}
      {queueItems.length > 0 && (
        <div className="border-t py-3 px-4 glass border-white/5 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-gray-400">
            <span className="flex items-center space-x-2">
              <FileDown className="w-4 h-4 text-indigo-400 animate-bounce" />
              <span>Active Batch Queue: <strong>{queueItems.filter(q => q.status !== 'completed').length}</strong> remaining</span>
            </span>
            <button
              onClick={() => setCurrentView('history')}
              className="text-indigo-400 hover:underline"
            >
              Monitor Progress
            </button>
          </div>
        </div>
      )}

      {/* 7. Footer navigation block */}
      <Footer onNavigate={setCurrentView} isDarkMode={isDarkMode} t={translate} />

      {/* 8. Toast Portal notifications overlay */}
      <div id="toast-portal" className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-xl flex items-start space-x-3 pointer-events-auto glass border ${
                toast.type === 'success'
                  ? 'border-emerald-500/25 text-emerald-400'
                  : toast.type === 'error'
                    ? 'border-red-500/25 text-red-400'
                    : toast.type === 'warning'
                      ? 'border-amber-500/25 text-amber-400'
                      : 'border-indigo-500/25 text-indigo-400'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <div className="flex-grow text-xs leading-relaxed font-medium">
                {toast.message}
              </div>
              <button
                id={`dismiss-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scroll-to-Top Floating FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50 border border-indigo-500/30' 
                : 'bg-white hover:bg-slate-50 text-indigo-600 shadow-slate-200/50 border border-slate-200'
            }`}
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
