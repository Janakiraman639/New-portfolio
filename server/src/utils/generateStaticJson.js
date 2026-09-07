const path = require('path');
const fs = require('fs');
const prisma = require('./prisma');

/**
 * Generates a static portfolio.json file from the database.
 * This file is placed in client/public/ so Vite serves it as a static asset.
 * Called automatically after every admin CRUD operation.
 */
const generateStaticJson = async () => {
  try {
    // Fetch all portfolio data (same logic as publicController.getFullPortfolio)
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

    // Parse technologies JSON strings into arrays
    const parsedProjects = projects.map((p) => {
      let techs = [];
      try {
        techs = JSON.parse(p.technologies);
      } catch (e) {
        techs = p.technologies
          ? p.technologies.split(',').map((t) => t.trim())
          : [];
      }
      return { ...p, technologies: techs };
    });

    const parsedExperiences = experiences.map((exp) => {
      let techs = [];
      if (exp.technologies) {
        try {
          techs = JSON.parse(exp.technologies);
        } catch (e) {
          techs = exp.technologies
            ? exp.technologies.split(',').map((t) => t.trim())
            : [];
        }
      }
      return { ...exp, technologies: techs };
    });

    // Build the portfolio data object
    const portfolioData = {
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
      generatedAt: new Date().toISOString(),
    };

    // Write to client/public/portfolio.json
    const outputPath = path.resolve(
      __dirname,
      '../../../client/public/portfolio.json'
    );

    // Ensure the directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(portfolioData, null, 2), 'utf-8');

    console.log(`✅ Static portfolio.json generated at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('❌ Error generating static portfolio.json:', error.message);
    // Don't throw — we don't want JSON generation failure to break admin operations
  }
};

module.exports = generateStaticJson;
