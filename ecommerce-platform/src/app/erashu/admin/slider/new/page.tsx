import SliderForm from '@/components/admin/SliderForm';
import { createHeroSlide } from '@/app/actions';
import Link from 'next/link';

export default function NewSlidePage() {
    return (
        <main className="container max-w-4xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/erashu/admin/slider" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    ←
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Yeni Slayt Ekle</h1>
                    <p className="text-gray-500 text-sm">Ana sayfa slider alanına yeni bir içerik ekleyin.</p>
                </div>
            </header>

            <SliderForm action={createHeroSlide} mode="create" />
        </main>
    );
}
