import { getQrCode } from '@/app/actions/qr';
import { redirect } from 'next/navigation';
import PasswordClient from './PasswordClient';
import { cookies } from 'next/headers';
import CouponTemplate from '@/components/qr/CouponTemplate';
import {
    Inter,
    Roboto,
    Open_Sans,
    Lato,
    Montserrat,
    Playfair_Display,
    Oswald,
    Raleway
} from 'next/font/google';

// --- Font Configurations ---
const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
const openSans = Open_Sans({ subsets: ['latin'] });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const oswald = Oswald({ subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });

const FONTS = [
    { id: 'inter', name: 'Inter', font: inter },
    { id: 'roboto', name: 'Roboto', font: roboto },
    { id: 'open-sans', name: 'Open Sans', font: openSans },
    { id: 'lato', name: 'Lato', font: lato },
    { id: 'montserrat', name: 'Montserrat', font: montserrat },
    { id: 'playfair', name: 'Playfair Display', font: playfair },
    { id: 'oswald', name: 'Oswald', font: oswald },
    { id: 'raleway', name: 'Raleway', font: raleway },
];

const getFontClass = (fontId: string) => {
    const font = FONTS.find(f => f.id === fontId);
    return font ? font.font.className : inter.className;
};

// Ensure dynamic rendering so we fetch fresh data
export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const qr = await getQrCode(id);

    // If fetch fails or ID doesn't exist, show 404 or generic error
    if (!qr) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
                    <p className="text-gray-500">Bu QR kodu bulunamadı veya silinmiş.</p>
                </div>
            </div>
        );
    }

    const cookieStore = await cookies();
    const hasAccess = cookieStore.has(`qr_access_${id}`);

    // If password exists and no cookie, show password screen
    if (qr.password && !hasAccess) {
        return <PasswordClient params={{ id }} />;
    }

    // Attempt to parse design for coupon, link_list or menu
    let couponData = null;
    let linkListData = null;
    let menuData = null;
    let businessData = null;
    try {
        if (qr.design) {
            const parsed = JSON.parse(qr.design);
            if (parsed.type === 'coupon') {
                couponData = parsed;
            } else if (parsed.type === 'link_list' || parsed.type === 'social_media') {
                linkListData = parsed;
            } else if (parsed.type === 'menu') {
                menuData = parsed;
            } else if (parsed.type === 'business') {
                businessData = parsed;
            }
        }
    } catch (e) {
        console.error('Failed to parse design JSON', e);
    }

    // If it's a coupon, render it
    if (couponData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md h-[800px] rounded-[40px] overflow-hidden shadow-2xl ring-8 ring-gray-900 border-4 border-gray-800 bg-white">
                    <CouponTemplate
                        design={couponData.design}
                        offer={couponData.offer}
                        coupon={couponData.coupon}
                        titleFontClass={getFontClass(couponData.design.titleFontId)}
                        textFontClass={getFontClass(couponData.design.textFontId)}
                    />
                </div>
            </div>
        );
    }

    // If it's a link list, render it
    if (linkListData) {
        // Need to import LinkListTemplate first
        const LinkListTemplate = (await import('@/components/qr/LinkListTemplate')).default;

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md h-[800px] rounded-[40px] overflow-hidden shadow-2xl ring-8 ring-gray-900 border-4 border-gray-800 bg-white relative">
                    {/* Dynamic Island / Notch Mockup for Realism */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30 pointer-events-none"></div>

                    <LinkListTemplate
                        design={linkListData.design}
                        info={linkListData.info}
                        links={linkListData.links}
                        socials={linkListData.socials}
                        fonts={linkListData.fonts}
                        welcomeScreen={linkListData.welcomeScreen}
                        headerFontClass={getFontClass(linkListData.fonts.header.toLowerCase())}
                        textFontClass={getFontClass(linkListData.fonts.text.toLowerCase())}
                    />

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-30 pointer-events-none"></div>
                </div>
            </div>
        );
    }

    // If it's a menu, render it
    if (menuData) {
        const MenuTemplate = (await import('@/components/qr/MenuTemplate')).default;

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md h-[800px] rounded-[40px] overflow-hidden shadow-2xl ring-8 ring-gray-900 border-4 border-gray-800 bg-white relative">
                    {/* Dynamic Island / Notch Mockup for Realism */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30 pointer-events-none"></div>

                    <MenuTemplate
                        design={menuData.design}
                        restaurantInfo={menuData.restaurantInfo}
                        menu={menuData.menu}
                        openingHours={menuData.openingHours}
                        contact={menuData.contact}
                        socials={menuData.socials}
                        fonts={menuData.fonts}
                        welcomeScreen={menuData.welcomeScreen}
                        headerFontClass={getFontClass(menuData.fonts.header)}
                        textFontClass={getFontClass(menuData.fonts.text)}
                    />

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-30 pointer-events-none"></div>
                </div>
            </div>
        );
    }

    // If it's a business, render it
    if (businessData) {
        const BusinessTemplate = (await import('@/components/qr/BusinessTemplate')).default;

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md h-[800px] rounded-[40px] overflow-hidden shadow-2xl ring-8 ring-gray-900 border-4 border-gray-800 bg-white relative">
                    {/* Dynamic Island / Notch Mockup for Realism */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-30 pointer-events-none"></div>

                    <BusinessTemplate
                        design={businessData.design}
                        info={businessData.info}
                        about={businessData.about}
                        facilities={businessData.facilities}
                        cta={businessData.cta}
                        contact={businessData.contact}
                        openingHours={businessData.openingHours}
                        socials={businessData.socials}
                        fonts={businessData.fonts}
                        headerFontClass={getFontClass(businessData.fonts.header)}
                        textFontClass={getFontClass(businessData.fonts.text)}
                    />

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-30 pointer-events-none"></div>
                </div>
            </div>
        );
    }

    // Fallback: Direct redirection
    redirect(qr.targetUrl || '/');
}
