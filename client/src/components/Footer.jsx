import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import DynamicIcon from './DynamicIcon';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const { portfolio } = usePortfolio();
  const profile = portfolio?.profile;
  const socialLinks = portfolio?.socialLinks || [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-semibold text-slate-200 text-base">
            {profile?.name || 'Janakiraman'}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            {profile?.title || 'AI & Machine Learning Engineer'}
          </p>
        </div>

        {/* Dynamic Social Links */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-800"
              title={social.platform}
            >
              <DynamicIcon name={social.icon || social.platform} className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Copyright & Scroll Top */}
        <div className="flex items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} {profile?.name || 'Developer'}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors border border-slate-800"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
