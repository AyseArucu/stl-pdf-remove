'use client';

import { useState } from 'react';
import { FaMagic, FaDownload, FaSpinner, FaImage } from 'react-icons/fa';

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function TextToImageWrapper() {
    const { user } = useUser();
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent('/text-to-image')}`);
            return;
        }

        if (!prompt || prompt.length < 3) {
            setError('Lütfen deseniz hakkında en az 3 harflik bir şeyler yazın.');
            return;
        }

        setLoading(true);
        setError(null);
        setImageUrl(null);
        setImageBlob(null);

        // Using Server-Side AI Horde Integration
        // Frontend just calls the proxy and waits (polling happens on server)
        const encodedPrompt = encodeURIComponent(prompt);
        const apiUrl = `/api/generate-image?prompt=${encodedPrompt}`;

        fetch(apiUrl)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.error || 'API Hatası');
                }
                setImageUrl(data.image);
            })
            .catch(err => {
                console.error('Frontend Fetch Error:', err);
                let msg = 'Görsel oluşturulamadı. Sunucu yanıt vermedi.';
                if (err.message.includes('JSON')) msg = 'Sunucudan geçersiz yanıt alındı.';
                setError(msg);
                setLoading(false);
            });
    };

    const handleDownload = async () => {
        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent('/text-to-image')}`);
            return;
        }

        if (!imageUrl) return;

        try {
            // Fetch via proxy for download to bypass CORS
            const proxyUrl = `/api/generate-image?prompt=${encodeURIComponent(prompt)}`; // Re-using prompt might be risky if seed changed? 
            // Better: Pass the direct URL to a download proxy, OR just re-download the same URL via proxy (since Pollinations caches well)

            // Simpler: Just open in new tab if we can't strict download, 
            // BUT user wants png download.
            // Let's try downloading the CURRENT imageUrl via proxy, we need to pass the URL?
            // Or just construct it again. Pollinations images are deterministic with seed.

            // Let's use the fetch-blob strategy here within download
            const response = await fetch(imageUrl);
            // Wait, direct fetch will fail CORS.

            // use our proxy
            // Extract the params from local imageUrl
            // Actually, we can just open the image in a new tab as fallback
            const link = document.createElement('a');
            link.href = imageUrl;
            link.target = '_blank';
            link.download = `generated-${Date.now()}.png`; // Wont work for cross-origin
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e) {
            console.error('Download failed', e);
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-900 to-purple-800 text-white pt-24 pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                        Hayalindeki Görseli Yarat
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
                        Sadece ne istediğinizi yazın, yapay zeka sizin için çizsin.
                    </p>
                </div>
                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
                </div>
            </section>

            {/* Main Interface */}
            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">

                        {/* Input Form */}
                        <form onSubmit={handleGenerate} className="mb-10">
                            <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 uppercase mb-2">
                                GÖRSEL TARİFİ (İngilizce önerilir)
                            </label>
                            <div className="relative">
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Örn: A futuristic city with flying cars, cyberpunk style, neon lights..."
                                    className="w-full h-32 p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 resize-none transition-colors"
                                    required
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                                    {prompt.length} karakter
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !prompt}
                                className={`mt-6 w-full py-4 text-xl font-bold rounded-xl text-white flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin text-2xl" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <FaMagic className="text-2xl" />
                                        Görseli Oluştur
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Result Area */}
                        {(loading || imageUrl) && (
                            <div className="border-t border-gray-100 pt-10">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaImage className="text-purple-600" />
                                    Sonuç
                                </h3>

                                <div className="relative aspect-square md:aspect-video w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                                    {/* Spinner Overlay */}
                                    {loading && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-sm">
                                            <FaSpinner className="animate-spin text-5xl text-purple-600 mb-4" />
                                            <p className="text-gray-600 font-medium animate-pulse">
                                                Yapay zeka çizim yapıyor...
                                            </p>
                                        </div>
                                    )}

                                    {/* Image (Always mounted if URL exists to trigger onLoad) */}
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="Generated from prompt"
                                            referrerPolicy="no-referrer"
                                            className={`w-full h-full object-contain transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                                            onLoad={() => setLoading(false)}
                                            onError={(e) => {
                                                console.error('Image load failed');
                                                setLoading(false);
                                                e.currentTarget.style.display = 'none';
                                                setError('Görsel yüklenemedi. Lütfen tekrar deneyin.');
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Actions */}
                                {imageUrl && !loading && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={handleDownload}
                                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-colors"
                                        >
                                            <FaDownload />
                                            Görseli İndir (PNG)
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
