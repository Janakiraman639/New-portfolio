const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require JWT authentication + ADMIN role
router.use(authenticateToken);
router.use(requireAdmin);
const {
  getDashboardStats,
  updateProfile,
  createCategory,
  updateCategory,
  deleteCategory,
  createSkill,
  updateSkill,
  deleteSkill,
  createProject,
  updateProject,
  deleteProject,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadResume,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getMessages,
  markMessageRead,
  deleteMessage,
  updateSiteSettings,
  uploadFile,
} = require('../controllers/adminController');

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Profile
router.put('/profile', updateProfile);

// Skill Categories
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Skills
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Projects
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Experience
router.post('/experience', createExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Certifications
router.post('/certifications', createCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Resume
router.post('/resume', upload.single('file'), uploadResume);

// Social Links
router.post('/social-links', createSocialLink);
router.put('/social-links/:id', updateSocialLink);
router.delete('/social-links/:id', deleteSocialLink);

// Messages
router.get('/messages', getMessages);
router.put('/messages/:id/read', markMessageRead);
router.delete('/messages/:id', deleteMessage);

// Site Settings
router.put('/settings', updateSiteSettings);

// General File Upload
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
