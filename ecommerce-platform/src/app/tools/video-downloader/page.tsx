'use client';

import { useState } from 'react';
import { FaYoutube, FaTiktok, FaInstagram, FaDownload, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { fetchVideoMetadata } from '@/app/actions/video';

export default function VideoDownloaderPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [selectedFormat, setSelectedFormat] = useState('MP4');
    const [selectedResolution, setSelectedResolution] = useState('');
    const [user, setUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Initial Auth Check
    const { checkUserSession } = require('@/app/actions/auth'); // Client-side import trick or pass as prop? 
    // Wait, checkUserSession is server action. It can be imported.
    // But this is a client component ('use client').
    // We can call server action from useEffect.

    const { useRouter } = require('next/navigation');
    const router = useRouter();

    const [isVerified, setIsVerified] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auth check before processing
        // Ideally we check this on mount, but let's double check here or on download
        // User wants: "indirme butonuna tıkladığımda otomatik ilk kayıt olmuş olması gerekiyor"
        // So they can SEARCH, but not DOWNLOAD? Or not even search?
        // Let's assume they can search, but download requires auth.
        // Actually, user said "indirme butonuna tıkladığımda".

        setLoading(true);
        setError(null);
        setResult(null);
        setDownloadSuccess(false);

        if (!url || url.length < 5) {
            setError('Lütfen geçerli bir URL giriniz.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetchVideoMetadata(url);
            if (response.success && response.data) {
                setResult(response.data);
                setSelectedResolution(response.data.resolutions[0]);
            } else {
                setError(response.error || 'Video getirilemedi.');
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadClick = async () => {
        // Check Auth Logic
        try {
            // Need to import dynamically to avoid build issues if mixed? No, import normally at top is fine if it's a server action.
            // But I used require above. Let's stick to import at top if possible, but I can't edit top easily without viewing.
            // I'll assume checkUserSession is imported or available.

            // To be safe, I'll fetch checkUserSession inside.
            const { checkUserSession } = await import('@/app/actions/auth');
            const currentUser = await checkUserSession();

            if (!currentUser) {
                // Redirect to register
                router.push(`/login?callbackUrl=${encodeURIComponent('/tools/video-downloader')}`);
                return;
            }

            // if (!currentUser.emailVerified) {
            //     setError('İndirme yapabilmek için lütfen e-posta adresinizi doğrulayın.');
            //     // Maybe show a "Resend Email" button?
            //     return;
            // }

            // If Verified, proceed to download
            await handleDownload();

        } catch (e) {
            console.error('Auth check failed', e);
            // Fallback to register if check fails
            router.push('/login');
        }
    };

    const handleDownload = async () => {



        setDownloading(true);
        setError(null);

        try {
            // Trigger download via new API route
            // Pass the selectedFormat (e.g. MP4, MP3) to the backend
            const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&format=${selectedFormat}`;

            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', ''); // Browser should respect Content-Disposition
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadSuccess(true);
        } catch (err) {
            setError('İndirme başlatılamadı.');
        } finally {
            setDownloading(false);
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'youtube': return <FaYoutube className="text-[#FF0000] text-3xl" />;
            case 'tiktok': return <FaTiktok className="text-[var(--text)] text-3xl" />;
            case 'instagram': return <FaInstagram className="text-[#E1306C] text-3xl" />;
            default: return <div className="text-[var(--text-light)] text-3xl font-bold">URL</div>;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Hero Section with Input */}
            <section className="relative bg-gradient-to-br from-purple-900 to-purple-600 text-white pt-24 pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight text-white drop-shadow-md">
                        Video İndirmek İçin Bağlantıyı Girin!
                    </h1>

                    {/* Input Form - Centered and Prominent */}
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-4 sm:gap-0 shadow-2xl rounded-lg overflow-hidden bg-white p-2 sm:p-0">
                            <div className="relative flex-grow">
                                <input
                                    type="url"
                                    name="video-url"
                                    id="video-url"
                                    className="block w-full py-5 px-6 text-lg text-gray-900 placeholder-gray-500 bg-white border-2 border-transparent focus:border-purple-500 focus:outline-none"
                                    placeholder="Video bağlantınızı buraya yapıştırın..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                                {loading && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <FaSpinner className="animate-spin text-purple-600 h-6 w-6" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !url}
                                className="sm:w-auto px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? '...' : <><span className="hidden sm:inline">İndir</span><FaCheckCircle className="sm:hidden" /></>}
                                <span className="text-2xl">→</span>
                            </button>
                        </form>
                        <p className="mt-4 text-white/80 text-sm font-medium">
                            Hizmetimizi kullanarak <span className="underline cursor-pointer hover:text-white">Hizmet Şartlarımızı</span> kabul etmiş olursunuz.
                        </p>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-black/10"></div>
            </section>

            {/* Main Content Area */}
            <div className="container mx-auto px-6 -mt-16 relative z-20 pb-20">
                {/* Error State */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-8 bg-white border-l-4 border-red-500 p-4 rounded-r shadow-lg animate-bounce-in">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-bold">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                {!result && (
                    <div className="max-w-4xl mx-auto bg-[var(--surface)] rounded-xl shadow-md p-8 text-center border border-[var(--border)]">
                        <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-[var(--text)] mb-2">Yasal Uyarı</h3>
                        <p className="text-[var(--text-light)] text-sm max-w-2xl mx-auto">
                            Bu araç yalnızca eğitim ve kişisel kullanım amaçlıdır. Lütfen telif hakkı yasalarına saygı gösterin.
                            Başkalarına ait içerikleri izinsiz indirmeyin.
                        </p>
                    </div>
                )}

                {/* Result Card */}
                {result && !loading && (
                    <div className="max-w-4xl mx-auto bg-[var(--surface)] shadow-2xl rounded-2xl overflow-hidden border border-[var(--border)] animate-fade-in-up">
                        <div className="p-6 sm:p-10">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Thumbnail */}
                                <div className="md:w-5/12 w-full flex-shrink-0">
                                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg relative bg-black">
                                        <img
                                            src={result.thumbnail}
                                            alt={result.title}
                                            className="object-contain w-full h-full"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                                            {result.duration}
                                        </div>
                                    </div>
                                </div>

                                {/* Info & Options */}
                                <div className="md:w-7/12 w-full flex flex-col">
                                    <h3 className="text-2xl font-bold text-[var(--text)] mb-4 leading-snug">
                                        {result.title}
                                    </h3>

                                    <div className="flex items-center gap-3 mb-6">
                                        {getPlatformIcon(result.platform)}
                                        <span className="text-sm font-medium text-[var(--text-light)] capitalize">{result.platform} Video</span>
                                    </div>

                                    <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border)] mb-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-[var(--text-light)] uppercase block mb-1">Format</label>
                                                <select
                                                    value={selectedFormat}
                                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                                    className="w-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-2 py-2 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                                >
                                                    <option>MP4</option>
                                                    <option>WEBM</option>
                                                    <option>MP3</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-[var(--text-light)] uppercase block mb-1">Kalite</label>
                                                <select
                                                    value={selectedResolution}
                                                    onChange={(e) => setSelectedResolution(e.target.value)}
                                                    className="w-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded px-2 py-2 text-sm focus:outline-none focus:border-[var(--secondary)]"
                                                >
                                                    {result.resolutions.map((res: string) => (
                                                        <option key={res}>{res}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {!downloadSuccess ? (
                                            <button
                                                onClick={handleDownloadClick}
                                                disabled={downloading}
                                                className="w-full btn bg-[var(--accent)] hover:bg-[var(--secondary)] text-white border-none py-4 text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                                            >
                                                {downloading ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" />
                                                        İşleniyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaDownload />
                                                        İndir
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="w-full bg-purple-100 text-purple-800 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-purple-200">
                                                <FaCheckCircle className="text-xl" />
                                                İndirme Başlatıldı!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
