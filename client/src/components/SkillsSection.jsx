import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import DynamicIcon from './DynamicIcon';
import { Cpu, Code2 } from 'lucide-react';

const SkillsSection = () => {
  const { portfolio } = usePortfolio();
  const categories = portfolio?.categories || [];
  const [activeCategory, setActiveCategory] = useState('ALL');

  const allSkills = categories.flatMap(cat => cat.skills || []);

  const filteredCategories = activeCategory === 'ALL'
    ? categories
    : categories.filter(cat => cat.id === activeCategory);

  return (
    <section id="skills" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Skills
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Technical Skills
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Languages, frameworks, machine learning tooling, databases, and cloud infrastructure.
          </p>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              All Skills ({allSkills.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {cat.name} ({cat.skills?.length || 0})
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <div className="space-y-10">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              {activeCategory === 'ALL' && (
                <h3 className="text-lg font-bold text-slate-200 border-l-4 border-cyan-500 pl-3">
                  {category.name}
                </h3>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.skills?.map((skill) => (
                  <div
                    key={skill.id}
                    className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/50 transition-all hover:-translate-y-1 group flex items-center gap-3"
                  >
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                      <DynamicIcon name={skill.icon} className="w-5 h-5" defaultIcon="Code2" />
                    </div>
                    <span className="font-semibold text-slate-200 text-sm group-hover:text-white truncate">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
