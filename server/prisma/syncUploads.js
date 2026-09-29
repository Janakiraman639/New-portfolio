const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mimeMap = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

async function syncUploads() {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found.');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`Found ${files.length} local files in uploads folder.`);

  let latestPassportPhoto = null;

  for (const filename of files) {
    const ext = path.extname(filename).toLowerCase();
    const mimeType = mimeMap[ext] || 'application/octet-stream';
    const filePath = path.join(uploadsDir, filename);
    const stats = fs.statSync(filePath);

    if (!stats.isFile()) continue;

    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    if (filename.includes('passport_photo') || filename.includes('janakiraman')) {
      latestPassportPhoto = `/uploads/${filename}`;
    }

    try {
      await prisma.uploadedFile.upsert({
        where: { filename },
        update: {
          mimeType,
          data: base64Data,
          size: stats.size,
        },
        create: {
          filename,
          mimeType,
          data: base64Data,
          size: stats.size,
        },
      });
      console.log(`Synced: ${filename}`);
    } catch (err) {
      console.error(`Error syncing ${filename}:`, err.message);
    }
  }

  // Update profile avatarUrl if it was pointing to a lost Vercel tmp upload
  if (latestPassportPhoto) {
    const profile = await prisma.profile.findFirst();
    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { avatarUrl: latestPassportPhoto },
      });
      console.log(`Updated Profile avatarUrl to: ${latestPassportPhoto}`);
    }
  }

  console.log('Upload sync completed successfully!');
}

syncUploads()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
