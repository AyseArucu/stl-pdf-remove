'use client';

interface StlTag {
    id: string;
    name: string;
}

interface StlModel {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    isFree: boolean;
    fileUrl: string;
    tags?: StlTag[];
    viewCount?: number;
    downloadCount?: number;
    favoriteCount?: number;
}

import Link from 'next/link';
import { FaEye, FaDownload, FaHeart } from 'react-icons/fa';

export default function StlCard({ model }: { model: StlModel }) {
    return (
        <div
            className="group product-card-frame"
            style={{
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
        >
            <Link href={`/3d-modeller-stl/${model.id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
                {/* Image Container */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
                    <img
                        src={model.imageUrl}
                        alt={model.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
                        {model.isFree ? (
                            <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
                                ÜCRETSİZ
                            </span>
                        ) : (
                            <span style={{ backgroundColor: '#9333ea', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
                                {model.price} ₺
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div style={{ padding: '12px', backgroundColor: '#fff', color: '#1f2937', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, borderTop: '1px solid #f3f4f6' }}>
                    <div>
                        {/* Title */}
                        <h3 style={{
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            lineHeight: '1.4',
                            marginBottom: '8px',
                            color: '#111827',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }} title={model.name}>
                            {model.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '8px' }}>STL Model</span>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaEye style={{ fontSize: '14px' }} />
                                <span>{model.viewCount || 0}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaDownload style={{ fontSize: '14px' }} />
                                <span>{model.downloadCount || 0}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaHeart style={{ fontSize: '14px' }} />
                                <span>{model.favoriteCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
