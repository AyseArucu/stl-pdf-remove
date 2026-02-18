import { getBlogPostBySlug } from '@/app/actions/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FaArrowLeft, FaCalendar, FaEye, FaUser, FaLaptopCode, FaCube, FaQrcode, FaDownload, FaEraser, FaFilePdf, FaMagic, FaLink, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) return { title: 'Sayfa Bulunamadı' };

    return {
        title: `${post.title} | SeninAdresin`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        }
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPostBySlug(params.slug);
    const settings = await prisma.contactSettings.findFirst();
    const AdSpace = (await import('@/components/blog/AdSpace')).default;

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white pb-20 relative">
            {/* Side Ads (Absolute - Scrolls with page) */}
            <div className="hidden 2xl:block absolute top-[450px] left-4 w-[300px] h-[600px] z-40">
                <AdSpace location="BLOG_ESK_LEFT" className="h-full" />
            </div>
            <div className="hidden 2xl:block absolute top-[450px] right-4 w-[300px] h-[600px] z-40">
                <AdSpace location="BLOG_ESK_RIGHT" className="h-full" />
            </div>

            {/* Hero Header */}
            <div className="relative h-[400px] w-full bg-gray-900">
                <div className="absolute inset-0 opacity-60">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>

                <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors w-fit"
                    >
                        <FaArrowLeft className="mr-2" /> Blog'a Dön
                    </Link>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit mb-4 ${post.category === 'Haber'
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-600 text-white'
                        }`}>
                        {post.category}
                    </span>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                            <FaCalendar />
                            <time dateTime={post.createdAt.toISOString()}>
                                {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEye />
                            <span>{post.viewCount} Okunma</span>
                        </div>
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <FaUser />
                                <span>{post.author}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                    {/* Left Column: Content & Gallery (lg:col-span-8) */}
                    <div className="lg:col-span-8">
                        {/* Service Cards - Quick Access (4 items) */}
                        <div className="mb-10 mt-6">
                            {(() => {
                                const services = [
                                    { title: 'Web Tasarım', desc: 'Özel web sitesi', icon: <FaLaptopCode size={20} />, color: 'purple', href: '/custom-site' },
                                    { title: '3D Modeller', desc: 'STL arşivi', icon: <FaCube size={20} />, color: 'green', href: '/3d-modeller-stl' },
                                    { title: 'QR Oluşturucu', desc: 'Ücretsiz araç', icon: <FaQrcode size={20} />, color: 'blue', href: '/qr-kod-olusturucu' },
                                    { title: 'Video İndir', desc: 'Video & MP3', icon: <FaDownload size={20} />, color: 'pink', href: '/tools/video-downloader' }
                                ];
                                return (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
                                        {services.map((service, idx) => (
                                            <Link key={idx} href={service.href} className="group block h-full">
                                                <div className={`bg-${service.color}-50 border border-${service.color}-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all h-full flex flex-col items-center text-center backdrop-blur-sm bg-opacity-95`}>
                                                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-${service.color}-100 rounded-full flex items-center justify-center mb-3 text-${service.color}-600 group-hover:scale-110 transition-transform`}>
                                                        {service.icon}
                                                    </div>
                                                    <h3 className="font-bold text-gray-800 mb-1 text-sm lg:text-base">{service.title}</h3>
                                                    <p className="text-xs text-gray-600">{service.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Article Content */}
                        <AdSpace location="BLOG_DETAIL_TOP" className="mb-8" />
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                            </div>
                        </div>
                        <AdSpace location="BLOG_DETAIL_BOTTOM" className="mt-8" />

                        {/* Extra Images Gallery */}
                        {(() => {
                            let extraImages: string[] = [];
                            try {
                                if ((post as any).images) {
                                    extraImages = JSON.parse((post as any).images);
                                }
                            } catch (e) {
                                console.error('Failed to parse extra images', e);
                            }

                            if (extraImages.length === 0) return null;

                            return (
                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-600 pl-4 text-gray-800">Haber Görselleri</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {extraImages.map((img, idx) => (
                                            <div key={idx} className="relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                                                <img
                                                    src={img}
                                                    alt={`Haber Görseli ${idx + 1}`}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Related Articles Section */}
                        <RelatedArticles currentPostId={post.id} />

                        {/* Comments Section */}
                        {/* We need to fetch comments and user session here */}
                        <BlogCommentsWrapper postId={post.id} />
                    </div>

                    {/* Right Column: Sidebar (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Random Posts Widget */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            {/* Social Media Links */}
                            {/* Social Media Links */}
                            <div className="flex justify-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                <a
                                    href={settings?.instagram || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110"
                                    title="Instagram"
                                >
                                    <FaInstagram size={20} />
                                </a>
                                <a
                                    href={settings?.youtube || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                    title="YouTube"
                                >
                                    <FaYoutube size={20} />
                                </a>
                                <a
                                    href={settings?.twitter || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all transform hover:scale-110"
                                    title="Twitter"
                                >
                                    <FaTwitter size={20} />
                                </a>
                                <a
                                    href={settings?.linkedin || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all transform hover:scale-110"
                                    title="LinkedIn"
                                >
                                    <FaLinkedin size={20} />
                                </a>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                                İlginizi Çekebilir
                            </h3>

                            <div className="space-y-4">
                                <RandomPostsLoader currentPostId={post.id} />
                            </div>
                        </div>

                        {/* Quick Tools Widget */}
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white text-center shadow-lg">
                            <h4 className="font-bold text-lg mb-2">Hızlı Araçlar</h4>
                            <p className="text-purple-100 text-sm mb-4">İşinizi kolaylaştıracak ücretsiz araçlarımızı keşfedin.</p>
                            <Link href="/qr-kod-olusturucu" className="block bg-white text-purple-900 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors mb-2 text-sm">
                                QR Kod Oluştur
                            </Link>
                            <Link href="/tools/video-downloader" className="block bg-white/10 text-white font-bold py-2.5 rounded-lg hover:bg-white/20 transition-colors text-sm">
                                Video İndir
                            </Link>
                        </div>

                        <AdSpace location="BLOG_DETAIL_SIDEBAR" />
                    </div>

                </div>
            </div>
        </article >
    );
}

// Server Component for fetching random posts to keep main page cleaner
async function RandomPostsLoader({ currentPostId }: { currentPostId: string }) {
    const { getRandomBlogPosts } = await import('@/app/actions/blog');
    const randomPosts = await getRandomBlogPosts(10, currentPostId);

    if (randomPosts.length === 0) {
        return <p className="text-sm text-gray-500">Benzer içerik bulunamadı.</p>;
    }

    return (
        <>
            {randomPosts.map((rPost) => (
                <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="flex gap-3 group items-start">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                        <img
                            src={rPost.coverImage || 'https://via.placeholder.com/150'}
                            alt={rPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug mb-1">
                            {rPost.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{rPost.category}</span>
                            <span>•</span>
                            <time>{new Date(rPost.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</time>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}

async function BlogCommentsWrapper({ postId }: { postId: string }) {
    const { getBlogComments } = await import('@/app/actions/blog-comments');
    const { cookies } = await import('next/headers');
    const BlogComments = (await import('@/components/blog/BlogComments')).default;

    const comments = await getBlogComments(postId);
    const session = (await cookies()).get('user_session')?.value;
    const user = session ? JSON.parse(session) : null;

    return <BlogComments postId={postId} currentUser={user} existingComments={comments} />;
}

async function RelatedArticles({ currentPostId }: { currentPostId: string }) {
    const { getRandomBlogPosts } = await import('@/app/actions/blog');
    const relatedPosts = await getRandomBlogPosts(4, currentPostId);

    if (relatedPosts.length === 0) return null;

    return (
        <div className="mt-12 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                İlginizi Çekebilecek Diğer Haberler
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group relative min-w-[280px] w-[280px] snap-center bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex-shrink-0">
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={post.coverImage || 'https://via.placeholder.com/400x250'}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm">
                                {post.category}
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors text-sm">
                                {post.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <FaCalendar size={12} />
                                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
