import React from 'react';
import { Share2, Tag } from 'lucide-react';

interface CouponTemplateProps {
    design: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        // Extended Colors
        headerTextColor?: string;
        heroTitleColor?: string;
        badgeBgColor?: string;
        badgeTextColor?: string;
        couponBorderColor?: string;
        couponLabelColor?: string;
        couponCodeColor?: string;
        buttonBgColor?: string;
        buttonTextColor?: string;
        footerTextColor?: string;
        titleFontId: string;
        textFontId: string;
        heroImage?: string | null;
    };
    offer: {
        companyName: string;
        title: string;
        description: string;
    };
    coupon: {
        code: string;
        discount: string;
        buttonText: string;
    };
    titleFontClass?: string;
    textFontClass?: string;
}

const CouponTemplate: React.FC<CouponTemplateProps> = ({
    design,
    offer,
    coupon,
    titleFontClass = '',
    textFontClass = '',
}) => {
    // Defaults to ensure no breaking changes if props missing
    const headerTextColor = design.headerTextColor || '#ffffff'; // White
    const heroTitleColor = design.heroTitleColor || '#ffffff'; // White
    const badgeBgColor = design.badgeBgColor || '#a7f3d0'; // Green-200
    const badgeTextColor = design.badgeTextColor || '#065f46'; // Green-800
    const couponBorderColor = design.couponBorderColor || '#d1d5db'; // Gray-300
    const couponLabelColor = design.couponLabelColor || '#9ca3af'; // Gray-400
    const couponCodeColor = design.couponCodeColor || '#1f2937'; // Gray-800
    const buttonBgColor = design.buttonBgColor || '#6ee7b7'; // Green-300
    const buttonTextColor = design.buttonTextColor || '#064e3b'; // Green-900
    const footerTextColor = design.footerTextColor || '#9ca3af'; // Gray-400

    return (
        <div className="h-full bg-white overflow-y-auto pb-20 no-scrollbar relative font-sans" style={{ backgroundColor: design.backgroundColor }}>

            {/* App Header */}
            <div className="flex items-center justify-between p-4 pt-4" style={{ backgroundColor: design.primaryColor }}>
                <h2 className={`font-bold text-lg ${titleFontClass}`} style={{ color: headerTextColor }}>{offer.companyName}</h2>
                <button className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm" style={{ color: headerTextColor }}>
                    <Share2 size={16} />
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative h-48 bg-gray-100" style={{ backgroundColor: design.backgroundColor }}>
                {design.heroImage ? (
                    <img src={design.heroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90" style={{ backgroundColor: design.primaryColor }}></div>
                )}

                {/* Curve Divider */}
                <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white rounded-t-3xl" style={{ backgroundColor: design.backgroundColor }}></div>

                {/* Badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full shadow-lg z-10 font-bold text-sm flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}>
                    <Tag size={14} />
                    <span className={`truncate max-w-[120px] ${textFontClass}`}>{coupon.discount}</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="px-6 pt-10 pb-8 text-center space-y-6">
                <div>
                    <h2 className={`text-2xl font-black mb-2 ${titleFontClass}`} style={{ color: design.textColor }}>{offer.title}</h2>
                    <p className={`text-sm leading-relaxed px-4 ${textFontClass}`} style={{ color: design.textColor }}>
                        {offer.description}
                    </p>
                </div>

                {/* Coupon Card */}
                <div className="relative">
                    {/* The Coupon Visual */}
                    <div className="border-2 border-dashed rounded-2xl p-0 overflow-hidden relative bg-white" style={{ borderColor: couponBorderColor }}>
                        {/* Semi-circles for ticket effect */}
                        <div className="absolute top-1/2 left-0 w-4 h-8 bg-gray-50 rounded-r-full transform -translate-y-1/2 -ml-[2px] border-y-2 border-r-2 border-dashed" style={{ backgroundColor: design.backgroundColor, borderColor: couponBorderColor }}></div>
                        <div className="absolute top-1/2 right-0 w-4 h-8 bg-gray-50 rounded-l-full transform -translate-y-1/2 -mr-[2px] border-y-2 border-l-2 border-dashed" style={{ backgroundColor: design.backgroundColor, borderColor: couponBorderColor }}></div>

                        <div className="p-6">
                            <div className={`text-xs font-bold uppercase mb-1 ${titleFontClass}`} style={{ color: couponLabelColor }}>Kupon Kodu</div>
                            <div className="text-2xl font-mono font-bold tracking-widest" style={{ color: couponCodeColor }}>{coupon.code}</div>
                        </div>

                        {/* Dashed Line */}
                        <div className="border-t-2 border-dashed" style={{ borderColor: couponBorderColor }}></div>

                        <button className={`w-full py-4 font-bold tracking-wide uppercase hover:opacity-90 transition-opacity ${textFontClass}`} style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
                            {coupon.buttonText}
                        </button>
                    </div>
                </div>

                {/* Disclaimer or Footer */}
                <p className={`text-[10px] ${textFontClass}`} style={{ color: footerTextColor }}>
                    Kampanya koşulları mağaza insiyatifindedir. Son kullanma tarihine kadar geçerlidir.
                </p>
            </div>
        </div>
    );
};

export default CouponTemplate;
