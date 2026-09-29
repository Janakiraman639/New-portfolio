import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import { GraduationCap, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';

const EducationManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const education = portfolio?.education || [];

  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    degree: '',
    institution: '',
    startYear: '',
    endYear: '',
    grade: '',
    description: '',
    order: 0,
  });

  const handleOpenModal = (mode, edu = null) => {
    setModal({ open: true, mode, data: edu });
    if (mode === 'edit' && edu) {
      setForm({
        degree: edu.degree || '',
        institution: edu.institution || '',
        startYear: edu.startYear || '',
        endYear: edu.endYear || '',
        grade: edu.grade || '',
        description: edu.description || '',
        order: edu.order || 0,
      });
    } else {
      setForm({
        degree: '',
        institution: '',
        startYear: '',
        endYear: '',
        grade: '',
        description: '',
        order: education.length + 1,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (modal.mode === 'create') {
        await api.post('/admin/education', form);
      } else {
        await api.put(`/admin/education/${modal.data.id}`, form);
      }
      await refreshPortfolio();
      setModal({ open: false, mode: 'create', data: null });
      setStatus({ type: 'success', message: 'Education entry saved!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save education.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete education entry?')) return;
    try {
      await api.delete(`/admin/education/${id}`);
      await refreshPortfolio();
      setStatus({ type: 'success', message: 'Education entry deleted!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cyan-400" /> Education Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage degree qualifications, university details, start/end years, and CGPA.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Education
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu) => (
          <div key={edu.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-cyan-400 font-mono">{edu.startYear} – {edu.endYear || 'Present'}</span>
              <h3 className="font-bold text-slate-100 text-base mt-1">{edu.degree}</h3>
              <p className="text-slate-300 text-xs font-medium">{edu.institution}</p>
              {edu.grade && <p className="text-xs text-emerald-400 font-bold mt-1">Grade: {edu.grade}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleOpenModal('edit', edu)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="px-3 py-1 rounded-lg bg-rose-950/60 text-rose-400 text-xs font-semibold border border-rose-800/60 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="glass-card max-w-lg w-full rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                {modal.mode === 'create' ? 'Add Education' : 'Edit Education'}
              </h3>
              <button
                type="button"
                onClick={() => setModal({ open: false, mode: 'create', data: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Degree Name *</label>
                  <input
                    type="text"
                    required
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    placeholder="M.Tech in Artificial Intelligence"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Institution / University *</label>
                  <input
                    type="text"
                    required
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Indian Institute of Technology (IIT)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Start Year *</label>
                    <input
                      type="text"
                      required
                      value={form.startYear}
                      onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                      placeholder="2019"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">End Year</label>
                    <input
                      type="text"
                      value={form.endYear}
                      onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                      placeholder="2021"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Grade / CGPA</label>
                    <input
                      type="text"
                      value={form.grade}
                      onChange={(e) => setForm({ ...form, grade: e.target.value })}
                      placeholder="9.4 CGPA"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Specialization details, thesis title, achievements..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-800/80 flex items-center justify-end gap-3 shrink-0 bg-slate-950/80 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManager;
