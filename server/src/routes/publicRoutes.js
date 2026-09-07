const express = require('express');
const router = express.Router();
const {
  getFullPortfolio,
  getProfile,
  getSkills,
  getProjects,
  getExperience,
  getEducation,
  getCertifications,
  getResume,
  getSocialLinks,
  submitContact,
} = require('../controllers/publicController');

router.get('/portfolio', getFullPortfolio);
router.get('/profile', getProfile);
router.get('/skills', getSkills);
router.get('/projects', getProjects);
router.get('/experience', getExperience);
router.get('/education', getEducation);
router.get('/certifications', getCertifications);
router.get('/resume', getResume);
router.get('/social-links', getSocialLinks);

router.post('/contact', submitContact);

module.exports = router;
