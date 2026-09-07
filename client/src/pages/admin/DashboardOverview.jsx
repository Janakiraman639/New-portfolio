import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { usePortfolio } from '../../context/PortfolioContext';
import { Layers, Cpu, Briefcase, Mail, Sparkles, ArrowRight, User, Eye } from 'lucide-react';

const DashboardOverview = ({ setActiveTab, onOpenPreview }) => {
  const { portfolio } = usePortfolio();
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    experienceCount: 0,
    unreadMessagesCount: 0,
    totalMessagesCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  const profile = portfolio?.profile;

  const statCards = [
    { label: 'Total Projects', value: stats.projectsCount, icon: Layers, color: 'text-cyan-400', tab: 'projects' },
    { label: 'Total Skills', value: stats.skillsCount, icon: Cpu, color: 'text-purple-400', tab: 'skills' },
    { label: 'Experience Entries', value: stats.experienceCount, icon: Briefcase, color: 'text-emerald-400', tab: 'experience' },
    { label: 'Unread Messages', value: stats.unreadMessagesCount, icon: Mail, color: 'text-amber-400', tab: 'messages' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> CMS Dashboard System
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, {profile?.name || 'Admin'}!
          </h1>
          <p className="text-slate-400 text-sm">
            All updates saved here automatically propagate to your public portfolio website.
          </p>
        </div>

        <button
          onClick={onOpenPreview}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all hover:scale-105 shrink-0 relative z-10"
        >
          <Eye className="w-4 h-4" /> Preview Live Portfolio
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(stat.tab)}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer hover:-translate-y-1 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Manage {stat.label} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Management Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Quick Content Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className="glass-card p-5 rounded-xl border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-900/60 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Edit Profile & Photo</h3>
              <p className="text-slate-400 text-xs mt-0.5">Name, Title, Avatar, Bio & Contact</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className="glass-card p-5 rounded-xl border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-900/60 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Manage Projects</h3>
              <p className="text-slate-400 text-xs mt-0.5">Add projects, graphics, demo links</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className="glass-card p-5 rounded-xl border border-slate-800 hover:border-slate-700 text-left transition-all hover:bg-slate-900/60 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Manage Skills</h3>
              <p className="text-slate-400 text-xs mt-0.5">Organize categories & tech stack</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;
