
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking PasswordResetToken table...');
        const count = await prisma.passwordResetToken.count();
        console.log('Success! Table exists. Count:', count);
    } catch (e) {
        console.error('Error connecting or querying table:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
