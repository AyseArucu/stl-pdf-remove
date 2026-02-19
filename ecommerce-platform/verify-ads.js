
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const ads = await prisma.advertisement.findMany({ take: 1 });
        console.log('Successfully fetched ads:', ads);
        if (ads.length > 0) {
            console.log('View count of first ad:', ads[0].viewCount);
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
