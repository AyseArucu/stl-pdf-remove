import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkSettings() {
    const settings = await prisma.contactSettings.findFirst();
    console.log('Current Settings:', settings);
}

checkSettings()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
