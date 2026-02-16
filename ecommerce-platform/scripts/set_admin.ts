
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'erashugaming@gmail.com';
    const password = 'Dar2025';

    console.log(`Setting up admin user: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                emailVerified: new Date(),
                isActive: true
            },
            create: {
                email,
                name: 'Erashu Admin',
                password: hashedPassword,
                role: 'ADMIN',
                image: 'https://ui-avatars.com/api/?name=Erashu+Admin',
                emailVerified: new Date(),
                isActive: true
            },
        });

        console.log(`Successfully updated/created admin user:`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`ID: ${user.id}`);
    } catch (error) {
        console.error('Error updating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
