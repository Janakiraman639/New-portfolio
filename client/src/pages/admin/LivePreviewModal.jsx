import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor, RefreshCw, ExternalLink } from 'lucide-react';

const LivePreviewModal = ({ isOpen, onClose }) => {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [key, setKey] = useState(Date.now());

  if (!isOpen) return null;

  const handleRefresh = () => {
    setKey(Date.now());
  };

  const getViewportWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[850px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full h-full max-w-7xl flex flex-col bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="font-extrabold text-white text-sm">Live Portfolio Preview</h3>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">(Real-time database data)</span>
          </div>

          {/* Viewport Selector Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                device === 'desktop' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                device === 'tablet' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" /> Tablet
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                device === 'mobile' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1"
              title="Refresh Preview"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1 hidden sm:flex"
            >
              <ExternalLink className="w-4 h-4" /> Open Full Tab
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-auto">
          <div
            className={`transition-all duration-300 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-950 ${getViewportWidth()}`}
          >
            <iframe
              key={key}
              src="/"
              title="Portfolio Live Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LivePreviewModal;
