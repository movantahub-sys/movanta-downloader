/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BarChart4, Activity, Users, Database, Layers,
  TrendingUp, RefreshCw, Server, AlertOctagon, Terminal
} from 'lucide-react';
import { AdminStats, Platform } from '../types';

interface DashboardViewProps {
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function DashboardView({ isDarkMode, t }: DashboardViewProps) {
  const [stats, setStats] = useState<AdminStats>({
    downloadCount: 1420,
    popularPlatforms: {
      youtube: 840,
      instagram: 310,
      facebook: 120,
      twitter: 90,
      tiktok: 60,
      unknown: 0
    },
    popularFormats: {
      'MP4 (1080p)': 680,
      'MP3 (320kbps)': 410,
      'MP4 (720p)': 210,
      'M4A (Audio)': 120
    },
    successRate: 98.6,
    failureRate: 1.4,
    averageDownloadSizeMB: 28.4,
    activeQueueLength: 0,
    cacheHits: 482,
    systemLoad: {
      cpu: 18,
      memory: 42,
      disk: 24
    }
  });

  const [activeLogs, setActiveLogs] = useState<Array<{ time: string; action: string; status: 'success' | 'warn' | 'error' }>>([
    { time: '10:25:52', action: 'Handshake with instagr.am media edge', status: 'success' },
    { time: '10:25:01', action: 'Compile segmented hls payload (Rickroll Video)', status: 'success' },
    { time: '10:24:18', action: 'Prune cached streams directory (safe sweep)', status: 'success' },
    { time: '10:22:40', action: 'Failed extraction for custom link (Malicious shell blocked)', status: 'warn' },
  ]);

  // Simulate updating load logs
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        systemLoad: {
          cpu: Math.max(8, Math.min(85, prev.systemLoad.cpu + Math.floor(Math.random() * 11) - 5)),
          memory: Math.max(30, Math.min(65, prev.systemLoad.memory + Math.floor(Math.random() * 3) - 1)),
          disk: prev.systemLoad.disk
        }
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="admin-dashboard-view" className="space-y-8 py-4 max-w-6xl mx-auto px-4">
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center space-x-2.5">
            <BarChart4 className="w-6 h-6 text-indigo-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Live metrics, queue levels, safe directory sizes, and system logs.</p>
        </div>

        <button
          onClick={() => {
            // Trigger refresh
            setActiveLogs(prev => [
              { time: new Date().toLocaleTimeString(), action: 'Interactive admin stats refreshed manually', status: 'success' },
              ...prev.slice(0, 3)
            ]);
          }}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            isDarkMode 
              ? 'border-[#ffffff08] bg-[#181a26]/40 text-indigo-400 hover:bg-[#181a26]' 
              : 'border-gray-200 bg-white hover:bg-gray-50 text-indigo-600'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Grid of Bento widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Downloads */}
        <div className="p-5 rounded-3xl glass flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Total Downloads</span>
            <span className={`text-xl font-extrabold block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.downloadCount}</span>
          </div>
          <Activity className="w-8 h-8 text-indigo-500/30" />
        </div>

        {/* KPI: Success rate */}
        <div className="p-5 rounded-3xl glass flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Success Rate</span>
            <span className={`text-xl font-extrabold block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.successRate}%</span>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500/30" />
        </div>

        {/* KPI: Cache size */}
        <div className="p-5 rounded-3xl glass flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Cache Hits</span>
            <span className={`text-xl font-extrabold block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.cacheHits} saves</span>
          </div>
          <Database className="w-8 h-8 text-blue-500/30" />
        </div>

        {/* KPI: Active queues */}
        <div className="p-5 rounded-3xl glass flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Active Queues</span>
            <span className={`text-xl font-extrabold block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.activeQueueLength} items</span>
          </div>
          <Layers className="w-8 h-8 text-purple-500/30" />
        </div>
      </div>

      {/* Infrastructure load + Logs console split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: System Hardware Load (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass space-y-6 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-[#ffffff05] pb-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <h2 className={`font-sans font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Resource Metrics</h2>
          </div>

          <div className="space-y-4">
            {/* CPU */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>CPU Load</span>
                <span className="font-mono text-indigo-400">{stats.systemLoad.cpu}%</span>
              </div>
              <div className="h-2 bg-[#ffffff08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.systemLoad.cpu}%` }}
                />
              </div>
            </div>

            {/* RAM */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Memory Utilization</span>
                <span className="font-mono text-blue-400">{stats.systemLoad.memory}%</span>
              </div>
              <div className="h-2 bg-[#ffffff08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.systemLoad.memory}%` }}
                />
              </div>
            </div>

            {/* Storage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Sandbox Storage (Temporary)</span>
                <span className="font-mono text-purple-400">{stats.systemLoad.disk}%</span>
              </div>
              <div className="h-2 bg-[#ffffff08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all" 
                  style={{ width: `${stats.systemLoad.disk}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Safe Operations Log Stream (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#ffffff05] pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <h2 className={`font-sans font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Event Audit Logs</h2>
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
              Secure
            </span>
          </div>

          <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
            {activeLogs.map((log, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-start space-x-3 text-[10px] font-mono leading-relaxed transition-all ${
                  log.status === 'warn'
                    ? isDarkMode ? 'bg-amber-500/5 border-amber-500/10 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
                    : isDarkMode ? 'bg-slate-900/40 border-white/5 text-gray-300' : 'bg-slate-50/50 border-slate-200 text-gray-600'
                }`}
              >
                <span className="text-gray-500 select-none shrink-0">[{log.time}]</span>
                <div className="flex-1 min-w-0">
                  <span className="block truncate font-semibold">{log.action}</span>
                  <span className="text-[9px] text-gray-500 font-sans block mt-0.5">
                    {log.status === 'warn' ? 'Alert Triggered: Blocked access request' : 'Handshake success'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
