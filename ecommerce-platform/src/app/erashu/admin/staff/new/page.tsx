
import { prisma } from '@/lib/prisma';
import { createSubAdmin } from '@/actions/staff-actions';
import { redirect } from 'next/navigation';

export default async function NewStaffPage() {
    const roles = await prisma.role.findMany();

    async function handleSubmit(formData: FormData) {
        'use server';
        await createSubAdmin(formData);
        redirect('/erashu/admin/staff');
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Personel Ekle</h1>

            <form action={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <input name="name" type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" type="email" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Şifre</label>
                    <input name="password" type="password" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Rol Ata</label>
                    {roles.length === 0 ? (
                        <div className="p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
                            Henüz tanımlı bir rol bulunmuyor. Önce <a href="/erashu/admin/roles/new" className="underline font-bold">Rol Eklemeniz</a> gerekmektedir.
                        </div>
                    ) : (
                        <select name="roleId" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                            <option value="">Rol Seçiniz...</option>
                            <option value="AUTHOR" className="font-bold text-purple-700">★ Yazar (Haber Editörü)</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                <button type="submit" className="w-full bg-purple-700 text-white py-2.5 rounded-lg font-medium hover:bg-purple-800 transition shadow-sm mt-4">
                    Personeli Kaydet
                </button>
            </form>
        </div>
    );
}
