/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelpCircle, ShieldCheck, Download, AlertOctagon, HeartHandshake } from 'lucide-react';

interface FaqViewProps {
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function FaqView({ isDarkMode, t }: FaqViewProps) {
  const categories = [
    {
      title: "Security & Operations",
      icon: ShieldCheck,
      items: [
        {
          q: "Is it legal to download videos using Movanta?",
          a: "Our utility is structured to assist in archiving your own creative posts, public media, and royalty-free educational assets. Downloading copyright-restricted elements without active permission constitutes a policy breach under third-party terms. Maintain copyright integrity."
        },
        {
          q: "Does your server store downloaded files?",
          a: "Absolutely not. The server acts strictly as a secure real-time proxy wrapper, fetching media segments dynamically from official platforms and routing them securely directly to your client memory. We strictly do not persist content databases on our storage."
        }
      ]
    },
    {
      title: "Audio & Formats Packaging",
      icon: Download,
      items: [
        {
          q: "How does the automated MP3 audio extractor perform?",
          a: "If you select an Audio Only format, our Node processor triggers an efficient server-side pipeline to extract standard audio bitrates and wrap them cleanly into standard, metadata-tagged MP3 files, ensuring total client compatibility."
        },
        {
          q: "What if a particular platform link extraction fails?",
          a: "Extraction errors generally relate to age-gated media, regional locks, or temporary rate limits on public platforms. If failures occur, try another public URL, or utilize our batch loader console to retry."
        }
      ]
    }
  ];

  return (
    <div id="faq-view" className="space-y-8 py-4 max-w-4xl mx-auto px-4">
      <div>
        <h1 className="font-sans font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center space-x-2.5">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          <span>{t('faqTitle')}</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Detailed answers regarding security, format wrapping, and download queues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-indigo-500/10 pb-2">
              <cat.icon className="w-5 h-5 text-indigo-500" />
              <h2 className={`font-sans font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{cat.title}</h2>
            </div>

            <div className="space-y-4">
              {cat.items.map((item, qIdx) => (
                <div 
                  key={qIdx} 
                  id={`faq-cat-${idx}-item-${qIdx}`}
                  className="p-5 rounded-3xl glass space-y-2 shadow-sm"
                >
                  <h3 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.q}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
