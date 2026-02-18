import { getStlModels } from '@/app/actions';
import StlCard from '@/components/StlCard';
import AdminStlUpload from '@/components/AdminStlUpload';
import StlFilterableList from '@/components/StlFilterableList';
import { cookies } from 'next/headers';

export const metadata = {
    title: '3D Modeller & STL Dosyaları | ERASHU',
    description: '3D yazıcılar için hazırlanmış STL dosyalarını inceleyebilir, indirebilir veya satın alabilirsiniz.',
};

export default async function StlModelsPage() {
    const models = await getStlModels();

    // Check admin role
    const session = (await cookies()).get('user_session')?.value;
    let isAdmin = false;
    if (session) {
        const user = JSON.parse(session);
        isAdmin = user.role === 'ADMIN' || user.email === 'admin@erashu.com';
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">3D Modeller & STL Dosyaları</h1>
                    <p className="text-gray-500 mt-1">
                        3D yazıcılarınız için hazır modelleri keşfedin.
                    </p>
                </div>
                {isAdmin && <AdminStlUpload />}
            </div>

            <StlFilterableList models={models} />
        </main>
    );
}
