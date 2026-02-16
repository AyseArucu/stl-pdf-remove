
import { seedPermissions } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

async function main() {
    console.log('Seeding permissions...');
    await seedPermissions();
    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
