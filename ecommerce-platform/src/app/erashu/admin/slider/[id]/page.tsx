import { prisma } from '@/lib/prisma';
import SliderForm from '@/components/admin/SliderForm';
import { updateHeroSlide, deleteHeroSlide } from '@/app/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import DeleteSlideButton from './DeleteSlideButton';

export default async function EditSlidePage({ params }: { params: { id: string } }) {
    const slide = await prisma.heroSlide.findUnique({
        where: { id: params.id }
    });

    if (!slide) {
        notFound();
    }

    return (
        <main className="container max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/erashu/admin/slider" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Slaytı Düzenle</h1>
                        <p className="text-gray-500 text-sm">Mevcut slayt içeriğini güncelleyin.</p>
                    </div>
                </div>

                <DeleteSlideButton id={slide.id} deleteAction={deleteHeroSlide} />
            </header>

            <SliderForm slide={slide} action={updateHeroSlide} mode="edit" />
        </main>
    );
}
