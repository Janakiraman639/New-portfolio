import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState({
    profile: null,
    categories: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    socialLinks: [],
    resume: null,
    siteSettings: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/portfolio');
      if (res.data.success) {
        setPortfolio(res.data.data);
        setError(null);
      } else {
        setError('Failed to fetch portfolio content.');
      }
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Could not connect to the portfolio server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        loading,
        error,
        refreshPortfolio: fetchPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
