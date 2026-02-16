import StlForm from '@/components/admin/StlForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditStlPage({ params }: { params: { id: string } }) {
    const model = await prisma.stlModel.findUnique({
        where: { id: params.id },
        include: { tags: true }
    });

    if (!model) {
        notFound();
    }

    return (
        <main className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Modeli Düzenle</h1>
                <p className="text-gray-500 text-sm mt-1">"{model.name}" modelini düzenliyorsunuz.</p>
            </div>

            <StlForm initialData={model} />
        </main>
    );
}
