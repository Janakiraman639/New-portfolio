const prisma = require('../utils/prisma');

const getFullPortfolio = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
    const experiences = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
    const education = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });
    const certifications = await prisma.certification.findMany({
      orderBy: { order: 'asc' },
    });
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });
    const resume = await prisma.resume.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
    const siteSettings = await prisma.siteSettings.findFirst();

    // Parse technologies JSON string into array if needed
    const parsedProjects = projects.map(p => {
      let techs = [];
      try {
        techs = JSON.parse(p.technologies);
      } catch (e) {
        techs = p.technologies ? p.technologies.split(',').map(t => t.trim()) : [];
      }
      return { ...p, technologies: techs };
    });

    const parsedExperiences = experiences.map(exp => {
      let techs = [];
      if (exp.technologies) {
        try {
          techs = JSON.parse(exp.technologies);
        } catch (e) {
          techs = exp.technologies ? exp.technologies.split(',').map(t => t.trim()) : [];
        }
      }
      return { ...exp, technologies: techs };
    });

    return res.status(200).json({
      success: true,
      data: {
        profile,
        categories,
        projects: parsedProjects,
        experience: parsedExperiences,
        education,
        certifications,
        socialLinks,
        resume,
        siteSettings,
      },
    });
  } catch (error) {
    console.error('Get Full Portfolio Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve portfolio information.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getSkills = async (req, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: { skills: { orderBy: { order: 'asc' } } },
    });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
    const parsed = projects.map(p => {
      let techs = [];
      try { techs = JSON.parse(p.technologies); } catch (e) { techs = []; }
      return { ...p, technologies: techs };
    });
    return res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getExperience = async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    const parsed = experiences.map(exp => {
      let techs = [];
      if (exp.technologies) {
        try { techs = JSON.parse(exp.technologies); } catch (e) { techs = []; }
      }
      return { ...exp, technologies: techs };
    });
    return res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getEducation = async (req, res) => {
  try {
    const education = await prisma.education.findMany({ orderBy: { order: 'asc' } });
    return res.status(200).json({ success: true, data: education });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getCertifications = async (req, res) => {
  try {
    const certifications = await prisma.certification.findMany({ orderBy: { order: 'asc' } });
    return res.status(200).json({ success: true, data: certifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    return res.status(200).json({ success: true, data: socialLinks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
};

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject ? subject.trim() : 'Website Contact Form Query',
        message: message.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: newMessage,
    });
  } catch (error) {
    console.error('Submit Contact Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process contact message.' });
  }
};

module.exports = {
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
};
