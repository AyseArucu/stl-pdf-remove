
import { prisma } from '@/lib/prisma';

export default async function AccessDBPage() {
    let count = -1;
    try {
        count = await prisma.user.count();
    } catch (e) {
        return <div className="text-red-500">Error: {String(e)}</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold text-blue-600">DB Access Works!</h1>
            <p>User count: {count}</p>
        </div>
    );
}
