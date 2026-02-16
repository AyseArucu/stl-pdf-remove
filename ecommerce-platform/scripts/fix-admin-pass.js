
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = '123123';

    console.log(`Hashing password for ${email}...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Updating admin user...");
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN' // Ensure role is correct
        },
        create: {
            email,
            name: 'Admin User',
            role: 'ADMIN',
            password: hashedPassword
        }
    });

    console.log(`Admin user updated/created with ID: ${user.id}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
