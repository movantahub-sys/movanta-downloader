/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, FileText, Lock, Globe } from 'lucide-react';

interface TermsAndPrivacyViewProps {
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function TermsAndPrivacyView({ isDarkMode, t }: TermsAndPrivacyViewProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div id="terms-privacy-view" className="space-y-8 py-4 max-w-4xl mx-auto px-4">
      {/* Tab Selectors */}
      <div className="flex border-b border-[#ffffff08] pb-1 gap-2.5">
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'terms'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'privacy'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Policy</span>
        </button>
      </div>

      {activeTab === 'terms' ? (
        <div id="terms-content" className="p-6 rounded-3xl glass space-y-4 leading-relaxed text-xs text-gray-400 shadow-sm">
          <h2 className={`font-sans font-bold text-md mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Movanta - Terms of Service
          </h2>
          <p>
            By using Movanta, you acknowledge that you agree to all structural guidelines specified in this document. Movanta acts solely as a technical, server-side metadata parser.
          </p>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>1. Authorized Use</h3>
          <p>
            You are permitted to query metadata and package audio/video streams for which you own the copyrights, or for public-domain elements that carry open redistribution credentials. Any unauthorized use is strictly forbidden.
          </p>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>2. API Restrictions</h3>
          <p>
            Rate limits and payload filters are strictly enforced. Standard automated bot queries or bulk scraping flows targeting our Express endpoints constitute a terms breach, resulting in automatic IP blockade.
          </p>
          <p className="text-[10px] text-gray-500 pt-4 border-t border-[#ffffff05]">
            Last updated: July 2026. Movanta reserves the right to modify these operational guidelines.
          </p>
        </div>
      ) : (
        <div id="privacy-content" className="p-6 rounded-3xl glass space-y-4 leading-relaxed text-xs text-gray-400 shadow-sm">
          <h2 className={`font-sans font-bold text-md mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Movanta - Privacy Policy
          </h2>
          <p>
            At Movanta, user security and privacy are of utmost importance. This document details how we handle metadata lookups.
          </p>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>1. No Media Logs</h3>
          <p>
            Our backend router operates as a transient streaming gateway. The server buffers the platform chunks in CPU memory and streams them instantly to the client browser. No local media recordings are maintained.
          </p>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>2. Safe Storage</h3>
          <p>
            The &quot;History&quot; segment stores your download records purely in the local storage of your web browser. Absolutely no history elements are exported or synchronized to remote monitoring servers.
          </p>
          <p className="text-[10px] text-gray-500 pt-4 border-t border-[#ffffff05]">
            Last updated: July 2026. Operating strictly under safe, privacy-first sandboxed protocols.
          </p>
        </div>
      )}
    </div>
  );
}
