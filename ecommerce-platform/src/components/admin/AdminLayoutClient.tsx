'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminProvider } from '@/context/AdminContext';
import AdminGuard from '@/components/admin/AdminGuard';

interface AdminLayoutClientProps {
    children: React.ReactNode;
    isAdmin: boolean;
    permissions: string[];
}

export default function AdminLayoutClient({ children, isAdmin, permissions }: AdminLayoutClientProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Monitor screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true); // Always open on desktop
            } else {
                setSidebarOpen(false); // Default closed on mobile
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Toggle Sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <AdminProvider initialPermissions={permissions}>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', position: 'relative' }}>

                {/* Overlay for mobile when sidebar is open */}
                {isMobile && isSidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 45
                        }}
                    />
                )}

                {/* Sidebar */}
                {isAdmin && (
                    <AdminSidebar
                        isOpen={isSidebarOpen}
                        isMobile={isMobile}
                        onClose={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <AdminHeader onToggleSidebar={toggleSidebar} />

                    {/* Page Content */}
                    <main style={{ padding: isMobile ? '1rem' : '2rem', flex: 1, overflowY: 'auto' }}>
                        {/* <AdminGuard> */}
                        {children}
                        {/* </AdminGuard> */}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}
