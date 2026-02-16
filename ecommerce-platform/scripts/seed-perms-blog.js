const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const blogPerm = { key: 'blog_view', module: 'PRODUCTS', description: 'View Blog' };

    await prisma.permission.upsert({
        where: { key: blogPerm.key },
        update: {},
        create: blogPerm,
    });

    // Also adding other blog permissions just in case
    // No, waiting for explicit instructions. But let's add 'blog_manage' if needed?
    // The user's request was just "Blog/Haber".
    // I will stick to 'blog_view' as it's the one used in NewRolePage logic.

    console.log("Seeded blog_view permission.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
