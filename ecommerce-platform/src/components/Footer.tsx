import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { prisma } from '@/lib/prisma';
import AdSpace from '@/components/blog/AdSpace';

export default async function Footer() {
    const settings = await prisma.contactSettings.findFirst();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="container mb-8">
                    <AdSpace location="FOOTER_TOP" />
                </div>
                <div className="footer-grid">
                    {/* Column 1: Üye İşlemleri */}
                    <div className="footer-column">
                        <h3 className="footer-title">ÜYE İŞLEMLERİ</h3>
                        <ul className="footer-links">
                            <li><Link href="/login" className="footer-link">Üye Ol / Giriş Yap</Link></li>
                            <li><Link href="/account" className="footer-link">Hesabım</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Kurumsal */}
                    <div className="footer-column">
                        <h3 className="footer-title">KURUMSAL</h3>
                        <ul className="footer-links">
                            <li><Link href="/about" className="hover:text-purple-300 transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/iletisim" className="hover:text-purple-300 transition-colors">İletişim</Link></li>
                            <li><Link href="/custom-site" className="hover:text-purple-300 transition-colors">Web Tasarım Hizmeti</Link></li>

                        </ul>
                    </div>

                    {/* Column 3: Politikalar */}
                    <div className="footer-column">
                        <h3 className="footer-title">POLİTİKALAR</h3>
                        <ul className="footer-links">
                            <li><Link href="/privacy" className="footer-link">Gizlilik Sözleşmesi</Link></li>

                            <li><Link href="/terms" className="footer-link">Hizmet Şartları</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: E-Bülten */}
                    <div className="footer-column mb-0">
                        <h3 className="footer-title">E-BÜLTEN ABONELİĞİ</h3>
                        <div className="footer-newsletter">
                            <p className="newsletter-desc">
                                Kampanya ve yeniliklerden haberdar olmak için e-bültenimize abone olabilirsiniz.
                            </p>
                            <form className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className="newsletter-input"
                                />
                                <button type="submit" className="newsletter-btn">
                                    Abone Ol
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom: Social & Copyright */}
                <div className="footer-bottom">
                    <div className="social-links">
                        {(settings as any)?.instagram && (
                            <a href={(settings as any).instagram} target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram size={18} /></a>
                        )}
                        {(settings as any)?.twitter && (
                            <a href={(settings as any).twitter} target="_blank" rel="noopener noreferrer" className="social-link"><FaTwitter size={18} /></a>
                        )}
                        {(settings as any)?.facebook && (
                            <a href={(settings as any).facebook} target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebookF size={18} /></a>
                        )}
                        {(settings as any)?.linkedin && (
                            <a href={(settings as any).linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedinIn size={18} /></a>
                        )}
                        {(settings as any)?.youtube && (
                            <a href={(settings as any).youtube} target="_blank" rel="noopener noreferrer" className="social-link"><FaYoutube size={18} /></a>
                        )}
                    </div>
                    <div className="copyright-text">
                        &copy; 2025 ERASHU & GAMİNG. Tüm hakları saklıdır.
                    </div>
                </div>
            </div>
        </footer>
    );
}
