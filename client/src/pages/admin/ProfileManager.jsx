import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import { User, Save, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ProfileManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const profile = portfolio?.profile;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    shortBio: '',
    aboutText: '',
    avatarUrl: '',
    avatarPositionX: 50,
    avatarPositionY: 50,
    avatarZoom: 100,
    location: '',
    email: '',
    phone: '',
    availableForWork: true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        shortBio: profile.shortBio || '',
        aboutText: profile.aboutText || '',
        avatarUrl: profile.avatarUrl || '',
        avatarPositionX: profile.avatarPositionX ?? 50,
        avatarPositionY: profile.avatarPositionY ?? 50,
        avatarZoom: profile.avatarZoom ?? 100,
        location: profile.location || '',
        email: profile.email || '',
        phone: profile.phone || '',
        availableForWork: profile.availableForWork ?? true,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyData = new FormData();
    bodyData.append('file', file);

    setUploading(true);
    setStatus(null);

    try {
      const res = await api.post('/admin/upload', bodyData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, avatarUrl: res.data.fileUrl }));
        setStatus({ type: 'success', message: 'Profile photo uploaded successfully!' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to upload image file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await api.put('/admin/profile', formData);
      if (res.data.success) {
        await refreshPortfolio();
        setStatus({ type: 'success', message: 'Profile updated! Public portfolio reflects changes instantly.' });
      } else {
        setStatus({ type: 'error', message: res.data.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Error saving profile data.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" /> Profile & Avatar Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Update primary personal information and adjust profile photo framing & zoom.
          </p>
        </div>
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
        
        {/* Avatar Upload & Position Adjuster */}
        <div className="space-y-6 pb-6 border-b border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            
            {/* Live Interactive Preview Frame & Directional Pad */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hero Frame Preview
              </span>
              <div className="w-44 h-44 rounded-3xl overflow-hidden glass-card border-2 border-cyan-500/50 p-1 shadow-xl relative bg-slate-950">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar Live Preview"
                    className="w-full h-full object-cover rounded-2xl transition-all duration-150"
                    style={{
                      objectPosition: `${formData.avatarPositionX}% ${formData.avatarPositionY}%`,
                      transform: `scale(${formData.avatarZoom / 100})`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-semibold text-center p-2">
                    Upload a photo to adjust framing
                  </div>
                )}
              </div>

              {/* D-Pad Up / Down / Left / Right Buttons */}
              {formData.avatarUrl && (
                <div className="flex flex-col items-center gap-1 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nudge Direction</span>
                  
                  {/* Up Button */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatarPositionY: Math.max(0, prev.avatarPositionY - 5) }))}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs border border-slate-800 transition-colors shadow-sm"
                    title="Move Up"
                  >
                    ▲ Move Up
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Left Button */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarPositionX: Math.max(0, prev.avatarPositionX - 5) }))}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs border border-slate-800 transition-colors shadow-sm"
                      title="Move Left"
                    >
                      ◄ Left
                    </button>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarPositionX: 50, avatarPositionY: 50, avatarZoom: 100 }))}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
                      title="Reset"
                    >
                      Center
                    </button>

                    {/* Right Button */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarPositionX: Math.min(100, prev.avatarPositionX + 5) }))}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs border border-slate-800 transition-colors shadow-sm"
                      title="Move Right"
                    >
                      Right ►
                    </button>
                  </div>

                  {/* Down Button */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatarPositionY: Math.min(100, prev.avatarPositionY + 5) }))}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs border border-slate-800 transition-colors shadow-sm"
                    title="Move Down"
                  >
                    ▼ Move Down
                  </button>
                </div>
              )}
            </div>

            {/* Upload Buttons & Sliders */}
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Profile Photo File
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer flex items-center gap-2 transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Uploading...' : 'Upload New Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Photo Framing Adjustment Sliders */}
              {formData.avatarUrl && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Sliders & Precise Controls</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarPositionX: 50, avatarPositionY: 50, avatarZoom: 100 })}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Reset Alignment
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Zoom Slider */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>Zoom Scale</span>
                        <span className="font-mono text-cyan-400">{formData.avatarZoom}%</span>
                      </div>
                      <input
                        type="range"
                        name="avatarZoom"
                        min="100"
                        max="250"
                        value={formData.avatarZoom}
                        onChange={handleChange}
                        className="w-full text-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Horizontal Position (Position X) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>Left ↔ Right</span>
                        <span className="font-mono text-cyan-400">{formData.avatarPositionX}%</span>
                      </div>
                      <input
                        type="range"
                        name="avatarPositionX"
                        min="0"
                        max="100"
                        value={formData.avatarPositionX}
                        onChange={handleChange}
                        className="w-full text-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Vertical Position (Position Y) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>Up ▲ ↔ Down ▼</span>
                        <span className="font-mono text-cyan-400">{formData.avatarPositionY}%</span>
                      </div>
                      <input
                        type="range"
                        name="avatarPositionY"
                        min="0"
                        max="100"
                        value={formData.avatarPositionY}
                        onChange={handleChange}
                        className="w-full text-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Janakiraman"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Professional Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Senior AI/ML Engineer & Full-Stack Architect"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Short Hero Introduction *</label>
          <textarea
            name="shortBio"
            required
            rows="3"
            value={formData.shortBio}
            onChange={handleChange}
            placeholder="Building next-generation intelligent systems, LLM agents, and scalable cloud architectures..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bengaluru, India"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="janakiraman@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone / Contact</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="availableForWork"
            name="availableForWork"
            checked={formData.availableForWork}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-800 text-cyan-600 focus:ring-cyan-500 bg-slate-950"
          />
          <label htmlFor="availableForWork" className="text-xs font-semibold text-slate-200 cursor-pointer">
            Display "Available for New Projects & Roles" badge on Hero banner
          </label>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProfileManager;
