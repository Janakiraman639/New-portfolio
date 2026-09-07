import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import { Briefcase, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';

const ExperienceManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const experiences = portfolio?.experience || [];

  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
    order: 0,
  });

  const handleOpenModal = (mode, exp = null) => {
    setModal({ open: true, mode, data: exp });
    if (mode === 'edit' && exp) {
      setForm({
        company: exp.company || '',
        role: exp.role || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrent: exp.isCurrent ?? false,
        description: exp.description || '',
        technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : (exp.technologies || ''),
        order: exp.order || 0,
      });
    } else {
      setForm({
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        technologies: '',
        order: experiences.length + 1,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const techArray = form.technologies
      ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...form,
      technologies: techArray,
    };

    try {
      if (modal.mode === 'create') {
        await api.post('/admin/experience', payload);
      } else {
        await api.put(`/admin/experience/${modal.data.id}`, payload);
      }
      await refreshPortfolio();
      setModal({ open: false, mode: 'create', data: null });
      setStatus({ type: 'success', message: 'Experience entry saved!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save experience.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete experience entry?')) return;
    try {
      await api.delete(`/admin/experience/${id}`);
      await refreshPortfolio();
      setStatus({ type: 'success', message: 'Experience entry deleted!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" /> Professional Experience
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Add or edit work history, job roles, company details, and technical contributions.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Experience Entry
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

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-lg">{exp.company}</h3>
              <p className="text-cyan-400 font-semibold text-xs">{exp.role} • {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
              <p className="text-slate-400 text-xs line-clamp-2 mt-1">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenModal('edit', exp)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-400 text-xs font-semibold border border-rose-800/60 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {modal.mode === 'create' ? 'Add Experience Entry' : 'Edit Experience Entry'}
              </h3>
              <button onClick={() => setModal({ open: false, mode: 'create', data: null })}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Nexus AI Solutions"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Job Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Lead AI Engineer"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">End Date</label>
                  <input
                    type="text"
                    disabled={form.isCurrent}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    placeholder="2024 / Present"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Bengaluru, India"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={form.isCurrent}
                  onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 text-cyan-600 focus:ring-cyan-500 bg-slate-950"
                />
                <label htmlFor="isCurrent" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Currently working in this position
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Role Description *</label>
                <textarea
                  required
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Responsibilities, technical impact, projects delivered..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Technologies Used (Comma separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="PyTorch, FastAPI, Kubernetes, Docker"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
