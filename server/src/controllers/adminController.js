const prisma = require('../utils/prisma');

// 1. Dashboard Overview Stats
const getDashboardStats = async (req, res) => {
  try {
    const projectsCount = await prisma.project.count();
    const skillsCount = await prisma.skill.count();
    const experienceCount = await prisma.experience.count();
    const educationCount = await prisma.education.count();
    const certificationsCount = await prisma.certification.count();
    const unreadMessagesCount = await prisma.contactMessage.count({ where: { isRead: false } });
    const totalMessagesCount = await prisma.contactMessage.count();

    // Get the most recent update across key models
    const latestProject = await prisma.project.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } });
    const latestProfile = await prisma.profile.findFirst({ select: { updatedAt: true } });
    const latestSettings = await prisma.siteSettings.findFirst({ select: { updatedAt: true } });

    const timestamps = [latestProject?.updatedAt, latestProfile?.updatedAt, latestSettings?.updatedAt].filter(Boolean);
    const lastUpdated = timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => new Date(t).getTime()))).toISOString() : null;

    return res.status(200).json({
      success: true,
      data: {
        projectsCount,
        skillsCount,
        experienceCount,
        educationCount,
        certificationsCount,
        unreadMessagesCount,
        totalMessagesCount,
        lastUpdated,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
};

// 2. Profile Management
const updateProfile = async (req, res) => {
  try {
    const existingProfile = await prisma.profile.findFirst();
    const {
      name,
      title,
      shortBio,
      aboutText,
      avatarUrl,
      avatarPositionX,
      avatarPositionY,
      avatarZoom,
      location,
      email,
      phone,
      availableForWork,
    } = req.body;

    const dataObj = {
      name,
      title,
      shortBio,
      aboutText,
      avatarUrl,
      avatarPositionX: avatarPositionX !== undefined ? parseInt(avatarPositionX) : 50,
      avatarPositionY: avatarPositionY !== undefined ? parseInt(avatarPositionY) : 50,
      avatarZoom: avatarZoom !== undefined ? parseInt(avatarZoom) : 100,
      location,
      email,
      phone,
      availableForWork: availableForWork === true || availableForWork === 'true',
    };

    let updated;
    if (existingProfile) {
      updated = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: dataObj,
      });
    } else {
      updated = await prisma.profile.create({
        data: dataObj,
      });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Skill Categories & Skills Management
const createCategory = async (req, res) => {
  try {
    const { name, order } = req.body;
    const category = await prisma.skillCategory.create({
      data: { name, order: parseInt(order) || 0 },
    });
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;
    const category = await prisma.skillCategory.update({
      where: { id },
      data: { name, order: parseInt(order) || 0 },
    });
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skillCategory.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, categoryId, proficiency, icon, order } = req.body;
    const skill = await prisma.skill.create({
      data: {
        name,
        categoryId,
        proficiency: parseInt(proficiency) || 80,
        icon: icon || 'Code',
        order: parseInt(order) || 0,
      },
      include: { category: true },
    });
    return res.status(201).json({ success: true, data: skill });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId, proficiency, icon, order } = req.body;
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        categoryId,
        proficiency: parseInt(proficiency) || 80,
        icon: icon || 'Code',
        order: parseInt(order) || 0,
      },
      include: { category: true },
    });
    return res.status(200).json({ success: true, data: skill });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Skill deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Project Management
const createProject = async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, imageUrl, githubUrl, liveUrl, technologies, featured, order } = req.body;

    const techString = Array.isArray(technologies) ? JSON.stringify(technologies) : (typeof technologies === 'string' ? (technologies.startsWith('[') ? technologies : JSON.stringify(technologies.split(',').map(t => t.trim()))) : JSON.stringify([]));

    const project = await prisma.project.create({
      data: {
        title,
        shortDesc,
        fullDesc,
        imageUrl,
        githubUrl,
        liveUrl,
        technologies: techString,
        featured: featured === true || featured === 'true',
        order: parseInt(order) || 0,
      },
    });
    return res.status(201).json({ success: true, data: { ...project, technologies: JSON.parse(project.technologies) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDesc, fullDesc, imageUrl, githubUrl, liveUrl, technologies, featured, order } = req.body;

    const techString = Array.isArray(technologies) ? JSON.stringify(technologies) : (typeof technologies === 'string' ? (technologies.startsWith('[') ? technologies : JSON.stringify(technologies.split(',').map(t => t.trim()))) : JSON.stringify([]));

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        shortDesc,
        fullDesc,
        imageUrl,
        githubUrl,
        liveUrl,
        technologies: techString,
        featured: featured === true || featured === 'true',
        order: parseInt(order) || 0,
      },
    });
    return res.status(200).json({ success: true, data: { ...project, technologies: JSON.parse(project.technologies) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Experience Management
const createExperience = async (req, res) => {
  try {
    const { company, role, location, startDate, endDate, isCurrent, description, technologies, order } = req.body;
    const techString = Array.isArray(technologies) ? JSON.stringify(technologies) : (typeof technologies === 'string' ? (technologies.startsWith('[') ? technologies : JSON.stringify(technologies.split(',').map(t => t.trim()))) : null);

    const exp = await prisma.experience.create({
      data: {
        company,
        role,
        location,
        startDate,
        endDate,
        isCurrent: isCurrent === true || isCurrent === 'true',
        description,
        technologies: techString,
        order: parseInt(order) || 0,
      },
    });
    return res.status(201).json({ success: true, data: exp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, role, location, startDate, endDate, isCurrent, description, technologies, order } = req.body;
    const techString = Array.isArray(technologies) ? JSON.stringify(technologies) : (typeof technologies === 'string' ? (technologies.startsWith('[') ? technologies : JSON.stringify(technologies.split(',').map(t => t.trim()))) : null);

    const exp = await prisma.experience.update({
      where: { id },
      data: {
        company,
        role,
        location,
        startDate,
        endDate,
        isCurrent: isCurrent === true || isCurrent === 'true',
        description,
        technologies: techString,
        order: parseInt(order) || 0,
      },
    });
    return res.status(200).json({ success: true, data: exp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Experience entry deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Education Management
const createEducation = async (req, res) => {
  try {
    const { degree, institution, startYear, endYear, grade, description, order } = req.body;
    const edu = await prisma.education.create({
      data: {
        degree,
        institution,
        startYear,
        endYear,
        grade,
        description,
        order: parseInt(order) || 0,
      },
    });
    return res.status(201).json({ success: true, data: edu });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, startYear, endYear, grade, description, order } = req.body;
    const edu = await prisma.education.update({
      where: { id },
      data: {
        degree,
        institution,
        startYear,
        endYear,
        grade,
        description,
        order: parseInt(order) || 0,
      },
    });
    return res.status(200).json({ success: true, data: edu });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Education entry deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Certification Management
const createCertification = async (req, res) => {
  try {
    const { name, issuer, issueDate, credentialUrl, imageUrl, order } = req.body;
    const cert = await prisma.certification.create({
      data: {
        name,
        issuer,
        issueDate,
        credentialUrl,
        imageUrl,
        order: parseInt(order) || 0,
      },
    });
    return res.status(201).json({ success: true, data: cert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, issuer, issueDate, credentialUrl, imageUrl, order } = req.body;
    const cert = await prisma.certification.update({
      where: { id },
      data: {
        name,
        issuer,
        issueDate,
        credentialUrl,
        imageUrl,
        order: parseInt(order) || 0,
      },
    });
    return res.status(200).json({ success: true, data: cert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.certification.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Certification deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Resume Management
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume PDF file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const title = req.body.title || req.file.originalname;

    // Deactivate previous resumes
    await prisma.resume.updateMany({ data: { isActive: false } });

    const newResume = await prisma.resume.create({
      data: {
        title,
        fileUrl,
        isActive: true,
      },
    });

    return res.status(201).json({ success: true, message: 'Resume uploaded successfully.', data: newResume });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Social Links Management
const createSocialLink = async (req, res) => {
  try {
    const { platform, url, icon, order } = req.body;
    const social = await prisma.socialLink.create({
      data: {
        platform,
        url,
        icon,
        order: parseInt(order) || 0,
      },
    });
    return res.status(201).json({ success: true, data: social });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, icon, order } = req.body;
    const social = await prisma.socialLink.update({
      where: { id },
      data: {
        platform,
        url,
        icon,
        order: parseInt(order) || 0,
      },
    });
    return res.status(200).json({ success: true, data: social });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.socialLink.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Social link deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Contact Messages Inbox
const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 11. Site Settings
const updateSiteSettings = async (req, res) => {
  try {
    const existing = await prisma.siteSettings.findFirst();
    const { siteTitle, metaDescription, themeMode } = req.body;

    let updated;
    if (existing) {
      updated = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { siteTitle, metaDescription, themeMode },
      });
    } else {
      updated = await prisma.siteSettings.create({
        data: { siteTitle, metaDescription, themeMode },
      });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 12. General File Upload Handler
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      fileUrl,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
