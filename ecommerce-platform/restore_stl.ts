
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function main() {
    try {
        // 1. Ensure a default category exists
        let category = await prisma.stlCategory.findFirst({
            where: { name: 'Genel' },
        });

        if (!category) {
            console.log('Creating default category...');
            category = await prisma.stlCategory.create({
                data: {
                    name: 'Genel',
                    slug: 'genel',
                },
            });
        }

        console.log(`Using category: ${category.name} (${category.id})`);

        // 2. Read files
        if (!fs.existsSync(UPLOADS_DIR)) {
            console.error('Uploads directory not found!');
            return;
        }

        const files = fs.readdirSync(UPLOADS_DIR);
        const stlFiles = files.filter(f => f.endsWith('.stl') || f.endsWith('.3mf'));

        console.log(`Found ${stlFiles.length} STL/3MF files.`);

        let restoredCount = 0;

        for (const file of stlFiles) {
            // Check if already exists by filename (assuming fileUrl contains filename)
            const existing = await prisma.stlModel.findFirst({
                where: {
                    fileUrl: {
                        contains: file
                    }
                }
            });

            if (existing) {
                console.log(`Skipping existing model for file: ${file}`);
                continue;
            }

            // Create new record
            // Extract name from filename (remove timestamp prefix if present, e.g. "123456-filename.stl")
            // Typical format: timestamp-random-name.stl or just name.stl
            // Let's just use the filename as name for now, cleaner logic can be added if needed.
            // But looking at file list: "3mf-1771084978739-404290034-batman-p1s.3mf"
            // We can try to make it prettier.

            let name = file;
            const parts = file.split('-');
            if (parts.length > 2) {
                // approximate logic: remove first 2 parts if they look like id/timestamp
                // name = parts.slice(2).join('-').replace(/\.[^/.]+$/, "");
                // Actually, let's keep it simple: just remove extension.
                name = file.replace(/\.[^/.]+$/, "");
            }

            await prisma.stlModel.create({
                data: {
                    name: name,
                    description: 'Otomatik kurtarılan dosya',
                    fileUrl: `/uploads/${file}`,
                    imageUrl: '', // We verify image separately or leave empty
                    categoryId: category.id,
                    price: 0,
                    isFree: true,
                    isActive: true,
                }
            });
            console.log(`Restored: ${name}`);
            restoredCount++;
        }

        console.log(`Recovery complete. Restored ${restoredCount} models.`);

    } catch (error) {
        console.error('Error during recovery:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
