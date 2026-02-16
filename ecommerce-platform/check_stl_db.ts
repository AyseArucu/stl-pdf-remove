
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.stlModel.count();
        console.log(`Total StlModels: ${count}`);

        const models = await prisma.stlModel.findMany({
            take: 5,
        });
        console.log('Sample models:', JSON.stringify(models, null, 2));
    } catch (error) {
        console.error('Error fetching models:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
