
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
    FaDownload,
    FaShoppingCart,
    FaArrowLeft,
    FaHeart,
    FaComment,
    FaShareAlt,
    FaEye,
    FaBox,
    FaLayerGroup,
    FaWeightHanging,
    FaCheckCircle,
    FaRegHeart
} from 'react-icons/fa';
import STLViewer from '@/components/STLViewer';
import ProductGallery from '@/components/ProductGallery';
import StlInteractions from '@/components/StlInteractions';

// Force dynamic because of user session check
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const model = await prisma.stlModel.findUnique({
        where: { id: params.id }
    });

    if (!model) return { title: 'Model Bulunamadı' };

    return {
        title: `${model.name} | ERASHU 3D`,
        description: model.description.substring(0, 160)
    };
}

export default async function StlDetailPage({ params }: { params: { id: string } }) {
    const model = await prisma.stlModel.findUnique({
        where: { id: params.id },
        include: { tags: true }
    });

    if (!model) {
        notFound();
    }

    // Adapt content for ProductGallery
    const images = [model.imageUrl];

    // Mock Creator Data (since we don't have creator relation on StlModel yet)
    const creator = {
        name: "ErashuOfficial",
        avatar: "/uploads/logo.png", // Fallback or site logo
        verified: true
    };

    // Check if user has favorited
    const cookieStore = await cookies();
    const session = cookieStore.get('user_session');
    let isFavorited = false;

    if (session) {
        try {
            const user = JSON.parse(session.value);
            // Safety check for stale Prisma client
            if ((prisma as any).stlFavorite) {
                const favorite = await prisma.stlFavorite.findUnique({
                    where: {
                        userId_stlModelId: {
                            userId: user.id,
                            stlModelId: params.id
                        }
                    }
                });
                if (favorite) isFavorited = true;
            } else {
                console.warn("Prisma Client out of sync: stlFavorite model missing. Please restart server.");
            }
        } catch (e) {
            console.error("Error checking favorite status", e);
        }
    }

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Breadcrumb / Back Link */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link
                        href="/3d-modeller-stl"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}
                        className="hover:text-purple-600 transition-colors"
                    >
                        <FaArrowLeft /> 3D Modellere Dön
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Main Layout: Flex on Desktop, Column on Mobile */}
                    <div className="pdp-layout-flex" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>

                        {/* Left Column: Viewer & Gallery */}
                        <div style={{ flex: '1 1 600px', minWidth: '300px' }}>
                            {/* 3D Viewer Container */}
                            <div style={{
                                width: '100%',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb',
                                backgroundColor: '#f9fafb',
                                position: 'relative',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    left: '1rem',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}>
                                    3D ÖNİZLEME
                                </div>
                                <STLViewer url={model.fileUrl} className="!h-[500px] md:!h-[600px] lg:!h-[700px] w-full" />
                            </div>

                            {/* Gallery */}
                            <div style={{ width: '100%' }}>
                                <ProductGallery images={images} />
                            </div>
                        </div>

                        {/* Right Column: Info & Actions */}
                        <div style={{ flex: '0 1 400px', minWidth: '300px' }}>
                            <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                {/* Header */}
                                <div>
                                    <h1 style={{
                                        fontSize: '1.75rem',
                                        fontWeight: '800',
                                        color: '#111827',
                                        lineHeight: '1.2',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {model.name}
                                    </h1>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Kategori: <span style={{ color: '#9333ea', fontWeight: '600' }}>Toys & Games</span> <span style={{ color: '#d1d5db' }}>&gt;</span> Other
                                    </div>
                                </div>

                                {/* Creator Profile */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d8b4fe' }}>
                                        <span style={{ color: '#7e22ce', fontWeight: 'bold' }}>E</span>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{creator.name}</span>
                                            {creator.verified && <FaCheckCircle style={{ color: '#3b82f6', fontSize: '14px' }} />}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Doğrulanmış Tasarımcı</span>
                                    </div>
                                </div>

                                {/* File Info Box */}
                                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div style={{ backgroundColor: '#f3f4f6', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Dosya Bilgileri</span>
                                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>Yüklemeye Hazır</span>
                                    </div>
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '48px', height: '48px', backgroundColor: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <FaBox style={{ color: '#9ca3af', fontSize: '20px' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={model.name + ".stl"}>
                                                    {model.name.replace(/\s+/g, '_')}.stl
                                                </div>
                                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaLayerGroup /> STL/3MF</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaWeightHanging /> 12.5 MB</span>
                                                </div>
                                            </div>
                                            <div style={{ color: '#9ca3af' }}><FaDownload /></div>
                                        </div>

                                        {/* Divider */}
                                        <div style={{ height: '1px', backgroundColor: '#e5e7eb', opacity: 0.5 }}></div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '48px', height: '48px', backgroundColor: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#6b7280' }}>Info</span>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: '#374151' }}>Baskı Ayarları Önerisi</div>
                                                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                                    <span>0.2mm Layer</span> • <span>15% Infill</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <StlInteractions
                                    stlId={model.id}
                                    fileUrl={model.fileUrl}
                                    modelName={model.name}
                                    price={model.price}
                                    isFree={model.isFree}
                                    initialStats={{
                                        viewCount: (model as any).viewCount || 0,
                                        downloadCount: (model as any).downloadCount || 0,
                                        favoriteCount: (model as any).favoriteCount || 0
                                    }}
                                    initialIsFavorited={isFavorited}
                                />

                            </div>
                        </div>
                    </div>

                    {/* Tabs / Bottom Section */}
                    <div style={{ marginTop: '3rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                            <button style={{ color: '#9333ea', borderBottom: '2px solid #9333ea', paddingBottom: '0.5rem', fontWeight: 'bold', whiteSpace: 'nowrap', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>Bilgiler</button>
                            <button style={{ color: '#6b7280', paddingBottom: '0.5rem', fontWeight: '500', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer' }}>Dosyalar (1)</button>
                            <button style={{ color: '#6b7280', paddingBottom: '0.5rem', fontWeight: '500', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer' }}>Baskı Ayarları</button>
                            <button style={{ color: '#6b7280', paddingBottom: '0.5rem', fontWeight: '500', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer' }}>Yorumlar (0)</button>
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Model Hakkında</h3>
                            <div style={{ color: '#4b5563', lineHeight: '1.7' }}>
                                {model.description || "Bu model için henüz bir açıklama girilmemiş."}
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {model.tags && model.tags.map(tag => (
                                    <span key={tag.id} style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.85rem' }}>
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
