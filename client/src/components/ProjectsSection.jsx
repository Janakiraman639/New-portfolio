import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Layers, ExternalLink, Github, Sparkles, Search, X, CheckCircle2 } from 'lucide-react';

const ProjectsSection = () => {
  const { portfolio } = usePortfolio();
  const projects = portfolio?.projects || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(term);
    const descMatch = project.shortDesc.toLowerCase().includes(term);
    const techMatch = Array.isArray(project.technologies) && project.technologies.some(t => t.toLowerCase().includes(term));
    return titleMatch || descMatch || techMatch;
  });

  return (
    <section id="projects" className="py-20 bg-slate-900/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Portfolio Projects
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            MY PROJECTS
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Explore intelligent applications,rag,llm model and full-stack software Engineer.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description or technology (e.g. PyTorch, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm glass-card max-w-md mx-auto rounded-xl">
            No projects matched your search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1.5 flex flex-col group shadow-xl"
              >
                {/* Project Image Banner */}
                <div
                  className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-cyan-950 to-slate-900 flex items-center justify-center text-cyan-400">
                      <Sparkles className="w-12 h-12" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="text-lg font-bold text-slate-100 hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {Array.isArray(project.technologies) &&
                      project.technologies.slice(0, 5).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[11px] font-mono border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    {Array.isArray(project.technologies) && project.technologies.length > 5 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-cyan-400 text-[11px] font-mono">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs font-semibold">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Details & Overview →
                    </button>
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                          title="View GitHub Code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="relative h-56 bg-slate-950 overflow-hidden">
              {selectedProject.imageUrl && (
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-white">{selectedProject.title}</h3>
                {selectedProject.featured && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedProject.fullDesc || selectedProject.shortDesc}
              </p>

              {/* Technologies list */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedProject.technologies) &&
                    selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-800"
                  >
                    <Github className="w-4 h-4" /> GitHub Repository
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold shadow-md shadow-cyan-600/30"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
