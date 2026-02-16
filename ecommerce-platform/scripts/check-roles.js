const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const roles = await prisma.role.findMany({
        include: { permissions: true }
    });
    console.log("Roles in DB:", JSON.stringify(roles, null, 2));

    const authorRole = roles.find(r => r.name === 'AUTHOR' || r.name === 'Haber Editörü' || r.name === 'Yazar');
    if (authorRole) {
        console.log("Found Author Role:", authorRole);
    } else {
        console.log("Author role NOT found in DB.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
