
import Link from 'next/link';

export default function CampaignSection() {
    return (
        <section className="campaign-section container">
            <div className="grid">
                {/* Banner 1 */}
                <div className="campaign-card purple">
                    <span className="campaign-label">
                        GENİŞ ARŞİV
                    </span>
                    <h3 className="campaign-title">
                        Binlerce STL<br />Modeli Keşfet
                    </h3>
                    <Link href="/3d-modeller-stl" className="campaign-btn">
                        Arşive Git
                    </Link>
                </div>

                {/* Banner 2 */}
                <div className="campaign-card pink">
                    <span className="campaign-label">
                        POPÜLER
                    </span>
                    <h3 className="campaign-title">
                        En Çok İndirilen<br />Modeller
                    </h3>
                    <Link href="/3d-modeller-stl" className="campaign-btn">
                        İncele
                    </Link>
                </div>

                {/* Banner 3 - Custom Site */}
                <div className="campaign-card blue">
                    <span className="campaign-label">
                        WEB TASARIM
                    </span>
                    <h3 className="campaign-title">
                        Sana Özel<br />Web Sitesi
                    </h3>
                    <Link href="/custom-site" className="campaign-btn">
                        Teklif Al
                    </Link>
                </div>
            </div>
        </section>
    );
}
