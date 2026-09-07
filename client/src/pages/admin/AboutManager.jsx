import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import { Compass, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const AboutManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const profile = portfolio?.profile;

  const [aboutText, setAboutText] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (profile?.aboutText) {
      setAboutText(profile.aboutText);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await api.put('/admin/profile', {
        ...profile,
        aboutText,
      });
      if (res.data.success) {
        await refreshPortfolio();
        setStatus({ type: 'success', message: 'About section updated! Public portfolio reflects changes instantly.' });
      } else {
        setStatus({ type: 'error', message: res.data.message || 'Failed to update.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Error saving About content.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-cyan-400" /> About Section Management
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Update your complete professional biography, philosophy, and technical focus area.
        </p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 border ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Detailed Biography & Technical Summary *
          </label>
          <textarea
            rows="10"
            required
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Write your complete professional background, expertise in machine learning, engineering principles..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-y leading-relaxed font-sans"
          />
          <p className="text-[11px] text-slate-500">
            Line breaks will be preserved on the public site layout.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save About Section'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutManager;
