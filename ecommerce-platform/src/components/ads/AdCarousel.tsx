'use client';

import React, { useState, useEffect } from 'react';

type Ad = {
    id: string;
    title: string;
    type: string;
    content: string;
    location: string;
    duration: number; // Duration in seconds
    isActive: boolean;
};

interface AdCarouselProps {
    ads: Ad[];
    className?: string;
}

export default function AdCarousel({ ads, className = '' }: AdCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (ads.length <= 1) return;

        const currentAd = ads[currentIndex];
        const duration = (currentAd.duration || 5) * 1000;

        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, duration);

        return () => clearTimeout(timer);
    }, [currentIndex, ads.length, ads]);

    if (!ads || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className={`relative w-full overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white ${className}`}>
            <div className="relative w-full">
                {currentAd.type === 'IMAGE' ? (
                    <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full">
                        <img
                            src={currentAd.content}
                            alt={currentAd.title}
                            className="w-full h-auto object-cover"
                        />
                    </a>
                ) : currentAd.type === 'VIDEO' ? (
                    <video
                        src={currentAd.content}
                        className="w-full h-auto object-cover"
                        muted
                        autoPlay
                        loop
                        playsInline
                    />
                ) : (
                    <div
                        className="w-full h-auto"
                        dangerouslySetInnerHTML={{ __html: currentAd.content }}
                    />
                )}
            </div>

            {/* Indicators (Optional, good for UX) */}
            {ads.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                    {ads.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 w-1.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
