/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Terminal, Copy, Check, PlayCircle } from 'lucide-react';

interface ApiDocsViewProps {
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function ApiDocsView({ isDarkMode, t }: ApiDocsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/extract',
      desc: 'Analyze public link and extract formats metadata safely.',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' }, null, 2),
      response: JSON.stringify({
        status: 'success',
        metadata: {
          url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
          platform: 'youtube',
          title: 'Never Gonna Give You Up',
          uploader: 'Rick Astley',
          duration: 212,
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
          formats: [
            { id: 'mp4-1080p', resolution: '1080p', quality: '1080p HD', sizeFormatted: '45.2 MB' }
          ]
        }
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/api/v1/download',
      desc: 'Stream requested quality package with real-time browser download trigger.',
      query: {
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4-1080p'
      },
      response: 'Binary Stream (video/mp4 container attached with Content-Disposition headers)'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="api-docs-view" className="space-y-8 py-4 max-w-4xl mx-auto px-4">
      <div>
        <h1 className="font-sans font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center space-x-2.5">
          <Terminal className="w-6 h-6 text-indigo-500" />
          <span>API Documentation</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Versioned secure REST endpoints for multi-platform metadata lookups.</p>
      </div>

      <div className="space-y-8">
        {endpoints.map((ep, idx) => (
          <div 
            key={idx}
            id={`api-endpoint-${idx}`}
            className="p-6 rounded-3xl glass space-y-4 shadow-sm"
          >
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-white ${
                ep.method === 'POST' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {ep.method}
              </span>
              <code className={`text-xs font-mono font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                {ep.path}
              </code>
              <span className="text-xs text-gray-400">{ep.desc}</span>
            </div>

            {/* Request block */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-gray-400 block tracking-wider">Example Payload</span>
              <div className="relative">
                <pre className={`p-4 rounded-2xl font-mono text-[11px] overflow-x-auto ${
                  isDarkMode ? 'bg-slate-900/60 text-gray-300 border border-white/5' : 'bg-slate-50 text-gray-800 border border-slate-200/55'
                }`}>
                  {ep.body || `Query Parameters:\n${JSON.stringify(ep.query, null, 2)}`}
                </pre>
                <button
                  id={`copy-api-body-${idx}`}
                  onClick={() => handleCopy(ep.body || JSON.stringify(ep.query), `body-${idx}`)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-white"
                >
                  {copiedId === `body-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Response block */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-gray-400 block tracking-wider">Expected Response</span>
              <div className="relative">
                <pre className={`p-4 rounded-2xl font-mono text-[11px] overflow-x-auto ${
                  isDarkMode ? 'bg-slate-900/40 text-gray-400 border border-white/5' : 'bg-slate-50 text-gray-700 border border-slate-200/55'
                }`}>
                  {ep.response}
                </pre>
                <button
                  id={`copy-api-res-${idx}`}
                  onClick={() => handleCopy(ep.response, `res-${idx}`)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-white"
                >
                  {copiedId === `res-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
