
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const result = await prisma.$queryRaw`SELECT 1`;
        // JSON serialization of BigInt (if any) might fail, usually SELECT 1 returns integer or array of objects.
        // SQLite: [{ '1': 1 }] or similar.
        // To be safe with JSON.stringify on BigInt if it returns that (unlikely for SELECT 1 but checking):
        const processedResult = JSON.parse(JSON.stringify(result, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));

        return NextResponse.json({ success: true, result: processedResult });
    } catch (error) {
        console.error('Test DB Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
