'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';

interface AdminHeaderProps {
    onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
    const pathname = usePathname();
    const { user } = useUser();

    const getPageTitle = (path: string) => {
        if (path === '/erashu/admin') return 'Genel Bakış';
        if (path.includes('/reports')) return 'Raporlar';
        if (path.includes('/products')) return 'Ürün Yönetimi';
        if (path.includes('/categories')) return 'Kategoriler';
        if (path.includes('/stl-models')) return 'STL Modelleri';
        if (path.includes('/orders')) return 'Siparişler';
        if (path.includes('/discounts')) return 'İndirim Kuponları';
        if (path.includes('/questions')) return 'Müşteri Soruları';
        if (path.includes('/messages')) return 'Mesajlar';
        if (path.includes('/contact-settings')) return 'İletişim Ayarları';
        if (path.includes('/custom-requests')) return 'Özel Site Talepleri';
        if (path.includes('/services')) return 'Hizmet Yönetimi';
        if (path.includes('/reviews')) return 'Ürün Değerlendirmeleri';
        return 'Admin Panel';
    };

    const title = getPageTitle(pathname);

    return (
        <header style={{
            height: '80px',
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem', // Reduced padding for mobile
            position: 'sticky',
            top: 0,
            zIndex: 40
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Hamburger Button */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden" // Hidden on large screens
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        padding: '0.5rem',
                        display: 'flex', // ensure it shows up if class logic fails or verify screen size in logic
                    }}
                >
                    ☰
                </button>

                {/* Page Title */}
                <div>
                    <h1 style={{
                        fontSize: '1.2rem', // Slightly smaller for mobile safety
                        fontWeight: 700,
                        color: 'var(--primary)',
                        margin: 0
                    }} className="md:text-2xl">
                        {title}
                    </h1>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }} className="hidden md:inline-block">
                        Erashu Yönetim Paneli
                    </span>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                {/* Search Bar (Visual Only) */}
                <div style={{
                    position: 'relative',
                    display: 'none', // Hidden on small screens if needed, or flex
                }} className="hidden md:block">
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Ara..."
                        style={{
                            padding: '0.6rem 1rem 0.6rem 2.5rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: '#f8fafc',
                            width: '240px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            color: 'var(--text)'
                        }}
                    />
                </div>

                {/* Notifications */}
                <button style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#64748b',
                    fontSize: '1.2rem',
                    transition: 'color 0.2s'
                }}>
                    <FaBell />
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '6px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        border: '1px solid white'
                    }}></span>
                </button>

                {/* Profile Divider */}
                <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border)' }} className="hidden md:block"></div>

                {/* Profile */}
                <Link href="/erashu/admin/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }} className="hidden md:flex">
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                                {user?.name || 'Admin'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Yönetici
                            </span>
                        </div>
                        <div style={{
                            width: '32px', // Smaller mobile avatar
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--secondary)',
                            fontSize: '1.2rem',
                            border: '1px solid var(--border)'
                        }} className="md:w-10 md:h-10 md:text-xl">
                            <FaUserCircle />
                        </div>
                    </div>
                </Link>
            </div>
        </header>
    );
}
