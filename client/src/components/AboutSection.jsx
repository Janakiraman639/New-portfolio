import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User, Award, BookOpen, Compass } from 'lucide-react';

const AboutSection = () => {
  const { portfolio } = usePortfolio();
  const profile = portfolio?.profile;

  return (
    <section id="about" className="py-20 bg-slate-900/50 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            About Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main About Text */}
          <div className="lg:col-span-8 glass-card p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Biography & Expertise
            </h3>
            <div className="text-slate-300 text-base leading-relaxed space-y-4 whitespace-pre-line">
              {profile?.aboutText ||
                'I specialize in designing scalable artificial intelligence architectures and machine learning systems. With a strong foundation in software engineering and algorithms, I bridge the gap between cutting-edge AI research and production-grade software applications.'}
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Professional Role</h4>
                <p className="text-slate-400 text-xs mt-1">{profile?.title || 'AI/ML Engineer'}</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Core Focus</h4>
                <p className="text-slate-400 text-xs mt-1">Deep Learning, RAG, LLM Agents, Full Stack Cloud Architecture</p>
              </div>
            </div>

            {profile?.email && (
              <div className="glass-card p-6 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-slate-200 text-sm mb-2">Direct Contact</h4>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-cyan-400 text-sm font-medium hover:underline break-all"
                >
                  {profile.email}
                </a>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
