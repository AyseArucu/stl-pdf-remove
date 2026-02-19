import { getAds } from '@/app/actions/ads';
import AdsManager from '@/components/admin/AdsManager';

export default async function AdminAdsPage() {
    const ads = await getAds();

    // Sanitize data for client component (remove Date objects)
    const sanitizedAds = ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        type: ad.type,
        content: ad.content,
        location: ad.location,
        duration: (ad as any).duration || 5,
        isActive: ad.isActive,
        viewCount: (ad as any).viewCount || 0
    }));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reklam Yönetimi</h1>
            <AdsManager initialAds={sanitizedAds} />
        </div>
    );
}
