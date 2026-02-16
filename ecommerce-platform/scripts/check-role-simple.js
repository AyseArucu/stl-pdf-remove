const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const authorRole = await prisma.role.findFirst({
        where: {
            OR: [
                { name: 'AUTHOR' },
                { name: 'Haber Editörü' },
                { name: 'Yazar' }
            ]
        }
    });

    if (authorRole) {
        console.log("FOUND: " + authorRole.name);
    } else {
        console.log("NOT FOUND");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
