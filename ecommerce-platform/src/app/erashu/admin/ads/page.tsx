import { getAds } from '@/app/actions/ads';
import AdsManager from '@/components/admin/AdsManager';

export default async function AdminAdsPage() {
    const ads = await getAds();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reklam Yönetimi</h1>
            <AdsManager initialAds={ads} />
        </div>
    );
}
