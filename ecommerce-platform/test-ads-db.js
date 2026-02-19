
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    try {
        const ads = await prisma.advertisement.findMany();
        console.log('Successfully fetched ' + ads.length + ' ads.');
        console.log('Ads:', JSON.stringify(ads, null, 2));
    } catch (e) {
        console.error('Error fetching ads:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
