
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to create a test QR code...');
        const qr = await prisma.qrCode.create({
            data: {
                targetUrl: 'https://example.com',
                name: 'Debug Test QR',
                design: JSON.stringify({ test: 'data' }), // Test JSON field
            },
        });
        console.log('SUCCESS: QR Code created with ID:', qr.id);
    } catch (e) {
        console.error('FAILURE: Could not create QR code.');
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
