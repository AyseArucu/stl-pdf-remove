
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking HeroSlide table...');
        // Set a timeout for the query to fail fast if locked
        const slides = await prisma.heroSlide.findMany({
            take: 1
        });
        console.log('Success! Slides found:', slides.length);
    } catch (e) {
        console.log('Error querying HeroSlide:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
