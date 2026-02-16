import StlForm from '@/components/admin/StlForm';

export default function NewStlPage() {
    return (
        <main className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Yeni STL Modeli Ekle</h1>
                <p className="text-gray-500 text-sm mt-1">Yeni bir 3D model eklemek için formu doldurun.</p>
            </div>

            <StlForm />
        </main>
    );
}
