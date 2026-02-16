'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SupportWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);

    const phoneNumber = '905396645999';
    const message = 'Merhaba, destek almak istiyorum.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hide on specific pages
    if (pathname?.startsWith('/custom-site')) return null;

    return (
        <div
            ref={widgetRef}
            className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans group"
        >
            {/* Popup Window */}
            {isOpen && (
                <div className="mb-4 w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out transform translate-y-0 opacity-100 border border-gray-100 flex flex-col font-sans">
                    {/* Header with Agent Info */}
                    <div className="relative overflow-hidden bg-[#2d0a31] p-6 text-white">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl -ml-10 -mb-5 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-4">
                                    {/* Agent Avatar */}
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border-2 border-green-500 shadow-md backdrop-blur-sm">
                                            👩‍💼
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#2d0a31] rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">Müşteri Temsilcisi</h3>
                                        <p className="text-sm text-white/80 mt-0.5">Genellikle 5 dk içinde yanıtlar</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                                    aria-label="Kapat"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-[15px] text-white/95 font-normal leading-relaxed">
                                Merhaba! Size nasıl yardımcı olabiliriz?
                            </p>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="p-5 bg-[#f8fafc] flex flex-col gap-5 max-h-[450px] overflow-y-auto min-h-[300px]">
                        <div className="flex gap-4">
                            <div className="w-9 h-9 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center text-sm border border-purple-200">
                                👩‍💼
                            </div>
                            <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                                <p className="mb-2 font-bold text-gray-900 text-sm">👋 Hoş geldiniz!</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    QR kod oluşturma, sayfa içerikleri ve güncel haberlerle ilgili destek almak için bize yazabilirsiniz.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 opacity-50 my-2">
                            <div className="h-[1px] bg-gray-300 w-12"></div>
                            <span className="text-xs text-gray-500 font-medium tracking-wide">BUGÜN</span>
                            <div className="h-[1px] bg-gray-300 w-12"></div>
                        </div>
                    </div>

                    {/* Footer / Input Area */}
                    <div className="p-5 bg-white border-t border-gray-100">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group/btn"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover/btn:scale-110 transition-transform">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="text-[15px]">WhatsApp ile Sohbet</span>
                        </a>
                        <p className="text-[11px] text-gray-500 text-center mt-3 flex items-center justify-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Ortalama yanıt süresi: <span className="font-bold text-gray-700">5 dakika</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300
                    ${isOpen ? 'bg-gray-100 rotate-90 scale-90' : 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-110 hover:-translate-y-1 hover:shadow-green-900/20'}
                    text-white border-2 border-white/20
                `}
                aria-label="WhatsApp Destek"
            >
                <div className="relative">
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d0a31" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                    )}
                    {/* Notification Dot */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                    )}
                </div>
            </button>
        </div>
    );
}

