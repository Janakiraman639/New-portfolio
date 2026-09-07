import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import CertificationsSection from '../components/CertificationsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { usePortfolio } from '../context/PortfolioContext';
import { Loader2 } from 'lucide-react';

const PortfolioPage = () => {
  const { portfolio, loading, error } = usePortfolio();

  useEffect(() => {
    if (portfolio?.siteSettings?.siteTitle) {
      document.title = portfolio.siteSettings.siteTitle;
    }
  }, [portfolio]);

  if (loading && !portfolio?.profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400 gap-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading Portfolio Content...</span>
      </div>
    );
  }

  if (error && !portfolio?.profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
        <div className="glass-card p-8 rounded-2xl max-w-md text-center space-y-4 border border-rose-500/30">
          <h2 className="text-xl font-bold text-rose-400">Server Connection Error</h2>
          <p className="text-sm text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
