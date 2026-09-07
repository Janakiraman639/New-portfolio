import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const storedPassword =
      localStorage.getItem('portfolioAdminPassword');

    if (!storedPassword) {
      setError(
        'No local password is configured. Your current login is controlled by the server API.'
      );
      return;
    }

    if (currentPassword !== storedPassword) {
      setError('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        'New password must be different from the current password.'
      );
      return;
    }

    localStorage.setItem(
      'portfolioAdminPassword',
      newPassword
    );

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setMessage('Password changed successfully.');

    setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1500);
  };

  const PasswordInput = ({
    value,
    setValue,
    show,
    setShow,
    placeholder,
  }) => {
    return (
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            px-4
            py-3
            pr-12
            rounded-xl
            bg-slate-900
            border
            border-slate-700
            text-white
            placeholder-slate-500
            focus:outline-none
            focus:border-cyan-500
            focus:ring-1
            focus:ring-cyan-500
            transition
          "
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-slate-400
            hover:text-cyan-400
          "
        >
          {show ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="
            flex
            items-center
            gap-2
            mb-6
            text-slate-400
            hover:text-cyan-400
            transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Card */}
        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          shadow-xl
        ">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">

            <div className="
              w-11
              h-11
              rounded-xl
              bg-cyan-500/10
              flex
              items-center
              justify-center
            ">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                Change Password
              </h1>

              <p className="text-sm text-slate-400">
                Update your admin password
              </p>
            </div>

          </div>

          {/* Success */}
          {message && (
            <div className="
              mb-5
              flex
              items-center
              gap-2
              p-3
              rounded-xl
              bg-emerald-500/10
              border
              border-emerald-500/20
              text-emerald-400
              text-sm
            ">
              <CheckCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="
              mb-5
              flex
              items-center
              gap-2
              p-3
              rounded-xl
              bg-rose-500/10
              border
              border-rose-500/20
              text-rose-400
              text-sm
            ">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Current Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Current Password
              </label>

              <PasswordInput
                value={currentPassword}
                setValue={setCurrentPassword}
                show={showCurrent}
                setShow={setShowCurrent}
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                New Password
              </label>

              <PasswordInput
                value={newPassword}
                setValue={setNewPassword}
                show={showNew}
                setShow={setShowNew}
                placeholder="Enter new password"
              />

              <p className="mt-2 text-xs text-slate-500">
                Minimum 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Confirm New Password
              </label>

              <PasswordInput
                value={confirmPassword}
                setValue={setConfirmPassword}
                show={showConfirm}
                setShow={setShowConfirm}
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-3
                rounded-xl
                bg-cyan-600
                hover:bg-cyan-500
                text-white
                font-semibold
                transition-all
                hover:scale-[1.01]
              "
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ChangePassword;