import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

const CertificationsSection = () => {
  const { portfolio } = usePortfolio();
  const certifications = portfolio?.certifications || [];

  return (
    <section id="certifications" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Certifications & Credentials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Industry Recognized Credentials
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Verified certifications from AWS, Google, and top machine learning platforms.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-400 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Issued {cert.issueDate}
                </span>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Verify Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CertificationsSection;
