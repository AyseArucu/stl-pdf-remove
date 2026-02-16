
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const plainPassword = 'Dar2025';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Update/Create 'erashugaming@gmail.com'
    await prisma.user.upsert({
        where: { email: 'erashugaming@gmail.com' },
        update: { password: hashedPassword, role: 'ADMIN', isActive: true },
        create: { email: 'erashugaming@gmail.com', name: 'Erashu (Gmail)', password: hashedPassword, role: 'ADMIN', isActive: true }
    });

    // Update/Create 'erashugaming@gail.com' (Just in case user types typo)
    await prisma.user.upsert({
        where: { email: 'erashugaming@gail.com' },
        update: { password: hashedPassword, role: 'ADMIN', isActive: true },
        create: { email: 'erashugaming@gail.com', name: 'Erashu (Gail)', password: hashedPassword, role: 'ADMIN', isActive: true }
    });

    console.log('✅ Updated credentials for BOTH @gmail.com and @gail.com');
    console.log('You can now login with either email.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
