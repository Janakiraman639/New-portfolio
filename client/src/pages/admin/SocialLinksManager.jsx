import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import DynamicIcon from '../../components/DynamicIcon';
import { Share2, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';

const SocialLinksManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const socialLinks = portfolio?.socialLinks || [];

  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    platform: '',
    url: '',
    icon: 'Github',
    order: 0,
  });

  const handleOpenModal = (mode, link = null) => {
    setModal({ open: true, mode, data: link });
    if (mode === 'edit' && link) {
      setForm({
        platform: link.platform || '',
        url: link.url || '',
        icon: link.icon || 'Github',
        order: link.order || 0,
      });
    } else {
      setForm({
        platform: '',
        url: '',
        icon: 'Github',
        order: socialLinks.length + 1,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (modal.mode === 'create') {
        await api.post('/admin/social-links', form);
      } else {
        await api.put(`/admin/social-links/${modal.data.id}`, form);
      }
      await refreshPortfolio();
      setModal({ open: false, mode: 'create', data: null });
      setStatus({ type: 'success', message: 'Social link saved!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save link.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete social link?')) return;
    try {
      await api.delete(`/admin/social-links/${id}`);
      await refreshPortfolio();
      setStatus({ type: 'success', message: 'Social link deleted!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete.' });
    }
  };

  const iconOptions = ['Github', 'Linkedin', 'Twitter', 'Globe', 'Mail', 'Code2', 'Cpu', 'Layers'];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-cyan-400" /> Social Links Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage your GitHub, LinkedIn, Twitter/X, Kaggle, and personal profile links.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Social Link
        </button>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {socialLinks.map((social) => (
          <div key={social.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                <DynamicIcon name={social.icon || social.platform} className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-100 text-sm">{social.platform}</h3>
                <p className="text-slate-400 text-xs truncate">{social.url}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleOpenModal('edit', social)}
                className="p-1.5 text-slate-400 hover:text-cyan-400"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(social.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {modal.mode === 'create' ? 'Add Social Link' : 'Edit Social Link'}
              </h3>
              <button onClick={() => setModal({ open: false, mode: 'create', data: null })}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  placeholder="GitHub / LinkedIn / Twitter"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">URL Target *</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Lucide Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/30"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksManager;
