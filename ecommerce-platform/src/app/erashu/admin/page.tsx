import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { checkUserSession } from '@/app/actions/auth';

import { getUserPermissions, PERMISSIONS } from '@/lib/rbac';

export default async function AdminPage() {
    const user = await checkUserSession();
    if (!user) {
        redirect('/erashu/admin/login');
    }

    // Fetch Permissions
    const permissions = await getUserPermissions(user.id);
    const can = (key: string) => permissions.includes(key);

    const [registeredUserCount, blogPostCount] = await Promise.all([
        can(PERMISSIONS.USERS_VIEW) ? prisma.user.count() : Promise.resolve(0),
        can(PERMISSIONS.BLOG_VIEW) ? prisma.blogPost.count({ where: user.role === 'AUTHOR' ? { authorId: user.id } : {} }) : Promise.resolve(0)
    ]);

    const cards = [
        {
            title: 'Kayıtlı Üyeler',
            value: registeredUserCount,
            link: '/erashu/admin/users',
            color: 'text-indigo-600',
            linkText: 'Üyeleri Görüntüle',
            locked: !can(PERMISSIONS.USERS_VIEW)
        },
        {
            title: 'Blog Yazıları',
            value: blogPostCount,
            link: '/erashu/admin/blog',
            color: 'text-purple-600',
            linkText: 'Yazıları Yönet',
            locked: !can(PERMISSIONS.BLOG_VIEW)
        },
    ];

    const modules = [
        {
            title: 'Blog / Haberler',
            desc: 'İçerik yönetimi',
            link: '/erashu/admin/blog',
            icon: '📝',
            locked: !can(PERMISSIONS.BLOG_VIEW)
        },
        {
            title: 'Haber Yorumları',
            desc: 'Yazı yorumlarını yönet',
            link: '/erashu/admin/blog/comments',
            icon: '💬',
            locked: !can(PERMISSIONS.BLOG_VIEW)
        },
        {
            title: 'Personel Yönetimi',
            desc: 'Yönetici ve yazarlar',
            link: '/erashu/admin/staff',
            icon: '👥',
            locked: !can(PERMISSIONS.STAFF_MANAGE)
        },
        {
            title: '3D Modeller (STL)',
            desc: 'Model yükle, düzenle, sil',
            link: '/erashu/admin/stl-models',
            icon: '🧊',
            locked: !can(PERMISSIONS.PRODUCTS_EDIT)
        },
        {
            title: 'İletişim Ayarları',
            desc: 'Adres ve iletişim bilgilerini düzenle',
            link: '/erashu/admin/contact-settings',
            icon: '📍',
            locked: !can(PERMISSIONS.SETTINGS_VIEW)
        },
    ];

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-100" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Yönetici Paneli</h1>
                    <p className="text-gray-500" style={{ color: '#6b7280' }}>Mağazanızın durumunu buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center gap-2 font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#111827', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
                    <span>Mağazaya Dön</span>
                    <span>→</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {cards.map((card, idx) => (
                    <div key={idx} className={`relative overflow-hidden rounded-2xl shadow-sm border transition-all duration-300 ${card.locked ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' : 'bg-white border-gray-100 hover:shadow-md'}`} style={{ padding: '1.5rem', borderRadius: '1rem', border: card.locked ? '1px solid #e5e7eb' : '1px solid #f3f4f6', backgroundColor: card.locked ? '#f3f4f6' : 'white' }}>

                        {/* Lock Overlay */}
                        {card.locked && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/50 backdrop-blur-[1px]">
                                <span className="text-4xl">🔒</span>
                            </div>
                        )}

                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.1, fontSize: '3rem' }}>
                            {idx === 0 ? '👥' : '📝'}
                        </div>
                        <h2 className="text-sm font-medium text-gray-500 mb-1" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>{card.title}</h2>

                        {card.locked ? (
                            <p className="text-2xl font-bold mb-4 text-gray-400">---</p>
                        ) : (
                            <p className={`text-2xl font-bold mb-4 ${card.color}`} style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{card.value}</p>
                        )}

                        {card.locked ? (
                            <span className="text-sm font-medium text-gray-400 flex items-center gap-1 cursor-not-allowed">
                                Erişim Yok <span className="text-xs">🔒</span>
                            </span>
                        ) : (
                            <Link href={card.link} className="text-sm font-medium text-gray-600 hover:text-purple-700 flex items-center gap-1 transition-colors" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                                {card.linkText} <span className="text-xs" style={{ fontSize: '0.75rem' }}>➜</span>
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Modules Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="w-1 h-6 bg-purple-600 rounded-full" style={{ width: '4px', height: '24px', backgroundColor: '#9333ea', borderRadius: '9999px', display: 'block' }}></span>
                    Hızlı Erişim
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {modules.map((mod, idx) => {
                        const Content = (
                            <>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${mod.locked ? 'bg-gray-200 text-gray-400' : 'bg-gray-50'}`} style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                                    {mod.icon}
                                </div>
                                <h3 className={`text-lg font-bold mb-1 ${mod.locked ? 'text-gray-500' : 'text-gray-900'}`} style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{mod.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.625 }}>{mod.desc}</p>
                                {mod.locked && <div className="absolute top-4 right-4 text-gray-400 text-xl">🔒</div>}
                            </>
                        );

                        if (mod.locked) {
                            return (
                                <div key={idx} className="bg-gray-100 p-6 rounded-2xl shadow-sm border border-gray-200 relative opacity-70 cursor-not-allowed" style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', position: 'relative' }}>
                                    {Content}
                                </div>
                            );
                        }

                        return (
                            <Link key={idx} href={mod.link} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6', textDecoration: 'none', display: 'block', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                                {Content}
                            </Link>
                        );
                    })}

                    <Link href="/erashu/admin/blog/new" className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-sm border border-dashed border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer h-full min-h-[180px]" style={{ background: 'linear-gradient(to bottom right, #faf5ff, #ffffff)', padding: '1.5rem', borderRadius: '1rem', border: '1px dashed #d8b4fe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '180px', textDecoration: 'none' }}>
                        <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-3" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '9999px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.875rem', marginBottom: '0.75rem' }}>+</div>
                        <h3 className="text-lg font-bold text-gray-800" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937' }}>Yeni Haber Ekle</h3>
                        <p className="text-sm text-gray-500 mt-1" style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Blog/Haber girişi yap</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
