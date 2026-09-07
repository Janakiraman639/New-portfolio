import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Shield, Download } from 'lucide-react';

const Navbar = () => {
  const { portfolio } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profile = portfolio?.profile;
  const resume = portfolio?.resume;

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 dark:bg-slate-950/80 bg-white/80 backdrop-blur-md border-b border-slate-800/60 dark:border-slate-800/60 border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <a href="#home" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              {profile?.name ? profile.name.charAt(0) : 'J'}
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              {profile?.name || 'Janakiraman'}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 dark:text-slate-300 text-slate-700 hover:text-cyan-400 dark:hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions: Resume, Theme Toggle, Admin Button */}
          <div className="hidden md:flex items-center gap-3">
            {resume?.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Resume
              </a>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Toggle Dark/Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all hover:scale-105"
            >
              <Shield className="w-3.5 h-3.5" />
              {isAuthenticated ? 'Admin CMS' : 'Admin Login'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {resume?.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-md bg-slate-800 text-slate-200 text-sm font-semibold"
              >
                <Download className="w-4 h-4 text-cyan-400" /> Download Resume
              </a>
            )}
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 rounded-md bg-cyan-600 text-white text-sm font-semibold"
            >
              <Shield className="w-4 h-4" /> {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
