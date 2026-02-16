
import Link from 'next/link';

export default function ProductCategoryBanners() {
    return (
        <section className="container mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Banner 1 - Newest Arrivals */}
                <div className="campaign-card pink">
                    <span className="campaign-label">
                        YENİ EKLENENLER
                    </span>
                    <h3 className="campaign-title">
                        En Yeni<br />Ürünler
                    </h3>
                    <Link href="/search?sort=newest" className="campaign-btn">
                        Tümünü Gör
                    </Link>
                </div>

                {/* Banner 2 - Top Discounts */}
                <div className="campaign-card orange">
                    <span className="campaign-label">
                        FIRSAT ÜRÜNLERİ
                    </span>
                    <h3 className="campaign-title">
                        İndirimli<br />Fırsatlar
                    </h3>
                    <Link href="/search?sort=discount" className="campaign-btn">
                        İncele
                    </Link>
                </div>

                {/* Banner 3 - Most Viewed */}
                <div className="campaign-card teal">
                    <span className="campaign-label">
                        POPÜLER
                    </span>
                    <h3 className="campaign-title">
                        En Çok<br />Görüntülenenler
                    </h3>
                    <Link href="/search?sort=views" className="campaign-btn">
                        Keşfet
                    </Link>
                </div>
            </div>
        </section>
    );
}
