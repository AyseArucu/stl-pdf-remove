
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'erashugaming@gmail.com';
    const plainPassword = 'Dar2025';

    console.log(`Checking user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User NOT found in database.');

        // Check if maybe gail.com exists?
        const gailUser = await prisma.user.findUnique({
            where: { email: 'erashugaming@gail.com' }
        });
        if (gailUser) {
            console.log('⚠️ Found user with gail.com instead!');
        }
    } else {
        console.log('✅ User found.');
        console.log(`Role: ${user.role}`);
        console.log(`Hash in DB: ${user.password}`);

        const match = await bcrypt.compare(plainPassword, user.password || '');
        if (match) {
            console.log('✅ Password match: SUCCESS');
        } else {
            console.log('❌ Password match: FAILED');

            // Try to re-hash and see if it helps? NO, compare should work.
        }
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
