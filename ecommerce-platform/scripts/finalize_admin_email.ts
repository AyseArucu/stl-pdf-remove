
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const correctEmail = 'erashugaming@gmail.com';
    const wrongEmail = 'erashugaming@gail.com';
    const plainPassword = 'Dar2025';

    console.log('Ensuring admin is ONLY:', correctEmail);

    // 1. Ensure correct user exists and is updated
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await prisma.user.upsert({
        where: { email: correctEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            emailVerified: new Date()
        },
        create: {
            email: correctEmail,
            name: 'Erashu Gaming',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            emailVerified: new Date()
        }
    });
    console.log('✅ Updated/Verified:', correctEmail);

    // 2. Delete the wrong user if exists
    try {
        const wrongUser = await prisma.user.findUnique({ where: { email: wrongEmail } });
        if (wrongUser) {
            await prisma.user.delete({ where: { email: wrongEmail } });
            console.log('🗑️ Deleted incorrect user:', wrongEmail);
        } else {
            console.log('ℹ️ Incorrect user not found (Good).');
        }
    } catch (e) {
        console.error('Error deleting wrong user:', e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
