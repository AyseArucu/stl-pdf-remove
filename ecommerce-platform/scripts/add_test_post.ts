import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Script DATABASE_URL:', process.env.DATABASE_URL);
    const countBefore = await prisma.blogPost.count();
    console.log('Count before:', countBefore);

    await prisma.blogPost.create({
        data: {
            title: 'Test Horizontal Card Post',
            slug: 'test-horizontal-card-' + Date.now(),
            content: 'This is a test post to verify the horizontal card layout.',
            excerpt: 'This post should appear in the new wide dark card format.',
            coverImage: 'https://placehold.co/600x400/1a1a1a/FFF',
            category: 'Teknoloji',
            author: 'Tester',
            published: true,
            images: '[]'
        }
    });
    console.log('Test post created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
