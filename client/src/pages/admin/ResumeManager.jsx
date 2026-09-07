import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import { FileText, Upload, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ResumeManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const resume = portfolio?.resume;

  const [title, setTitle] = useState(resume?.title || 'Janakiraman_Resume.pdf');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Only PDF documents are allowed for resumes.' });
      return;
    }

    const bodyData = new FormData();
    bodyData.append('file', file);
    bodyData.append('title', title || file.originalname);

    setUploading(true);
    setStatus(null);

    try {
      const res = await api.post('/admin/resume', bodyData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        await refreshPortfolio();
        setStatus({ type: 'success', message: 'New resume uploaded and set active! Public site updated.' });
      } else {
        setStatus({ type: 'error', message: res.data.message || 'Upload failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Error uploading resume file.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" /> Resume Document Management
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Upload and manage your active PDF resume. Visitors will download this file directly.
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

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Active Resume Status Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                Active Resume File
              </span>
              <h3 className="font-bold text-slate-100 text-base">{resume?.title || 'No resume uploaded yet.'}</h3>
              <p className="text-slate-500 text-xs font-mono">{resume?.fileUrl || 'Upload a PDF file below'}</p>
            </div>
          </div>

          {resume?.fileUrl && (
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Preview File
            </a>
          )}
        </div>

        {/* Upload Form */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Resume Title / Display Label
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Janakiraman_AI_ML_Engineer_Resume.pdf"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Upload New PDF File
            </label>
            <label className="w-full h-36 rounded-2xl bg-slate-950/60 border-2 border-dashed border-slate-800 hover:border-cyan-500/60 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 group">
              {uploading ? (
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                  <Loader2 className="w-5 h-5 animate-spin" /> Uploading & Processing PDF...
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                  <span className="font-bold text-slate-200 text-xs">Click to select PDF resume file</span>
                  <span className="text-[11px] text-slate-500 mt-1">Accepts PDF files up to 10MB</span>
                </>
              )}
              <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeManager;
