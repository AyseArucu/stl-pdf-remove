'use server';

import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma';

export async function checkUserSession() {
    const session = cookies().get('user_session')?.value;
    if (!session) return null;
    try {
        const user = JSON.parse(session);
        // Check DB to get latest status (e.g. emailVerified)
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        return dbUser;
    } catch (e) {
        return null;
    }
}
