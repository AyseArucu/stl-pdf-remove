import { prisma } from '@/lib/prisma';
import { updateContactSettings } from '@/app/actions';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default async function ContactSettingsPage() {
    const settings = await prisma.contactSettings.findFirst() || { address: '', mapUrl: '' };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="text-purple-600">📍</span> İletişim ve Harita Ayarları
            </h1>

            <div className="flex flex-col gap-8">
                {/* Preview Section */}
                <div className="w-full">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🗺️</span> Harita Önizleme
                    </h2>
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {settings.mapUrl ? (
                                settings.mapUrl.includes('/embed') ? (
                                    <iframe
                                        src={settings.mapUrl}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                                        <span className="text-4xl mb-3">🚫</span>
                                        <p className="font-medium text-gray-600">Önizleme Kullanılamıyor</p>
                                        <p className="text-sm mt-1">Geçersiz veya bozuk harita bağlantısı.</p>
                                    </div>
                                )
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-400 bg-gray-50/50">
                                    <span className="text-4xl mb-3 opacity-30">🗺️</span>
                                    <p className="font-medium text-gray-500">Henüz harita eklenmedi</p>
                                    <p className="text-xs mt-1">Aşağıdan bir bağlantı ekleyin.</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-3 px-2 pb-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Görünecek Adres</div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {settings.address || <span className="text-gray-400 italic">Adres bilgisi girilmedi...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-50">
                        Ayarlar
                    </h2>
                    <form action={updateContactSettings} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                <span>Açık Adres</span>
                                <span className="text-xs font-normal text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Zorunlu Alan</span>
                            </label>
                            <textarea
                                name="address"
                                rows={5}
                                defaultValue={settings.address}
                                placeholder="Örn: Örnek Mah. Cumhuriyet Cad. No: 123&#10;Kadıköy / İstanbul"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-y min-h-[120px] text-sm leading-relaxed"
                            />
                            <p className="text-xs text-gray-500 flex items-start gap-1.5">
                                <span className="text-purple-500 mt-0.5">ℹ️</span>
                                Bu adres, sitenizin &quot;İletişim&quot; sayfasında ziyaretçilerinize gösterilecektir.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Telefon Numarası</label>
                                <input
                                    type="text"
                                    name="phone"
                                    defaultValue={(settings as any).phone || ''}
                                    placeholder="+90 5XX XXX XX XX"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">E-posta Adresi</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={(settings as any).email || ''}
                                    placeholder="info@ornek.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <span>🌐</span> Sosyal Medya
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-lg"><FaInstagram /></span>
                                    <input type="text" name="instagram" defaultValue={(settings as any).instagram || ''} placeholder="Instagram Linki" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-colors" />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-lg"><FaTwitter /></span>
                                    <input type="text" name="twitter" defaultValue={(settings as any).twitter || ''} placeholder="Twitter (X) Linki" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-colors" />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-lg"><FaFacebookF /></span>
                                    <input type="text" name="facebook" defaultValue={(settings as any).facebook || ''} placeholder="Facebook Linki" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-colors" />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-lg"><FaLinkedinIn /></span>
                                    <input type="text" name="linkedin" defaultValue={(settings as any).linkedin || ''} placeholder="LinkedIn Linki" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-colors" />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-lg"><FaYoutube /></span>
                                    <input type="text" name="youtube" defaultValue={(settings as any).youtube || ''} placeholder="YouTube Linki" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            <label className="text-sm font-semibold text-gray-700">
                                Harita Bağlantısı (URL)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-gray-400">🔗</span>
                                <input
                                    type="text"
                                    name="mapUrl"
                                    defaultValue={settings.mapUrl}
                                    placeholder="https://www.google.com/maps/embed?..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                />
                            </div>
                            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-100">
                                <strong className="block text-blue-700 mb-1">Nasıl Alınır?</strong>
                                Google Maps&apos;te yerinizi bulun &gt; &quot;Paylaş&quot; &gt; &quot;Haritayı yerleştir&quot; &gt; HTML&apos;i Kopyala. <br />
                                <span className="opacity-80">Sadece <code>src=&quot;...&quot;</code> içindeki linki değil, tüm iframe kodunu da yapıştırabilirsiniz (otomatik temizlenir).</span>
                            </div>

                            {settings.mapUrl && !settings.mapUrl.includes('/embed') && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-2 text-xs text-red-600">
                                    <span className="text-lg">⚠️</span>
                                    <div>
                                        <span className="font-semibold block">Bağlantı Hatası</span>
                                        Girilen URL geçerli bir embed linki gibi görünmüyor. Haritanız çalışmayabilir.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-50">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <span>💾</span> Kaydet ve Güncelle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
