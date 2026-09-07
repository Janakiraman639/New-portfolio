import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import { Award, Plus, Edit2, Trash2, Upload, ExternalLink, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const CertificationsManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const certifications = portfolio?.certifications || [];

  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    imageUrl: '',
    order: 0,
  });

  const handleOpenModal = (mode, cert = null) => {
    setModal({ open: true, mode, data: cert });
    if (mode === 'edit' && cert) {
      setForm({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.issueDate || '',
        credentialUrl: cert.credentialUrl || '',
        imageUrl: cert.imageUrl || '',
        order: cert.order || 0,
      });
    } else {
      setForm({
        name: '',
        issuer: '',
        issueDate: '',
        credentialUrl: '',
        imageUrl: '',
        order: certifications.length + 1,
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyData = new FormData();
    bodyData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/admin/upload', bodyData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setForm((prev) => ({ ...prev, imageUrl: res.data.fileUrl }));
      }
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (modal.mode === 'create') {
        await api.post('/admin/certifications', form);
      } else {
        await api.put(`/admin/certifications/${modal.data.id}`, form);
      }
      await refreshPortfolio();
      setModal({ open: false, mode: 'create', data: null });
      setStatus({ type: 'success', message: 'Certification saved!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save certification.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete certification entry?')) return;
    try {
      await api.delete(`/admin/certifications/${id}`);
      await refreshPortfolio();
      setStatus({ type: 'success', message: 'Certification deleted!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" /> Certifications Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage industry certifications, credentials, issuing organization, and verification links.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Certification
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
        {certifications.map((cert) => (
          <div key={cert.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cyan-400">
                    <Award className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-100 text-base">{cert.name}</h3>
                <p className="text-slate-400 text-xs">{cert.issuer} • {cert.issueDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {cert.credentialUrl ? (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
                  Verify <ExternalLink className="w-3 h-3" />
                </a>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal('edit', cert)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="px-3 py-1 rounded-lg bg-rose-950/60 text-rose-400 text-xs font-semibold border border-rose-800/60 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {modal.mode === 'create' ? 'Add Certification' : 'Edit Certification'}
              </h3>
              <button onClick={() => setModal({ open: false, mode: 'create', data: null })}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="AWS Certified Machine Learning - Specialty"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.issuer}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Issue Year / Date *</label>
                  <input
                    type="text"
                    required
                    value={form.issueDate}
                    onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Credential Verification URL</label>
                <input
                  type="url"
                  value={form.credentialUrl}
                  onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                  placeholder="https://aws.amazon.com/verify..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Badge / Certificate Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/uploads/... or URL"
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
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
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsManager;
