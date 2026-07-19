/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Youtube, Facebook, Instagram, Twitter, Video, ArrowLeft,
  Download, Copy, Share2, QrCode, ClipboardPaste, ListMusic,
  Scissors, Tag, Check, ArrowRight, Loader2, FileDown,
  Play, Pause, Volume2, VolumeX, X
} from 'lucide-react';
import { MediaMetadata, MediaFormat, Platform } from '../types';

interface DownloaderViewProps {
  metadata: MediaMetadata;
  onBack: () => void;
  onDownload: (format: MediaFormat, options: DownloadOptions) => void;
  onAddToQueue: (options: DownloadOptions) => void;
  isDarkMode: boolean;
  t: (key: string) => string;
}

export interface DownloadOptions {
  includeSubtitles: boolean;
  includeThumbnail: boolean;
  customMetadata: {
    title: string;
    artist: string;
    album: string;
  };
  trim: {
    enabled: boolean;
    start: number;
    end: number;
  };
  qualityRecommendation: 'best' | 'compressed' | 'lowest';
}

export default function DownloaderView({
  metadata,
  onBack,
  onDownload,
  onAddToQueue,
  isDarkMode,
  t
}: DownloaderViewProps) {
  // Active states
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat>(metadata.formats[0]);
  const [formatTypeFilter, setFormatTypeFilter] = useState<'both' | 'video' | 'audio'>('both');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [tempLink, setTempLink] = useState<string | null>(null);
  
  // Media Preview Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Parse YouTube video ID helper
  const getYoutubeId = (urlStr: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYoutubeId(metadata.url);
  const isDirectVideo = /\.(mp4|webm|mov|ogg)$/i.test(metadata.url);
  const isDirectAudio = /\.(mp3|wav|ogg|m4a)$/i.test(metadata.url);

  // Subtitle / metadata / trim states
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [includeThumbnail, setIncludeThumbnail] = useState(false);
  const [customTitle, setCustomTitle] = useState(metadata.title);
  const [customArtist, setCustomArtist] = useState(metadata.uploader);
  const [customAlbum, setCustomAlbum] = useState('Universal Downloads');
  const [enableTrim, setEnableTrim] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(metadata.duration);

  // Connection speed based quality recommendation
  const [networkSpeed, setNetworkSpeed] = useState<number | null>(null);

  // Trigger network speed estimation
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      const conn = (navigator as any).connection;
      if (conn.downlink) {
        setNetworkSpeed(conn.downlink); // in Mbps
      }
    }
  }, []);

  // Filter formats based on selected type
  const filteredFormats = metadata.formats.filter(f => {
    if (formatTypeFilter === 'video') return f.isVideoOnly;
    if (formatTypeFilter === 'audio') return f.isAudioOnly;
    return !f.isAudioOnly && !f.isVideoOnly; // Both video + audio
  });

  const getPlatformIcon = (platform: Platform) => {
    const classes = "w-5 h-5";
    switch (platform) {
      case 'youtube': return <Youtube className={`${classes} text-red-500`} />;
      case 'instagram': return <Instagram className={`${classes} text-pink-500`} />;
      case 'facebook': return <Facebook className={`${classes} text-blue-500`} />;
      case 'twitter': return <Twitter className={`${classes} text-sky-400`} />;
      case 'tiktok': return <Video className={`${classes} text-teal-400`} />;
      default: return null;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(metadata.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGenerateTempLink = () => {
    // Generate a temporary signed-looking download URL
    const token = Math.random().toString(36).substring(2, 15);
    const exp = Date.now() + 1000 * 60 * 15; // 15 mins expiry
    const fullTempUrl = `${window.location.origin}/api/v1/download/temp?token=${token}&exp=${exp}&url=${encodeURIComponent(metadata.url)}&format=${selectedFormat.id}`;
    setTempLink(fullTempUrl);
  };

  const handleDownloadTrigger = () => {
    const options: DownloadOptions = {
      includeSubtitles,
      includeThumbnail,
      customMetadata: {
        title: customTitle,
        artist: customArtist,
        album: customAlbum
      },
      trim: {
        enabled: enableTrim,
        start: Number(trimStart),
        end: Number(trimEnd)
      },
      qualityRecommendation: networkSpeed && networkSpeed < 5 ? 'compressed' : 'best'
    };
    onDownload(selectedFormat, options);
  };

  const handleQueueTrigger = () => {
    const options: DownloadOptions = {
      includeSubtitles,
      includeThumbnail,
      customMetadata: {
        title: customTitle,
        artist: customArtist,
        album: customAlbum
      },
      trim: {
        enabled: enableTrim,
        start: Number(trimStart),
        end: Number(trimEnd)
      },
      qualityRecommendation: 'best'
    };
    onAddToQueue(options);
  };

  return (
    <div id="downloader-view" className="space-y-8 py-4 max-w-6xl mx-auto px-4">
      {/* Back Button and Page Header */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-home-btn"
          onClick={onBack}
          className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            isDarkMode 
              ? 'border-[#ffffff10] bg-[#121420]/60 hover:bg-[#ffffff08] text-gray-300' 
              : 'border-[#00000008] bg-white hover:bg-gray-50 text-gray-600 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHome')}</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <span className="text-xs text-gray-400">Platform detected:</span>
          <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isDarkMode ? 'bg-[#ffffff05] border-[#ffffff08]' : 'bg-gray-50 border-[#00000005]'
          }`}>
            {getPlatformIcon(metadata.platform)}
            <span className="capitalize ml-1">{metadata.platform}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Panel (Thumbnail & Meta), Right Panel (Formats & Config) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: 5 columns */}
        <div className="lg:col-span-5 space-y-6">
          {/* Glass Card for Media Preview */}
          <div className="rounded-3xl glass overflow-hidden shadow-xl border border-white/5">
            <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center group">
              {isPlaying ? (
                <>
                  {ytId ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}`} 
                      className="w-full h-full border-0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  ) : isDirectVideo ? (
                    <video 
                      src={metadata.url} 
                      controls 
                      autoPlay 
                      muted={isMuted}
                      className="w-full h-full object-contain" 
                    />
                  ) : isDirectAudio ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900/90 space-y-4">
                      {/* Audio visualizer spectrum bars */}
                      <div className="flex items-end justify-center gap-1.5 h-12">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: [10, Math.random() * 32 + 10, 10]
                            }}
                            transition={{
                              duration: 0.8 + (i % 3) * 0.18,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-1.5 bg-indigo-500 rounded-full"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 font-medium font-mono text-center">Streaming Audio Preview</p>
                      <audio 
                        src={metadata.url} 
                        controls 
                        autoPlay 
                        muted={isMuted}
                        className="w-full max-w-[90%] h-8 mt-2" 
                      />
                    </div>
                  ) : (
                    /* Fallback beautifully styled sample player with spectrum visualizer */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900/95 space-y-4 relative">
                      <div className="flex items-end justify-center gap-1.5 h-16">
                        {[...Array(18)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: [12, Math.random() * 52 + 12, 12]
                            }}
                            transition={{
                              duration: 0.6 + (i % 4) * 0.14,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
                          />
                        ))}
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Simulated Preview Stream</p>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Playing secure virtual media packet for validation</p>
                      </div>
                      {/* Custom control bar */}
                      <div className="flex items-center space-x-4 pt-1">
                        <button 
                          onClick={() => setIsMuted(!isMuted)} 
                          className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Close Player Overlay Button */}
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all cursor-pointer border border-white/10"
                    title="Stop playback"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={metadata.thumbnail}
                    alt={metadata.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  {/* Beautiful Glowing Pulsing Play FAB overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40">
                    <motion.button
                      id="play-media-preview-btn"
                      onClick={() => setIsPlaying(true)}
                      whileHover={{ scale: 1.15, boxShadow: "0 0 25px rgba(99, 102, 241, 0.7)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/35 cursor-pointer border border-indigo-400/35 transition-all"
                      title="Play Preview"
                    >
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </motion.button>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-1 rounded text-[10px] font-semibold text-white font-mono tracking-tight">
                    {metadata.durationFormatted}
                  </span>
                </>
              )}
            </div>

            {/* Video Meta Info */}
            <div className="p-5 space-y-4">
              <h2 className={`font-sans font-semibold text-md leading-snug tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {metadata.title}
              </h2>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>By: <strong className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>{metadata.uploader}</strong></span>
                <span>{t('publishDate')}: <strong className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>{metadata.publishDate}</strong></span>
              </div>

              {metadata.views && (
                <div className="text-[11px] text-gray-400">
                  <span>{metadata.viewsFormatted} {t('views')}</span>
                </div>
              )}

              {/* Collapsible description */}
              <div className="border-t border-[#ffffff05] pt-3">
                <p className={`text-[11px] leading-relaxed line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metadata.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Sharing & Transfer options */}
          <div className="p-5 rounded-3xl glass space-y-4 shadow-sm">
            <span className={`text-xs font-semibold uppercase tracking-wider block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Media Actions
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="copy-source-url"
                onClick={handleCopyLink}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                  isDarkMode 
                    ? 'border-[#ffffff08] hover:bg-[#ffffff05] text-gray-300' 
                    : 'border-gray-200 hover:bg-white text-gray-600 shadow-sm'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? t('copied') : t('shareBtn')}</span>
              </button>

              <button
                id="show-qr-code-btn"
                onClick={() => {
                  setShowQrCode(!showQrCode);
                  if (!tempLink) handleGenerateTempLink();
                }}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all ${
                  isDarkMode 
                    ? 'border-[#ffffff08] hover:bg-[#ffffff05] text-gray-300' 
                    : 'border-gray-200 hover:bg-white text-gray-600 shadow-sm'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Mobile Scan</span>
              </button>
            </div>

            {showQrCode && tempLink && (
              <div className="text-center p-4 border border-dashed rounded-xl border-indigo-500/20 bg-indigo-500/5 space-y-3">
                <div className="flex justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(tempLink)}`}
                    alt="QR Code"
                    className="rounded-lg shadow-md border border-white"
                  />
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal max-w-[200px] mx-auto">
                  Scan code with a mobile camera to instantly download the media package directly onto your phone.
                </p>
                <button
                  id="temp-link-copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(tempLink);
                    alert('Temporary link copied!');
                  }}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline block mx-auto font-medium"
                >
                  Copy Temp URL (15m expiry)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: 7 columns (Formats and Configuration) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Formats Selection */}
          <div className="p-6 rounded-3xl glass space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#ffffff05] pb-4">
              <h3 className={`font-sans font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('formatSelector')}
              </h3>

              {/* Quality Filters (Video + Audio, Video Only, Audio Only) */}
              <div className={`p-1 rounded-xl border flex ${
                isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-slate-100 border-slate-200/60'
              }`}>
                <button
                  onClick={() => { setFormatTypeFilter('both'); setSelectedFormat(metadata.formats.find(f => !f.isAudioOnly && !f.isVideoOnly) || metadata.formats[0]); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    formatTypeFilter === 'both'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {t('videoAudio')}
                </button>
                <button
                  onClick={() => { setFormatTypeFilter('video'); setSelectedFormat(metadata.formats.find(f => f.isVideoOnly) || metadata.formats[0]); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    formatTypeFilter === 'video'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {t('videoOnly')}
                </button>
                <button
                  onClick={() => { setFormatTypeFilter('audio'); setSelectedFormat(metadata.formats.find(f => f.isAudioOnly) || metadata.formats[0]); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    formatTypeFilter === 'audio'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {t('audioOnly')}
                </button>
              </div>
            </div>

            {/* Quality list */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredFormats.map((format) => {
                const isSelected = selectedFormat.id === format.id;
                return (
                  <button
                    key={format.id}
                    id={`format-card-${format.id}`}
                    onClick={() => setSelectedFormat(format)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : isDarkMode
                          ? 'border-white/5 bg-slate-900/30 hover:border-white/10 hover:bg-slate-900/50'
                          : 'border-slate-200/55 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {format.quality} ({format.resolution})
                        </span>
                        {format.hdr && (
                          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                            HDR
                          </span>
                        )}
                        {networkSpeed && networkSpeed < 5 && isSelected && (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold">
                            Slow Network: Use lower res!
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">
                        Container: {format.container} | Codec: {format.codec} | Audio: {format.audioCodec}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5 font-mono">
                      <span className={`text-xs font-semibold block ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {format.sizeFormatted}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        Est. Time: {format.estimatedTimeSec}s
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredFormats.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-500">
                  No formats found for this filter.
                </div>
              )}
            </div>
          </div>

          {/* Advanced Configurations Tab: Metadata tagger and Trimming tool */}
          <div className="p-6 rounded-3xl glass space-y-6 shadow-sm">
            <h3 className={`font-sans font-semibold text-sm border-b border-[#ffffff05] pb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Download Options & Presets
            </h3>

            {/* Standard Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSubtitles}
                  onChange={() => setIncludeSubtitles(!includeSubtitles)}
                  className="rounded border-[#ffffff10] text-blue-600 focus:ring-blue-500/20 w-4 h-4"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{t('subtitles')}</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeThumbnail}
                  onChange={() => setIncludeThumbnail(!includeThumbnail)}
                  className="rounded border-[#ffffff10] text-blue-600 focus:ring-blue-500/20 w-4 h-4"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{t('thumbnailOnly')}</span>
              </label>
            </div>

            {/* Trimming Panel */}
            <div className="border border-dashed border-[#ffffff08] rounded-xl p-4 space-y-3.5 bg-[#ffffff02]">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTrim}
                    onChange={() => setEnableTrim(!enableTrim)}
                    className="rounded border-[#ffffff10] text-blue-600 w-4 h-4"
                  />
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('trimVideo')}
                  </span>
                </label>
                <Scissors className={`w-4 h-4 ${enableTrim ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>

              {enableTrim && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">{t('startSec')}</span>
                    <input
                      type="number"
                      value={trimStart}
                      onChange={(e) => setTrimStart(Math.max(0, Number(e.target.value)))}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none ${
                        isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">{t('endSec')}</span>
                    <input
                      type="number"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Math.min(metadata.duration, Number(e.target.value)))}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none ${
                        isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Tags Editor (especially for Audio quality formats) */}
            {selectedFormat.isAudioOnly && (
              <div className="border border-dashed border-[#ffffff08] rounded-xl p-4 space-y-3.5 bg-[#ffffff02]">
                <div className="flex items-center justify-between border-b border-[#ffffff05] pb-2">
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('editMetadata')}
                  </span>
                  <Tag className="w-4 h-4 text-indigo-400" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">{t('titleLabel')}</span>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className={`w-full p-2.5 rounded-xl outline-none ${
                        isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">{t('artistLabel')}</span>
                    <input
                      type="text"
                      value={customArtist}
                      onChange={(e) => setCustomArtist(e.target.value)}
                      className={`w-full p-2.5 rounded-xl outline-none ${
                        isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block">{t('albumLabel')}</span>
                    <input
                      type="text"
                      value={customAlbum}
                      onChange={(e) => setCustomAlbum(e.target.value)}
                      className={`w-full p-2.5 rounded-xl outline-none ${
                        isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons: Download, Queue */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="queue-download-trigger"
                onClick={handleQueueTrigger}
                className={`flex-1 h-12 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5 border ${
                  isDarkMode
                    ? 'border-white/5 bg-slate-900/30 hover:bg-slate-900/60 text-slate-300'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <ListMusic className="w-4 h-4" />
                <span>{t('queueBtn')}</span>
              </button>

              <button
                id="active-download-trigger"
                onClick={handleDownloadTrigger}
                className="flex-1 h-12 rounded-xl btn-primary text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>{t('downloadBtn')}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
