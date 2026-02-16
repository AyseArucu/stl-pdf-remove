
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Updating admin password...");
    // Update password to '123123' to match the easy login check or what user expects
    await prisma.user.updateMany({
        where: { email: 'admin@example.com' },
        data: { password: '123123' }
    });
    console.log("Admin password updated to '123123'");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
