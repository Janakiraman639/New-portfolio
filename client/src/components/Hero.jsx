import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import DynamicIcon from './DynamicIcon';
import { Briefcase, Download, Mail, ArrowRight, Sparkles, MapPin } from 'lucide-react';

const Hero = () => {
  const { portfolio } = usePortfolio();
  const profile = portfolio?.profile;
  const resume = portfolio?.resume;
  const socialLinks = portfolio?.socialLinks || [];

  return (
    <section id="home" className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-slate-950">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-sky-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Availability Badge */}
            {profile?.availableForWork && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for New Projects & Roles
              </div>
            )}

            {/* Title & Name */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  {profile?.name || 'Janakiraman'}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-300 flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400 inline" />
                {profile?.title || 'AI/ML Engineer & Full-Stack Architect'}
              </h2>
            </div>

            {/* Short Bio */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              {profile?.shortBio || 'Building next-generation intelligent systems, LLM agents, and scalable cloud architectures.'}
            </p>

            {/* Location Tag */}
            {profile?.location && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
              >
                <Briefcase className="w-4 h-4" />
                View Projects
                <ArrowRight className="w-4 h-4" />
              </a>

              {resume?.fileUrl && (
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 hover:border-slate-700 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  Download Resume
                </a>
              )}

              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 hover:border-slate-700 transition-all hover:scale-105"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                Contact Me
              </a>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="pt-4 flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Connect:</span>
                <div className="flex items-center gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-all hover:scale-110"
                      title={s.platform}
                    >
                      <DynamicIcon name={s.icon || s.platform} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Profile Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
              
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glass-card border border-slate-800 p-2 shadow-2xl">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name || 'Profile'}
                    className="w-full h-full object-cover rounded-2xl transition-all duration-300"
                    style={{
                      objectPosition: `${profile.avatarPositionX ?? 50}% ${profile.avatarPositionY ?? 50}%`,
                      transform: `scale(${(profile.avatarZoom ?? 100) / 100})`,
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-slate-900 to-cyan-950 flex flex-col items-center justify-center text-cyan-400 p-6 text-center">
                    <Sparkles className="w-16 h-16 mb-2" />
                    <span className="font-bold text-lg text-white">{profile?.name || 'Developer'}</span>
                    <span className="text-xs text-slate-400 mt-1">{profile?.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
