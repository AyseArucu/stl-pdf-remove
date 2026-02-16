import React from 'react';
import { getAdsByLocation } from '@/app/actions/ads';
import AdCarousel from './AdCarousel';

export default async function SideAdsWrapper() {
    const leftAds = await getAdsByLocation('GLOBAL_SIDE_LEFT');
    const rightAds = await getAdsByLocation('GLOBAL_SIDE_RIGHT');

    // Sanitize data for client component (remove Date objects)
    const sanitizeLeftAds = leftAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        content: ad.content,
        location: ad.location,
        duration: (ad as any).duration || 5,
        isActive: ad.isActive
    }));

    const sanitizeRightAds = rightAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        content: ad.content,
        location: ad.location,
        duration: (ad as any).duration || 5,
        isActive: ad.isActive
    }));

    return (
        <>
            {/* Left Side Ad */}
            {sanitizeLeftAds.length > 0 && (
                <div className="fixed bottom-4 left-4 z-[9999] hidden md:block w-40 bg-white rounded-lg shadow-xl border-2 border-slate-200">
                    <AdCarousel ads={sanitizeLeftAds} />
                </div>
            )}

            {/* Right Side Ad */}
            {sanitizeRightAds.length > 0 && (
                <div className="fixed bottom-4 right-4 z-[9999] hidden md:block w-40 bg-white rounded-lg shadow-xl border-2 border-slate-200">
                    <AdCarousel ads={sanitizeRightAds} />
                </div>
            )}
        </>
    );
}
