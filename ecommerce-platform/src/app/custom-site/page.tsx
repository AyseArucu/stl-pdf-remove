
import Link from 'next/link';
import { getServicePageContent } from '@/app/actions/service-actions';
import { FaWhatsapp, FaCheck, FaMobileAlt, FaSearch, FaRocket, FaLock, FaChartLine, FaCogs, FaCheckCircle, FaLaptopCode, FaPalette, FaCode, FaCheckDouble } from 'react-icons/fa';

export default async function CustomSitePage() {
    const content = await getServicePageContent();

    const whatsappLink = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(content.whatsappMessage)}`;

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--text)] relative">

            {/* WhatsApp Fixed Widget */}
            <div className="fixed bottom-6 right-6 z-50 group">
                <div className="absolute bottom-16 right-0 mb-2 w-72 bg-[var(--surface)] rounded-lg shadow-xl p-4 hidden group-hover:block border border-[var(--border)] transform transition-all origin-bottom-right">
                    <h4 className="font-bold text-[var(--text)] mb-2 border-b border-[var(--border)] pb-2">Bizimle Sohbet Edin</h4>
                    <p className="text-sm text-[var(--text-light)] mb-4">Merhaba, web sitesi hizmetimiz hakkında tüm sorularınız için bize mesaj gönderebilirsiniz.</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white text-center font-bold py-2 rounded-lg hover:bg-[#128C7E] transition-colors">
                        WhatsApp'tan Yaz
                    </a>
                </div>
                <button className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2">
                    <FaWhatsapp className="text-2xl" />
                    <span className="font-bold text-sm">Destek</span>
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative bg-[var(--primary)] text-white pt-32 pb-24 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <span className="inline-block py-1 px-3 rounded-full bg-[var(--secondary)] text-white text-sm font-semibold mb-6 border border-white/20">
                        ✨ Kişiye Özel Hizmet
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl mx-auto leading-tight">
                        {content.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {content.heroDescription}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/custom-site/quote"
                            className="px-8 py-4 bg-[var(--secondary)] hover:bg-[var(--accent)] text-white rounded-lg font-bold text-lg transition-all shadow-lg flex items-center justify-center text-center"
                        >
                            Ücretsiz Teklif Al
                        </Link>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <FaWhatsapp /> WhatsApp'tan Yaz
                        </a>
                    </div>
                </div>
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--secondary)] via-[var(--primary)] to-[var(--primary)]"></div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-[var(--background)]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[var(--text)]">Hizmet Ayrıcalıkları</h2>
                        <div className="w-16 h-1 bg-[var(--secondary)] mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.benefits.map((benefit: string, idx: number) => (
                            <div key={idx} className="bg-[var(--surface)] p-8 rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-[var(--secondary)] text-2xl">
                                    <FaCheck />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-[var(--text)] mb-2">{benefit}</h3>
                                    <p className="text-sm text-[var(--text-light)]">Profesyonel standartlarda çözüm.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us / Trust Section */}
            <section className="py-20 bg-[var(--surface)]">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-[var(--text)] mb-6">Neden Bizi Tercih Etmelisiniz?</h2>
                        <p className="text-[var(--text-light)] text-lg leading-relaxed mb-8">
                            {content.whyUsText}
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {content.stats.map((stat: any, idx: number) => (
                                <div key={idx} className="bg-[var(--background)] p-4 rounded-lg text-center border border-[var(--border)]">
                                    <span className="block text-3xl font-bold text-[var(--secondary)] mb-1">{stat.value}</span>
                                    <span className="text-sm text-[var(--text-light)] font-medium">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                        <TrustCard icon={<FaPalette />} title="Özel Tasarım" />
                        <TrustCard icon={<FaSearch />} title="SEO Odaklı" />
                        <TrustCard icon={<FaLock />} title="Güvenli" />
                        <TrustCard icon={<FaRocket />} title="Hızlı" />
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-[var(--background)]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[var(--text)]">Çalışma Sürecimiz</h2>
                        <p className="text-[var(--text-light)] mt-4">Adım adım projenizi hayata geçiriyoruz.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        <StepCard step="1" title="İhtiyaç Analizi" icon={<FaSearch />} />
                        <StepCard step="2" title="Tasarım Planı" icon={<FaPalette />} />
                        <StepCard step="3" title="Geliştirme" icon={<FaCode />} />
                        <StepCard step="4" title="Test & Onay" icon={<FaCheckDouble />} />
                        <StepCard step="5" title="Yayın & Teslim" icon={<FaRocket />} />
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-20 bg-[var(--surface)]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[var(--text)]">Paketler ve Çözümler</h2>
                        <p className="text-[var(--text-light)] mt-4">İhtiyacınıza uygun paketi seçip teklif alabilirsiniz.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.packages.map((pkg: any) => (
                            <div key={pkg.id} className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 shadow-sm hover:border-[var(--secondary)] transition-colors relative flex flex-col">
                                {pkg.name.includes('Kurumsal') && (
                                    <span className="absolute top-4 right-4 bg-purple-100 text-[var(--secondary)] text-xs font-bold px-3 py-1 rounded-full">POPÜLER</span>
                                )}
                                <h3 className="text-xl font-bold text-[var(--text)] mb-2">{pkg.name}</h3>
                                <p className="text-[var(--text-light)] text-sm mb-6">{pkg.priceDescription}</p>
                                <div className="space-y-4 mb-8 flex-1">
                                    {pkg.features.map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm text-[var(--text)]">
                                            <FaCheckCircle className="text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/custom-site/quote" className="block w-full py-3 border-2 border-[var(--secondary)] text-[var(--secondary)] font-bold text-center rounded-lg hover:bg-[var(--secondary)] hover:text-white transition-colors">
                                    Teklif Al
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-[var(--background)]">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--text)]">Sıkça Sorulan Sorular</h2>
                    </div>
                    <div className="space-y-4">
                        {content.faqs.map((faq: any) => (
                            <details key={faq.id} className="group bg-[var(--surface)] rounded-lg shadow-sm border border-[var(--border)]">
                                <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-[var(--text)] list-none group-open:text-[var(--secondary)]">
                                    {faq.question}
                                    <span className="text-xl group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="px-6 pb-6 text-[var(--text-light)] leading-relaxed border-t border-[var(--border)] pt-4">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

function TrustCard({ icon, title }: { icon: any, title: string }) {
    return (
        <div className="bg-[var(--background)] p-6 rounded-xl flex flex-col items-center justify-center gap-3 text-center hover:bg-[var(--surface)] hover:shadow-md transition-all border border-[var(--border)]">
            <div className="text-3xl text-[var(--secondary)]">{icon}</div>
            <span className="font-bold text-[var(--text)]">{title}</span>
        </div>
    )
}

function StepCard({ step, title, icon }: { step: string, title: string, icon: any }) {
    return (
        <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center text-2xl text-[var(--secondary)] shadow-lg mb-4 border-4 border-[var(--background)] z-10 relative">
                {icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--secondary)] text-white text-xs flex items-center justify-center rounded-full border-2 border-[var(--surface)]">
                    {step}
                </span>
            </div>
            <h3 className="font-bold text-[var(--text)]">{title}</h3>
        </div>
    )
}
