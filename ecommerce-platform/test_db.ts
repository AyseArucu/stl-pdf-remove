import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
    console.log('Connecting to Prisma...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Query successful, found users:', users.length);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
