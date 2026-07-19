/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelpCircle, FileText, Shield, Mail, Terminal, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function Footer({ onNavigate, isDarkMode, t }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      id="app-footer" 
      className="glass border-t py-12 mt-auto transition-all duration-500 text-gray-500 dark:text-gray-400"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Slogan Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <span className="font-sans font-bold tracking-tight text-md gradient-text">
              Movanta
            </span>
            <p className="text-xs leading-relaxed max-w-xs">
              Secure, lightning-fast metadata extraction and offline file packaging for leading media platforms.
            </p>
          </div>

          {/* Quick Legal Links */}
          <div>
            <span className={`text-xs font-semibold tracking-wider uppercase block mb-3.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Legal Resources
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className={`hover:underline flex items-center space-x-1.5 ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('terms')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacy')} 
                  className={`hover:underline flex items-center space-x-1.5 ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('privacy')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Info */}
          <div>
            <span className={`text-xs font-semibold tracking-wider uppercase block mb-3.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Developers
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('api-docs')} 
                  className={`hover:underline flex items-center space-x-1.5 ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{t('apiDocs')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('faq')} 
                  className={`hover:underline flex items-center space-x-1.5 ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t('faqTitle')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contacts & Support */}
          <div>
            <span className={`text-xs font-semibold tracking-wider uppercase block mb-3.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Support
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className={`hover:underline flex items-center space-x-1.5 ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t('contact')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright line */}
        <div className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3 ${
          isDarkMode ? 'border-[#ffffff08]' : 'border-[#00000008]'
        }`}>
          <div className="flex items-center space-x-1.5">
            <span>&copy; {currentYear} Universal Media Downloader. {t('allRightsReserved')}</span>
          </div>
          <div className="flex items-center space-x-3.5">
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
              <span>for quality</span>
            </span>
            <span className="text-gray-400 dark:text-gray-600">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
