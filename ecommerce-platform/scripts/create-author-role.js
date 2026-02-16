const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Create Role
    // The user asked for "haber editörü olarak atadığın rolü"
    // So I'll name it "Haber Editörü" for display, but keep an internal note if needed.
    // Actually, let's stick to "Haber Editörü" as the user seems to prefer Turkish.

    const roleName = "Haber Editörü";
    const desc = "Blog ve haber içeriklerini yönetebilir.";

    // Fetch permissions to assign
    const perms = await prisma.permission.findMany({
        where: {
            key: { in: ['blog_view', 'dashboard_view'] }
        }
    });

    const role = await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: {
            name: roleName,
            description: desc,
            permissions: {
                create: perms.map(p => ({ permissionId: p.id }))
            }
        }
    });

    console.log(`Role '${role.name}' ensured.`);

    // 2. Link existing users with role='AUTHOR' to this new Role
    // This ensures they are seen as having this role in the system
    const updated = await prisma.user.updateMany({
        where: {
            role: 'AUTHOR',
            roleId: null // Only update if not already linked
        },
        data: {
            roleId: role.id
        }
    });

    console.log(`Updated ${updated.count} users to link to '${roleName}' role.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
