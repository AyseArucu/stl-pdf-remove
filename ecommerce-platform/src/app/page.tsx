import React from 'react';
import AdSpace from '@/components/blog/AdSpace';
import HeroSlider from '@/components/HeroSlider';
import CampaignSection from '@/components/CampaignSection';
import HomeServices from '@/components/HomeServices';
import BlogPreviewSection from '@/components/BlogPreviewSection';

export default function Home() {
    return (
        <>
            <HeroSlider />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <AdSpace location="HOME_BELOW_HERO" />
                </div>
            </div>
            <CampaignSection />
            <HomeServices />
            <BlogPreviewSection />
        </>
    );
}
