import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import DashboardOverview from './DashboardOverview';
import ProfileManager from './ProfileManager';
import AboutManager from './AboutManager';
import SkillsManager from './SkillsManager';
import ProjectsManager from './ProjectsManager';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import CertificationsManager from './CertificationsManager';
import ResumeManager from './ResumeManager';
import SocialLinksManager from './SocialLinksManager';
import MessagesManager from './MessagesManager';
import SiteSettingsManager from './SiteSettingsManager';
import LivePreviewModal from './LivePreviewModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewOpen, setPreviewOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview setActiveTab={setActiveTab} onOpenPreview={() => setPreviewOpen(true)} />;
      case 'profile':
        return <ProfileManager />;
      case 'about':
        return <AboutManager />;
      case 'skills':
        return <SkillsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'education':
        return <EducationManager />;
      case 'certifications':
        return <CertificationsManager />;
      case 'resume':
        return <ResumeManager />;
      case 'social':
        return <SocialLinksManager />;
      case 'messages':
        return <MessagesManager />;
      case 'settings':
        return <SiteSettingsManager />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} onOpenPreview={() => setPreviewOpen(true)} />;
    }
  };

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPreview={() => setPreviewOpen(true)}
      >
        {renderContent()}
      </AdminLayout>

      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default AdminDashboard;
