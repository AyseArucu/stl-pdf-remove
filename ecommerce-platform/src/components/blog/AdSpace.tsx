import React from 'react';
import { getAdByLocation } from '@/app/actions/ads';

interface AdSpaceProps {
    className?: string;
    location: string;
}

export default async function AdSpace({ className = '', location }: AdSpaceProps) {
    const ad = await getAdByLocation(location);

    if (!ad || !ad.isActive) {
        // Option A: Hide if no ad
        // return null; 

        // Option B: Show placeholder (as requested implicitly by keeping "Reklam Alanı" initially)
        // But for production, usually we hide. For now, let's keep placeholder if ID is not present, or just empty?
        // Let's return the placeholder ONLY if we are in dev or if explicitly wanted. 
        // For this task, let's show the Ad if exists, otherwise show the placeholder for demo purposes.
        return (
            <div className={`w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center mb-8 ${className}`}>
                <span className="text-gray-400 font-semibold tracking-wider text-sm flex flex-col items-center gap-1">
                    <span>REKLAM ALANI</span>
                    <span className="text-xs opacity-75">({location})</span>
                </span>
            </div>
        );
    }

    return (
        <div className={`w-full mb-8 ${className}`}>
            {ad.type === 'IMAGE' ? (
                <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={ad.content} alt={ad.title} className="w-full h-32 object-cover rounded-lg shadow-sm" />
                </a>
            ) : (
                <div className="w-full h-32 overflow-hidden rounded-lg" dangerouslySetInnerHTML={{ __html: ad.content }} />
            )}
        </div>
    );
}
