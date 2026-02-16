import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
    return (
        <header className="hero-header" id="header-top">
            <div className="container">
                <section className="header-bottom">
                    <div className="header-bottom-left">
                        <h3 className="header-bottom-littleTitle">
                            Özel Tasarım Dünyası
                        </h3>
                        <h1 className="header-bottom-largTitle">
                            Detaylarda Gizli Bir Dünya
                        </h1>
                        <p className="header-bottom-text">
                            3D baskı ile hayat bulan figürler ve özgün modeller burada.
                            Koleksiyonunu genişletmek ya da özel bir parça arıyorsan, doğru yerdesin.
                            Her model titizlikle hazırlanır, özenle üretilir.
                        </p>
                        <div className="header-bottom-link-Wraper">
                            <Link href="/collections" className="header-bottom-link">
                                Koleksiyonu Keşfet
                            </Link>
                            <Link href="/iletisim" className="header-bottom-link outline">
                                Bize Ulaşın
                            </Link>
                        </div>
                    </div>

                    <div className="header-bottom-right">
                        <Image
                            src="/images/bambu-combo.png.png"
                            alt="3D Figürler"
                            width={800}
                            height={800}
                            className="header-bottom-rightImg"
                            priority
                        />
                    </div>
                </section>
            </div>
        </header>
    );
};

export default Hero;
