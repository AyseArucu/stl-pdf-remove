'use client';

import { useState, useEffect } from 'react';
import { FaDownload, FaRegHeart, FaHeart, FaComment, FaShareAlt, FaEye, FaBox } from 'react-icons/fa';
import { incrementStlView, incrementStlDownload, toggleStlFavorite } from '@/actions/stl-actions';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface StlInteractionsProps {
    stlId: string;
    fileUrl: string;
    modelName: string;
    price: number;
    isFree: boolean;
    initialStats: {
        viewCount: number;
        downloadCount: number;
        favoriteCount: number;
    };
    initialIsFavorited: boolean;
}

export default function StlInteractions({
    stlId,
    fileUrl,
    modelName,
    price,
    isFree,
    initialStats,
    initialIsFavorited
}: StlInteractionsProps) {
    const router = useRouter();
    const [stats, setStats] = useState(initialStats);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isLoading, setIsLoading] = useState(false);

    // Increment view count on mount
    useEffect(() => {
        // Use a flag to prevent double counting in strict mode dev
        const hasViewed = sessionStorage.getItem(`viewed_${stlId}`);
        if (!hasViewed) {
            incrementStlView(stlId);
            sessionStorage.setItem(`viewed_${stlId}`, 'true');
            // Optimistic update not strictly needed for view count as it's passive, 
            // but we can increment it locally for "live" feel if we mistakenly start with 0.
            setStats(prev => ({ ...prev, viewCount: prev.viewCount + 1 }));
        }
    }, [stlId]);

    const { user } = useUser();
    const pathname = usePathname();

    const handleDownload = async () => {
        if (!user) {
            const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
            router.push(loginUrl);
            return;
        }

        // Trigger download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `${modelName.replace(/\s+/g, '_')}.stl`; // Suggest filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Increment count
        await incrementStlDownload(stlId);
        setStats(prev => ({ ...prev, downloadCount: prev.downloadCount + 1 }));
    };

    const handleFavorite = async () => {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic update
        const newStatus = !isFavorited;
        setIsFavorited(newStatus);
        setStats(prev => ({
            ...prev,
            favoriteCount: newStatus ? prev.favoriteCount + 1 : prev.favoriteCount - 1
        }));

        const result = await toggleStlFavorite(stlId);

        if (!result.success) {
            // Revert if failed
            setIsFavorited(!newStatus);
            setStats(prev => ({
                ...prev,
                favoriteCount: !newStatus ? prev.favoriteCount + 1 : prev.favoriteCount - 1
            }));
            if (result.error) {
                alert(result.error); // Simple alert for now
            }
        }
        setIsLoading(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Bağlantı kopyalandı!');
    };

    return (
        <>
            {/* Action Buttons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                    onClick={handleDownload}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        backgroundColor: '#1f2937', color: 'white', padding: '12px',
                        borderRadius: '8px', fontWeight: 'bold', border: 'none',
                        transition: 'background-color 0.2s', cursor: 'pointer'
                    }}
                    className="hover:bg-gray-800"
                >
                    <FaDownload /> İndir
                </button>
                <button style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: '#16a34a', color: 'white', padding: '12px',
                    borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                }}>
                    <FaBox /> 3D Yazdır
                </button>
                <button style={{
                    gridColumn: '1 / -1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: '#9333ea', color: 'white', padding: '14px',
                    borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    {isFree ? 'Destek Ol (Bağış)' : `Satın Al (${price} ₺)`}
                </button>
            </div>

            {/* Engagement Stats Bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px',
                padding: '12px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
                <button
                    onClick={handleFavorite}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFavorited ? '#ef4444' : '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {isFavorited ? <FaHeart style={{ fontSize: '18px' }} /> : <FaRegHeart style={{ fontSize: '18px' }} />}
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{stats.favoriteCount || 0}</span>
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaDownload style={{ fontSize: '18px' }} />
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{stats.downloadCount || 0}</span>
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaComment style={{ fontSize: '18px' }} />
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>0</span>
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>
                <button onClick={handleShare} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaShareAlt style={{ fontSize: '18px' }} />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', padding: '0 4px' }}>
                <span>Yüklendi: {new Date().toLocaleDateString('tr-TR')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaEye /> {stats.viewCount || 0} Görüntülenme</span>
            </div>
        </>
    );
}
