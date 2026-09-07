import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';

const DEFAULT_ADMIN_PASSWORD = 'AdminPass123!';

const SiteSettingsManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const settings = portfolio?.siteSettings;

  const [form, setForm] = useState({
    siteTitle: 'Janakiraman | AI & ML Engineer Portfolio',
    metaDescription:
      'Official portfolio of Janakiraman - AI/ML Engineer, Full Stack Developer & Tech Innovator.',
    themeMode: 'dark',
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm({
        siteTitle: settings.siteTitle || '',
        metaDescription: settings.metaDescription || '',
        themeMode: settings.themeMode || 'dark',
      });
    }
  }, [settings]);

  // -----------------------------------------
  // SAVE SITE SETTINGS
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await api.put('/admin/settings', form);

      if (res.data.success) {
        await refreshPortfolio();

        setStatus({
          type: 'success',
          message: 'Site settings updated successfully!',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Failed to update settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // UPDATE ADMIN PASSWORD
  // -----------------------------------------
  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    setPasswordStatus(null);

    const savedPassword =
      localStorage.getItem('adminPassword') || DEFAULT_ADMIN_PASSWORD;

    // Check current password
    if (!currentPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'Please enter your current password.',
      });
      return;
    }

    if (currentPassword !== savedPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'Current password is incorrect.',
      });
      return;
    }

    // Check new password
    if (!newPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'Please enter a new password.',
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: 'error',
        message: 'New password must contain at least 8 characters.',
      });
      return;
    }

    // Check confirmation
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    // Don't allow same password
    if (newPassword === currentPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'New password must be different from the current password.',
      });
      return;
    }

    setPasswordUpdating(true);

    // Save the new password
    localStorage.setItem('adminPassword', newPassword);

    setTimeout(() => {
      setPasswordUpdating(false);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setPasswordStatus({
        type: 'success',
        message:
          'Password updated successfully! Your new password will be required the next time you log in.',
      });
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">

      {/* =========================================
          SITE SETTINGS
      ========================================== */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Site Settings & SEO
        </h1>

        <p className="text-slate-400 text-xs mt-1">
          Configure page titles, browser tab title, meta descriptions, and
          default theme preferences.
        </p>
      </div>

      {/* Site Settings Status */}
      {status && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 border ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}

          <span>{status.message}</span>
        </div>
      )}

      {/* Site Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6"
      >
        {/* Site Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Browser Page Title (SEO) *
          </label>

          <input
            type="text"
            required
            value={form.siteTitle}
            onChange={(e) =>
              setForm({
                ...form,
                siteTitle: e.target.value,
              })
            }
            placeholder="Janakiraman | AI & ML Engineer Portfolio"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            SEO Meta Description *
          </label>

          <textarea
            required
            rows="3"
            value={form.metaDescription}
            onChange={(e) =>
              setForm({
                ...form,
                metaDescription: e.target.value,
              })
            }
            placeholder="Search engine summary snippet..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* Theme */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Default Color Scheme
          </label>

          <select
            value={form.themeMode}
            onChange={(e) =>
              setForm({
                ...form,
                themeMode: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="dark">Dark Theme (Recommended)</option>
            <option value="light">Light Theme</option>
          </select>
        </div>

        {/* Save */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}

            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* =========================================
          PASSWORD MANAGER
      ========================================== */}
      <div className="pt-2">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            Password Manager
          </h2>

          <p className="text-slate-400 text-xs mt-1">
            Change the password used to access your Admin CMS.
          </p>
        </div>

        {/* Password Status */}
        {passwordStatus && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 border mb-5 ${
              passwordStatus.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}

            <span>{passwordStatus.message}</span>
          </div>
        )}

        <form
          onSubmit={handlePasswordUpdate}
          className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6"
        >
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Current Password *
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              New Password *
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Password must contain at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Confirm New Password *
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Update Password Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={passwordUpdating}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {passwordUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}

              {passwordUpdating
                ? 'Updating Password...'
                : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteSettingsManager;