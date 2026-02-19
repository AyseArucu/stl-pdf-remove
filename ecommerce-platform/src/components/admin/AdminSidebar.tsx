'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaArrowLeft,
    FaSignOutAlt
} from 'react-icons/fa';
import { logout } from '@/app/erashu/admin/auth';
import { useAdmin } from '@/context/AdminContext';
import { ADMIN_MENU_ITEMS } from '@/lib/admin-menu-config';

interface AdminSidebarProps {
    isOpen?: boolean;
    isMobile?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, isMobile = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { t, permissions } = useAdmin();

    // Hide sidebar on login page
    if (pathname.includes('/login')) {
        return null;
    }

    const menuItems = ADMIN_MENU_ITEMS;
    const isActive = (path: string) => pathname.startsWith(path);

    // If mobile and not open, don't render (or hide via css)
    // We'll use CSS transform for smooth transition if desired, or just conditional rendering.
    // For simplicity with the existing style prop approach:
    if (!isOpen && isMobile) return null;

    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#2d0a31', // var(--primary)
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: isMobile ? 'fixed' : 'sticky',
            top: 0,
            left: 0,
            zIndex: 50,
            overflowY: 'auto',
            boxShadow: isMobile ? '4px 0 12px rgba(0,0,0,0.2)' : 'none'
        }}>
            {/* Logo Area */}
            <div style={{
                padding: '2rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
                        Erashu Gaming
                    </h2>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Admin Panel</span>
                </div>

                {/* Close Button for Mobile */}
                {isMobile && (
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    <FaArrowLeft /> {t.backToSite}
                </Link>

                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={isMobile ? onClose : undefined} // Close on click on mobile
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.85rem 1rem',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            backgroundColor: isActive(item.href) ? '#d946ef' : 'transparent', // var(--accent) for active
                            color: isActive(item.href) ? 'white' : 'rgba(255,255,255,0.8)',
                            fontWeight: isActive(item.href) ? 600 : 400
                        }}
                    >
                        {typeof item.icon === 'function' ? <item.icon /> : item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User/Logout */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <form action={logout}>
                    <button type="submit" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        width: '100%',
                        padding: '0.5rem',
                        transition: 'color 0.2s',
                        // hover handled by css if possible or accept simple style
                    }}
                        className="hover:text-red-500"
                    >
                        <FaSignOutAlt /> {t.logout}
                    </button>
                </form>
            </div>
        </aside>
    );
}
