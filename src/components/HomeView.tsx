/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, DragEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Youtube, Facebook, Instagram, Twitter, Video, 
  ArrowRight, ShieldCheck, Zap, Sparkles, FolderDown,
  Lock, KeyRound, HelpCircle, ChevronDown, ChevronUp, ClipboardPaste, Music
} from 'lucide-react';
import { Platform } from '../types';

interface HomeViewProps {
  onExtract: (url: string) => void;
  isDarkMode: boolean;
  t: (key: string) => string;
}

const exampleLinks = [
  { platform: 'youtube', label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { platform: 'instagram', label: 'Instagram Reel', url: 'https://www.instagram.com/reel/C8r84_bOx3A/' },
  { platform: 'tiktok', label: 'TikTok Clip', url: 'https://www.tiktok.com/@khaby.lame/video/7382103450912189701' },
  { platform: 'twitter', label: 'X / Twitter Media', url: 'https://twitter.com/NASA/status/1795123456789123456' },
  { platform: 'facebook', label: 'Facebook Post', url: 'https://www.facebook.com/watch/?v=1024501248924011' }
];

export default function HomeView({ onExtract, isDarkMode, t }: HomeViewProps) {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>('unknown');
  const [isDragOver, setIsDragOver] = useState(false);
  const [clipboardTip, setClipboardTip] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Auto-detect platform when URL changes
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setDetectedPlatform('unknown');
      return;
    }
    const pathname = trimmed.toLowerCase();
    const isDirectMedia = /\.(mp3|mp4|webm|wav|ogg|m4a|mov)$/i.test(pathname);
    
    if (isDirectMedia) {
      const isAudio = pathname.endsWith('mp3') || pathname.endsWith('m4a') || pathname.endsWith('wav') || pathname.endsWith('ogg');
      setDetectedPlatform(isAudio ? 'audio' : 'video');
    } else if (/youtube\.com|youtu\.be/i.test(trimmed)) {
      setDetectedPlatform('youtube');
    } else if (/instagram\.com/i.test(trimmed)) {
      setDetectedPlatform('instagram');
    } else if (/facebook\.com|fb\.watch/i.test(trimmed)) {
      setDetectedPlatform('facebook');
    } else if (/twitter\.com|x\.com/i.test(trimmed)) {
      setDetectedPlatform('twitter');
    } else if (/tiktok\.com/i.test(trimmed)) {
      setDetectedPlatform('tiktok');
    } else if (/^https?:\/\//i.test(trimmed)) {
      setDetectedPlatform('generic');
    } else {
      setDetectedPlatform('unknown');
    }
  }, [url]);

  // Check clipboard buffer on component mount / tab visibility
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        if (!navigator.clipboard || !navigator.clipboard.readText) return;
        const text = await navigator.clipboard.readText();
        if (text && (
          /youtube\.com|youtu\.be|instagram\.com|facebook\.com|fb\.watch|twitter\.com|x\.com|tiktok\.com/i.test(text)
        )) {
          if (text !== url) {
            setClipboardTip(text.trim());
          }
        }
      } catch (e) {
        // Clipboard read permission might be blocked or denied, ignore safely
      }
    };

    checkClipboard();
    window.addEventListener('focus', checkClipboard);
    return () => window.removeEventListener('focus', checkClipboard);
  }, [url]);

  // Handle manual paste button click
  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch (err) {
      // Fallback if permission blocked
      alert('Please allow clipboard permissions or paste manually (Ctrl+V).');
    }
  };

  // Submit URL for processing
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (url.trim()) {
      onExtract(url.trim());
    }
  };

  // Drag & Drop event handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const text = e.dataTransfer.getData('text');
    if (text) {
      setUrl(text);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Get active platform brand icon
  const renderPlatformBadge = () => {
    const iconClass = "w-5 h-5 mr-1.5 transition-transform group-hover:scale-110";
    switch (detectedPlatform) {
      case 'youtube':
        return <span className="inline-flex items-center text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-500/20"><Youtube className={iconClass} />YouTube</span>;
      case 'instagram':
        return <span className="inline-flex items-center text-pink-500 bg-pink-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-pink-500/20"><Instagram className={iconClass} />Instagram</span>;
      case 'facebook':
        return <span className="inline-flex items-center text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-500/20"><Facebook className={iconClass} />Facebook</span>;
      case 'twitter':
        return <span className="inline-flex items-center text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-400/20"><Twitter className={iconClass} />X (Twitter)</span>;
      case 'tiktok':
        return <span className="inline-flex items-center text-teal-400 bg-teal-400/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-teal-400/20"><Video className={iconClass} />TikTok</span>;
      case 'video':
        return <span className="inline-flex items-center text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-indigo-500/20"><Video className={iconClass} />Direct Video Stream</span>;
      case 'audio':
        return <span className="inline-flex items-center text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20"><Music className={iconClass} />Direct Audio File</span>;
      case 'generic':
        return <span className="inline-flex items-center text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-500/20"><Sparkles className={iconClass} />Web Scraper Engine</span>;
      default:
        return null;
    }
  };

  // FAQs content
  const faqs = [
    {
      q: "How secure is the Universal Media Downloader?",
      a: "UMD enforces top-tier server-side protocols. We block Private Network SSRF, filter malicious directory traversals, sanitize outputs, and implement strict sandboxing. No downloads or client requests hit external sites directly, avoiding standard web vulnerabilities."
    },
    {
      q: "What qualities and formats are supported?",
      a: "Our engine parses all streams natively available from the source platform. This includes HD options (1080p, 720p, etc.), standard definitions, and audio-only profiles. If the remote source doesn't supply a standard MP4 or MP3, our server automatically converts the streams seamlessly using native modules."
    },
    {
      q: "Does this downloader require a local client or registration?",
      a: "No registration, subscription, or software client is needed. The platform runs entirely in a standard browser environment (desktop & mobile friendly) with direct full-stack Express REST APIs handling the packaging."
    },
    {
      q: "Are playlist or queue downloads allowed?",
      a: "Yes! You can queue multiple items on our interactive Downloader panel. Each item handles individual polling progress, making batch processing effortless."
    }
  ];

  return (
    <div id="home-view" className="space-y-16 py-8 sm:py-12">
      
      {/* 1. Hero & Downloader Input Area */}
      <section id="hero-section" className="text-center max-w-3xl mx-auto space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/15 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Premium Media Packaging System</span>
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Download Media with <br />
            <span className="gradient-text font-extrabold">
              Supreme Security
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('appSubtitle')}
          </p>
        </motion.div>

        {/* URL Input Box with Drag & Drop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative p-6 rounded-3xl transition-all glass ${
            isDragOver 
              ? 'border-indigo-500 bg-indigo-500/5' 
              : isDarkMode
                ? 'shadow-2xl shadow-black/40' 
                : 'shadow-xl shadow-gray-200/50'
          }`}
        >
          {isDragOver && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-indigo-600/10 rounded-3xl backdrop-blur-sm pointer-events-none">
              <span className="text-indigo-400 font-semibold text-sm">Drop link here to automatically import!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className={`w-full h-14 pl-5 pr-14 rounded-2xl text-sm font-medium outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/50'
                }`}
              />
              <button
                type="button"
                id="paste-helper-btn"
                onClick={handlePasteClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                title={t('pasteBtn')}
              >
                <ClipboardPaste className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              id="extract-submit-btn"
              disabled={!url.trim()}
              className="btn-primary h-14 px-8 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-98"
            >
              <span>{t('downloadBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Floating Platform Detection Badge / Clipboard Helper */}
          <div className="flex flex-wrap items-center justify-between mt-3 px-1 text-xs gap-2">
            <div className="flex items-center min-h-[24px]">
              {renderPlatformBadge()}
            </div>

            {clipboardTip && (
              <button
                type="button"
                id="clipboard-tip-btn"
                onClick={() => {
                  setUrl(clipboardTip);
                  setClipboardTip(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1 animate-pulse"
              >
                <span>Found link in clipboard! Click to insert</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Examples */}
        <div id="quick-examples" className="space-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t('exampleUrls')}</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {exampleLinks.map((ex) => (
              <motion.button
                key={ex.platform}
                id={`example-btn-${ex.platform}`}
                onClick={() => setUrl(ex.url)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800/40 border-white/5 text-gray-300 hover:bg-indigo-900/20 hover:text-indigo-400 shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'
                }`}
              >
                {ex.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Supported Platforms Branding Ribbon */}
      <section id="supported-platforms-ribbon" className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t('supportedPlatforms')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 max-w-4xl mx-auto">
          {[
            { name: 'YouTube', icon: Youtube, color: 'hover:text-red-500 hover:bg-red-500/5', bg: 'text-red-500' },
            { name: 'Instagram', icon: Instagram, color: 'hover:text-pink-500 hover:bg-pink-500/5', bg: 'text-pink-500' },
            { name: 'Facebook', icon: Facebook, color: 'hover:text-blue-500 hover:bg-blue-500/5', bg: 'text-blue-500' },
            { name: 'X / Twitter', icon: Twitter, color: 'hover:text-sky-400 hover:bg-sky-400/5', bg: 'text-sky-400' },
            { name: 'TikTok', icon: Video, color: 'hover:text-teal-400 hover:bg-teal-400/5', bg: 'text-teal-400' },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              id={`platform-card-${item.name.replace(/\s+/g, '').toLowerCase()}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl transition-all cursor-default group glass flex flex-col items-center justify-center space-y-2 hover:border-slate-500/30 ${item.color}`}
            >
              <item.icon className={`w-8 h-8 ${item.bg} transition-transform group-hover:scale-110 duration-300 opacity-70 group-hover:opacity-100`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Elite Features Bento-Grid */}
      <section id="features-bento" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-white">
            {t('featuresTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'SSRF & Injection Armour',
              desc: 'We leverage strict, server-side hostname whitelists and safe IP-lookup logic. Direct remote shell commands are strictly barred, completely sealing shell and SSRF exploits.',
              bg: 'bg-blue-500/10 text-blue-500'
            },
            {
              icon: Zap,
              title: 'Automated Conversion',
              desc: 'Missing compatible container extensions? Our robust server pipeline seamlessly welds decoupled audio and high-resolution video streams on the fly into standards-compliant media files.',
              bg: 'bg-indigo-500/10 text-indigo-500'
            },
            {
              icon: FolderDown,
              title: 'Durable Metadata Presets',
              desc: 'Extract high-definition video thumbnails, fetch localized multi-language closed captions, or tag downloaded audio tracks directly with complete album/author metadata.',
              bg: 'bg-purple-500/10 text-purple-500'
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="p-6 rounded-3xl glass transition-all hover:border-slate-400/30 hover:shadow-md"
            >
              <div className={`p-3 rounded-xl w-fit mb-4 ${feat.bg}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-base text-gray-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. "How It Works" Timeline */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-white">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="relative border-l-2 border-indigo-500/20 ml-4 sm:ml-6 space-y-8">
          {[
            { step: '01', title: 'Paste platform media URL', desc: 'Securely copy any public post from Facebook, TikTok, Instagram, Twitter, or YouTube and input it above.' },
            { step: '02', title: 'Engine extracts metadata', desc: 'Our Express server safely performs secure HTTP handshakes, identifying high-definition video files, audio bitrates, and language titles.' },
            { step: '03', title: 'Instant browser download', desc: 'Select your preferred container or track tag edits, then trigger high-speed downloads cleanly routed through our client gateway.' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              id={`timeline-step-${idx}`} 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative pl-8 sm:pl-10 group"
            >
              <span className={`absolute -left-3.5 top-1.5 flex items-center justify-center w-7 h-7 bg-indigo-600 rounded-full text-white text-xs font-bold ring-4 shadow-md shadow-indigo-500/35 transition-transform duration-300 group-hover:scale-110 ${
                isDarkMode ? 'ring-slate-950' : 'ring-white'
              }`}>
                {item.step}
              </span>
              <h3 className="font-sans font-semibold text-md text-gray-900 dark:text-white transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-400">{item.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. FAQs Area */}
      <section id="faqs" className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-white">
            {t('faqTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('faqSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className="rounded-2xl transition-all overflow-hidden glass shadow-sm hover:border-slate-400/30"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-sans font-semibold text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-100/10 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isOpen && (
                  <div className={`px-5 pb-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400 border-t ${
                    isDarkMode ? 'border-white/5' : 'border-gray-100'
                  }`}>
                    <p className="pt-3 font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
