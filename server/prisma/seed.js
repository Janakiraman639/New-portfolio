const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio database...');

  // 1. Create or update Admin User
  const adminEmail = 'admin@portfolio.com';
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash('AdminPass123!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created: admin@portfolio.com / AdminPass123!');
  }

  // 2. Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: 'Janakiraman',
        title: 'Senior AI/ML Engineer & Full-Stack Architect',
        shortBio: 'Building next-generation intelligent systems, LLM agents, and scalable cloud architectures.',
        aboutText: 'I am a passionate AI/ML Engineer and Senior Software Developer with over 5 years of experience architecting end-to-end machine learning pipelines, deep learning models, and high-performance web applications. My core expertise spans Large Language Models (LLMs), Computer Vision, MLOps, Node.js, and modern React environments.',
        avatarUrl: '/uploads/avatar-default.png',
        location: 'Bengaluru, India',
        email: 'janakiraman.ai@example.com',
        phone: '+91 98765 43210',
        availableForWork: true,
      },
    });
    console.log('Profile seeded.');
  }

  // 3. Skill Categories & Skills
  const categories = [
    {
      name: 'AI & Machine Learning',
      order: 1,
      skills: [
        { name: 'PyTorch', proficiency: 95, icon: 'Brain', order: 1 },
        { name: 'TensorFlow / Keras', proficiency: 90, icon: 'Cpu', order: 2 },
        { name: 'LLMs & RAG (LangChain / LlamaIndex)', proficiency: 92, icon: 'Bot', order: 3 },
        { name: 'Transformers & HuggingFace', proficiency: 90, icon: 'Sparkles', order: 4 },
        { name: 'Computer Vision (OpenCV)', proficiency: 88, icon: 'Eye', order: 5 },
      ],
    },
    {
      name: 'Programming Languages',
      order: 2,
      skills: [
        { name: 'Python', proficiency: 98, icon: 'Code', order: 1 },
        { name: 'TypeScript / JavaScript', proficiency: 92, icon: 'FileCode', order: 2 },
        { name: 'C++', proficiency: 82, icon: 'Terminal', order: 3 },
        { name: 'SQL', proficiency: 90, icon: 'Database', order: 4 },
      ],
    },
    {
      name: 'Backend & Data Engineering',
      order: 3,
      skills: [
        { name: 'Node.js / Express', proficiency: 94, icon: 'Server', order: 1 },
        { name: 'FastAPI', proficiency: 92, icon: 'Zap', order: 2 },
        { name: 'PostgreSQL & SQLite', proficiency: 88, icon: 'Database', order: 3 },
        { name: 'Vector DBs (Pinecone, Chroma)', proficiency: 86, icon: 'Layers', order: 4 },
        { name: 'Redis', proficiency: 84, icon: 'HardDrive', order: 5 },
      ],
    },
    {
      name: 'Frontend & Cloud / MLOps',
      order: 4,
      skills: [
        { name: 'React.js', proficiency: 90, icon: 'Layout', order: 1 },
        { name: 'Tailwind CSS', proficiency: 92, icon: 'Palette', order: 2 },
        { name: 'Docker & Kubernetes', proficiency: 85, icon: 'Box', order: 3 },
        { name: 'AWS & GCP', proficiency: 84, icon: 'Cloud', order: 4 },
        { name: 'MLflow & MLOps Pipeline', proficiency: 86, icon: 'GitBranch', order: 5 },
      ],
    },
  ];

  for (const catData of categories) {
    const existingCat = await prisma.skillCategory.findUnique({ where: { name: catData.name } });
    if (!existingCat) {
      await prisma.skillCategory.create({
        data: {
          name: catData.name,
          order: catData.order,
          skills: {
            create: catData.skills,
          },
        },
      });
    }
  }
  console.log('Skill Categories & Skills seeded.');

  // 4. Projects
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'NeuroAgent RAG Framework',
          shortDesc: 'Autonomous multi-modal RAG agent powered by DeepSeek & LlamaIndex for enterprise document intelligence.',
          fullDesc: 'NeuroAgent is an enterprise-grade retrieval-augmented generation framework capable of parsing complex tabular and unstructured PDFs, converting them into vector embeddings, and executing autonomous multi-step reasoning queries with real-time web verification.',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
          githubUrl: 'https://github.com/example/neuroagent-rag',
          liveUrl: 'https://neuroagent-demo.example.com',
          technologies: JSON.stringify(['Python', 'PyTorch', 'LangChain', 'FastAPI', 'ChromaDB', 'React']),
          featured: true,
          order: 1,
        },
        {
          title: 'VisionVision Realtime Analytics',
          shortDesc: 'Edge-AI Computer Vision suite for industrial quality assurance and object tracking.',
          fullDesc: 'High-throughput computer vision pipeline deployed on edge nodes with TensorRT acceleration. Features real-time defect detection, dynamic spatial heatmaps, and low-latency websocket alerts.',
          imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
          githubUrl: 'https://github.com/example/visionvision-ai',
          liveUrl: 'https://visionvision.example.com',
          technologies: JSON.stringify(['Python', 'OpenCV', 'YOLOv8', 'TensorRT', 'Node.js', 'WebSockets']),
          featured: true,
          order: 2,
        },
        {
          title: 'GenAI Code Review Bot',
          shortDesc: 'Automated GitHub pull request reviewer leveraging LLMs for static analysis and security vulnerabilities.',
          fullDesc: 'Integration tool that hooks into GitHub Actions to perform deep contextual code reviews, identify memory leaks, security vulnerabilities, and produce optimized code suggestion diffs.',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
          githubUrl: 'https://github.com/example/genai-code-reviewer',
          liveUrl: 'https://codereview-ai.example.com',
          technologies: JSON.stringify(['TypeScript', 'Node.js', 'OpenAI API', 'GitHub REST API', 'Docker']),
          featured: true,
          order: 3,
        },
      ],
    });
    console.log('Projects seeded.');
  }

  // 5. Experience
  const existingExp = await prisma.experience.count();
  if (existingExp === 0) {
    await prisma.experience.createMany({
      data: [
        {
          company: 'Nexus AI Solutions',
          role: 'Lead AI Engineer',
          location: 'Bengaluru, India',
          startDate: '2023 - Present',
          endDate: 'Present',
          isCurrent: true,
          description: 'Architecting LLM orchestration platforms, fine-tuning open-source models (Llama 3, Mistral), and scaling inference microservices serving 1M+ daily active requests.',
          technologies: JSON.stringify(['PyTorch', 'vLLM', 'FastAPI', 'Docker', 'Kubernetes', 'AWS']),
          order: 1,
        },
        {
          company: 'Quantum Byte Systems',
          role: 'Senior Full Stack Developer & Data Scientist',
          location: 'Bengaluru, India',
          startDate: '2021 - 2023',
          endDate: '2023',
          isCurrent: false,
          description: 'Developed scalable predictive analytics dashboards and modern React client applications integrated with Python backend engines.',
          technologies: JSON.stringify(['Python', 'React', 'Node.js', 'PostgreSQL', 'Redis']),
          order: 2,
        },
      ],
    });
    console.log('Experience seeded.');
  }

  // 6. Education
  const existingEdu = await prisma.education.count();
  if (existingEdu === 0) {
    await prisma.education.createMany({
      data: [
        {
          degree: 'M.Tech in Artificial Intelligence & Computer Science',
          institution: 'Indian Institute of Technology (IIT)',
          startYear: '2019',
          endYear: '2021',
          grade: '9.4 / 10 CGPA',
          description: 'Specialization in Machine Learning Theory, Neural Networks, and Distributed Data Systems. Published thesis on efficient Transformer quantization.',
          order: 1,
        },
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'National Institute of Technology (NIT)',
          startYear: '2015',
          endYear: '2019',
          grade: '8.9 / 10 CGPA',
          description: 'Solid foundation in Data Structures, Algorithms, Database Management, and Software Engineering principles.',
          order: 2,
        },
      ],
    });
    console.log('Education seeded.');
  }

  // 7. Certifications
  const existingCert = await prisma.certification.count();
  if (existingCert === 0) {
    await prisma.certification.createMany({
      data: [
        {
          name: 'AWS Certified Machine Learning – Specialty',
          issuer: 'Amazon Web Services',
          issueDate: '2023',
          credentialUrl: 'https://aws.amazon.com/verification',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop',
          order: 1,
        },
        {
          name: 'TensorFlow Developer Certified',
          issuer: 'Google Cloud & DeepLearning.AI',
          issueDate: '2022',
          credentialUrl: 'https://coursera.org/verify/tensorflow',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop',
          order: 2,
        },
      ],
    });
    console.log('Certifications seeded.');
  }

  // 8. Social Links
  const existingSocial = await prisma.socialLink.count();
  if (existingSocial === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: 'GitHub', url: 'https://github.com/janakiraman-ai', icon: 'Github', order: 1 },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/janakiraman-ai', icon: 'Linkedin', order: 2 },
        { platform: 'Twitter / X', url: 'https://twitter.com/janakiraman_ai', icon: 'Twitter', order: 3 },
        { platform: 'Kaggle', url: 'https://kaggle.com/janakiraman', icon: 'Globe', order: 4 },
      ],
    });
    console.log('Social Links seeded.');
  }

  // 9. Resume
  const existingResume = await prisma.resume.findFirst();
  if (!existingResume) {
    await prisma.resume.create({
      data: {
        title: 'Janakiraman_AI_ML_Engineer_Resume.pdf',
        fileUrl: '/uploads/sample-resume.pdf',
        isActive: true,
      },
    });
    console.log('Resume record seeded.');
  }

  // 10. Site Settings
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteTitle: 'Janakiraman | AI & ML Engineer Portfolio',
        metaDescription: 'Official portfolio of Janakiraman - Lead AI/ML Engineer, Full Stack Architect & Tech Innovator.',
        themeMode: 'dark',
      },
    });
    console.log('Site Settings seeded.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
