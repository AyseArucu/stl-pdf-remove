
// Re-export Prisma types to maintain compatibility during migration
// Eventually, all imports should point directly to '@prisma/client'
export * from '@prisma/client';

// Mock DB object that throws errors to ensure no runtime usage
export const db = {
    read: () => {
        throw new Error('LEGACY DB ADAPTER REMOVED. Use prisma instead.');
    },
    write: () => {
        throw new Error('LEGACY DB ADAPTER REMOVED. Use prisma instead.');
    }
};
