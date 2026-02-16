
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./dev.db"
        }
    }
});

async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('DB Connection Success:', JSON.stringify(result, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
    } catch (e) {
        console.error('DB Connection Failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
