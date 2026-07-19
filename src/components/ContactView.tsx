/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactViewProps {
  isDarkMode: boolean;
  t: (key: string) => string;
}

export default function ContactView({ isDarkMode, t }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div id="contact-view" className="space-y-8 py-4 max-w-xl mx-auto px-4">
      <div className="text-center">
        <h1 className="font-sans font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center justify-center space-x-2.5">
          <Mail className="w-6 h-6 text-indigo-500" />
          <span>{t('contactTitle')}</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">{t('contactSubtitle')}</p>
      </div>

      {submitted ? (
        <div id="contact-success" className="p-6 rounded-3xl glass border border-green-500/20 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className={`font-sans font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('messageSent')}
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Our technical support team reviews all inquiries within 24 hours. Keep an eye on your inbox!
          </p>
          <button
            id="new-inquiry-btn"
            onClick={() => {
              setSubmitted(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form 
          id="contact-form" 
          onSubmit={handleSubmit} 
          className="p-6 rounded-3xl glass space-y-4 shadow-sm"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">{t('nameInput')} *</span>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className={`w-full p-2.5 rounded-xl text-xs outline-none ${
                isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">{t('emailInput')} *</span>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@company.com"
              className={`w-full p-2.5 rounded-xl text-xs outline-none ${
                isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">Inquiry Type</span>
            <select
              id="contact-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2.5 rounded-xl text-xs outline-none ${
                isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
              }`}
            >
              <option value="technical">Technical Support</option>
              <option value="legal">DMCA / Copyright</option>
              <option value="api">API Licensing</option>
              <option value="abuse">Report Abuse</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">{t('messageInput')} *</span>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query in detail..."
              className={`w-full p-2.5 rounded-xl text-xs outline-none ${
                isDarkMode ? 'bg-slate-900/60 text-white border border-white/10' : 'bg-white text-gray-900 border border-slate-200'
              }`}
            />
          </div>

          <button
            id="contact-submit"
            type="submit"
            className="w-full h-11 btn-primary text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t('sendBtn')}</span>
          </button>
        </form>
      )}
    </div>
  );
}
