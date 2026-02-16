
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: 'dashboard_view',

    // Users
    USERS_VIEW: 'users_view',
    USERS_EDIT: 'users_edit',

    // Products
    PRODUCTS_VIEW: 'products_view',
    PRODUCTS_EDIT: 'products_edit',

    // Orders
    ORDERS_VIEW: 'orders_view',
    ORDERS_EDIT: 'orders_edit',

    // Settings
    SETTINGS_VIEW: 'settings_view',

    // Roles & Staff
    ROLES_MANAGE: 'roles_manage',
    STAFF_MANAGE: 'staff_manage',
};

const MODULES = {
    DASHBOARD: 'DASHBOARD',
    USERS: 'USERS',
    PRODUCTS: 'PRODUCTS',
    ORDERS: 'ORDERS',
    SETTINGS: 'SETTINGS',
    SYSTEM: 'SYSTEM',
};

async function main() {
    console.log("Seeding Permissions...");

    const permissions = [
        { key: PERMISSIONS.DASHBOARD_VIEW, module: MODULES.DASHBOARD, description: "View Dashboard" },

        { key: PERMISSIONS.USERS_VIEW, module: MODULES.USERS, description: "View Users List" },
        { key: PERMISSIONS.USERS_EDIT, module: MODULES.USERS, description: "Edit/Delete Users" },

        { key: PERMISSIONS.PRODUCTS_VIEW, module: MODULES.PRODUCTS, description: "View Products" },
        { key: PERMISSIONS.PRODUCTS_EDIT, module: MODULES.PRODUCTS, description: "Create/Edit/Delete Products" },

        { key: PERMISSIONS.ORDERS_VIEW, module: MODULES.ORDERS, description: "View Orders" },
        { key: PERMISSIONS.ORDERS_EDIT, module: MODULES.ORDERS, description: "Manage Orders" },

        { key: PERMISSIONS.SETTINGS_VIEW, module: MODULES.SETTINGS, description: "View Settings" },

        { key: PERMISSIONS.ROLES_MANAGE, module: MODULES.SYSTEM, description: "Manage Roles & Permissions" },
        { key: PERMISSIONS.STAFF_MANAGE, module: MODULES.SYSTEM, description: "Manage Sub Admins" },
    ];

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { key: p.key },
            update: {},
            create: p,
        });
    }
    console.log("Permissions seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
