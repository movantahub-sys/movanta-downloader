/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  History, Search, Trash2, Calendar, FileDown,
  TrendingUp, BarChart2, CheckCircle2, AlertTriangle, Play,
  Youtube, Instagram, Facebook, Twitter, Video
} from 'lucide-react';
import { HistoryItem, Platform } from '../types';

interface HistoryViewProps {
  items: HistoryItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onRedownload: (item: HistoryItem) => void;
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function HistoryView({
  items,
  onDeleteItem,
  onClearAll,
  onRedownload,
  isDarkMode,
  t
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.quality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  // Calculate statistics
  const totalDownloads = items.length;
  const completedCount = items.filter(i => i.status === 'completed').length;
  const successRate = totalDownloads > 0 ? Math.round((completedCount / totalDownloads) * 100) : 100;
  
  // Platform counts
  const platformStats = items.reduce((acc, curr) => {
    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
    return acc;
  }, {} as Record<Platform, number>);

  return (
    <div id="history-view" className="space-y-8 py-4 max-w-6xl mx-auto px-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center space-x-2.5">
            <History className="w-6 h-6 text-indigo-500" />
            <span>{t('history')}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage and access your locally cached media downloads.</p>
        </div>

        {items.length > 0 && (
          <button
            id="clear-all-history-btn"
            onClick={onClearAll}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isDarkMode 
                ? 'border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10' 
                : 'border-red-200 bg-red-50 hover:bg-red-100 text-red-600'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearHistory')}</span>
          </button>
        )}
      </div>

      {/* Analytics Bento Widget */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-3xl glass flex items-center space-x-4 shadow-sm">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Total Packaged</span>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalDownloads} items</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl glass flex items-center space-x-4 shadow-sm">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Delivery Rate</span>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{successRate}% Success</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl glass flex items-center space-x-4 shadow-sm">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Top Platform</span>
              <span className={`text-lg font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {Object.keys(platformStats).length > 0 
                  ? Object.entries(platformStats).sort((a,b) => b[1] - a[1])[0][0]
                  : 'None'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl glass flex flex-col md:flex-row items-center gap-4 transition-all shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            id="history-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchHistory')}
            className={`w-full h-11 pl-10 pr-4 rounded-xl text-xs font-medium outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-900/60 text-white border border-white/10 focus:ring-2 focus:ring-indigo-500/50' 
                : 'bg-white text-gray-900 border border-slate-200 focus:ring-2 focus:ring-indigo-500/50'
            }`}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Platform filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'youtube', 'instagram', 'facebook', 'twitter', 'tiktok'].map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                platformFilter === plat
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : isDarkMode
                    ? 'border-white/5 bg-slate-900/40 hover:bg-slate-900/80 text-gray-300'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-gray-600'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`history-card-${item.id}`}
            className="p-4 rounded-3xl glass flex items-center space-x-4 transition-all hover:border-slate-500/30 hover:shadow-md"
          >
            {/* Aspect box thumbnail */}
            <div className="relative w-24 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-1 left-1 p-1 rounded bg-black/60 text-white`}>
                {item.platform === 'youtube' && <Youtube className="w-3 h-3 text-red-500" />}
                {item.platform === 'instagram' && <Instagram className="w-3 h-3 text-pink-500" />}
                {item.platform === 'facebook' && <Facebook className="w-3 h-3 text-blue-500" />}
                {item.platform === 'twitter' && <Twitter className="w-3 h-3 text-sky-400" />}
                {item.platform === 'tiktok' && <Video className="w-3 h-3 text-teal-400" />}
              </span>
            </div>

            {/* Information */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h3 className={`text-xs font-semibold leading-snug truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                <span>{item.quality}</span>
                <span>•</span>
                <span>{item.sizeFormatted}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[9px] text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{item.timestamp}</span>
              </div>
            </div>

            {/* Actions (Re-download or delete) */}
            <div className="flex flex-col items-center space-y-1.5 shrink-0">
              <button
                id={`redownload-item-${item.id}`}
                onClick={() => onRedownload(item)}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode ? 'hover:bg-[#ffffff05] text-indigo-400' : 'hover:bg-gray-50 text-indigo-600'
                }`}
                title="Redownload"
              >
                <Play className="w-4 h-4" />
              </button>

              <button
                id={`delete-history-item-${item.id}`}
                onClick={() => onDeleteItem(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode ? 'hover:bg-[#ffffff05] text-red-400' : 'hover:bg-gray-50 text-red-500'
                }`}
                title="Delete from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-16 border rounded-2xl border-dashed border-[#ffffff08] space-y-3">
            <History className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-xs font-semibold text-gray-400">{t('noHistory')}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
