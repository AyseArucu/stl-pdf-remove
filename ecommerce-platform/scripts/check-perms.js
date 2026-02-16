const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const permissions = await prisma.permission.findMany();
    console.log("Existing Permissions:", JSON.stringify(permissions, null, 2));

    const blogPerm = permissions.find(p => p.key === 'blog_view');
    if (!blogPerm) {
        console.log("ALERT: blog_view permission is MISSING!");
    } else {
        console.log("blog_view is present:", blogPerm);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
