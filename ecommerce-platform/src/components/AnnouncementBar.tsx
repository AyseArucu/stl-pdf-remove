'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const AnnouncementBar = () => {
    const pathname = usePathname();

    // Hide on admin pages
    if (pathname.startsWith('/erashu/admin')) {
        return null;
    }

    const text = "Yeni ürünler eklendi • Ücretsiz kargo • Güvenli alışveriş • Kampanyaları kaçırma •";

    // Create multiple copies to ensure seamless loop on wide screens
    const content = Array(10).fill(text).join(' \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ');

    return (
        <div className="announcement-bar">
            <div className="announcement-track">
                <span>{content}</span>
                <span>{content}</span>
            </div>
        </div>
    );
};

export default AnnouncementBar;
