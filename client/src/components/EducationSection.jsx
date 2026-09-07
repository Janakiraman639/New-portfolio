import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Award, Calendar } from 'lucide-react';

const EducationSection = () => {
  const { portfolio } = usePortfolio();
  const education = portfolio?.education || [];

  return (
    <section id="education" className="py-20 bg-slate-900/40 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            Academic Background
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Education & Degrees
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Academic qualifications, theoretical foundation, and research specializations.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                  {edu.grade && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs border border-cyan-500/20">
                      <Award className="w-3.5 h-3.5" /> {edu.grade}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-100">{edu.degree}</h3>
                <h4 className="text-cyan-400 font-semibold text-sm">{edu.institution}</h4>
              </div>

              {edu.description && (
                <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-800/80">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EducationSection;
