import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  User,
  Compass,
  Cpu,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Share2,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Eye,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const AdminLayout = ({ activeTab, setActiveTab, children, onOpenPreview }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { portfolio } = usePortfolio();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Avatar', icon: User },
    { id: 'about', label: 'About Section', icon: Compass },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects Manager', icon: Layers },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'resume', label: 'Resume File', icon: FileText },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'messages', label: 'Contact Messages', icon: Mail },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="font-extrabold text-base text-white">Admin CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPreview}
            className="p-2 rounded-lg bg-slate-800 text-cyan-400 text-xs font-semibold flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-600/30">
                A
              </span>
              <div>
                <h2 className="font-extrabold text-slate-100 text-base leading-none">Admin CMS</h2>
                <span className="text-[11px] text-cyan-400 font-medium">Dynamic Portfolio</span>
              </div>
            </Link>
          </div>

          {/* User Account Info */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.email || 'Administrator'}</p>
              <span className="text-[10px] text-emerald-400 font-medium">Session Active</span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onOpenPreview}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
          >
            <Eye className="w-4 h-4" /> Live Preview Portfolio
          </button>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full overflow-y-auto">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;
