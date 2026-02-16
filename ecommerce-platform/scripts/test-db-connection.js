// test-db-connectivity.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);

        const heroCount = await prisma.heroSlide.count();
        console.log(`HeroSlide count: ${heroCount}`);

        const blogCount = await prisma.blogPost.count();
        console.log(`BlogPost count: ${blogCount}`);

        // Try to fetch one of each to ensure data integrity
        const slide = await prisma.heroSlide.findFirst();
        if (slide) console.log('Successfully fetched a HeroSlide');

        const post = await prisma.blogPost.findFirst();
        if (post) console.log('Successfully fetched a BlogPost');

    } catch (e) {
        console.error('Connection/Query failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
