
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log("Admin user not found. Creating...");
        user = await prisma.user.create({
            data: {
                email,
                name: 'Admin User',
                role: 'ADMIN',
                password: 'plain_text_password_placeholder_if_needed' // In a real app, hash this.
            }
        });
        console.log("Admin user created:", user.id);
    } else {
        console.log("Admin user exists:", user.id);
        if (user.role !== 'ADMIN') {
            console.log("Updating role to ADMIN");
            user = await prisma.user.update({
                where: { email },
                data: { role: 'ADMIN' }
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
