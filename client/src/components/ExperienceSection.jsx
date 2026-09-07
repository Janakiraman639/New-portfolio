import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, MapPin, Building2 } from 'lucide-react';

const ExperienceSection = () => {
  const { portfolio } = usePortfolio();
  const experiences = portfolio?.experience || [];

  return (
    <section id="experience" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            Career History
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Professional Experience
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Track record of leadership, engineering impact, and technology contributions.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-500 group-hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/50" />

              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-all space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-cyan-400" />
                      {exp.company}
                    </h3>
                    <p className="text-cyan-400 font-semibold text-sm mt-0.5">{exp.role}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>

                {/* Technologies used */}
                {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
