'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


interface HeroSlideData {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    imageUrl: string;
    bgImageUrl: string | null;
    buttonText: string;
    buttonLink: string;
}

const HeroSliderClient = ({ slides }: { slides: HeroSlideData[] }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false, // Cleaner look
    };

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!slides || slides.length === 0) return null;
    if (!mounted) return null;

    return (
        <div className="hero-slider-container">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="hero-slide"
                        style={{
                            backgroundImage: slide.bgImageUrl ? `linear-gradient(to bottom, #e4e4e427, rgb(0, 0, 0)), url(${slide.bgImageUrl})` : undefined
                        }}
                    >
                        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                            <div className="header-bottom">
                                <div className="header-bottom-left">
                                    <h3 className="header-bottom-littleTitle">
                                        {slide.title}
                                    </h3>
                                    <h1 className="header-bottom-largTitle">
                                        {slide.subtitle}
                                    </h1>
                                    <p className="header-bottom-text">
                                        {slide.description}
                                    </p>
                                    <div className="header-bottom-link-Wraper">
                                        <Link href={slide.buttonLink} className="header-bottom-link">
                                            {slide.buttonText}
                                        </Link>
                                        <Link href="/iletisim" className="header-bottom-link outline">
                                            Bize Ulaşın
                                        </Link>
                                    </div>
                                </div>
                                <div className="header-bottom-right">
                                    <Image
                                        src={slide.imageUrl}
                                        alt={slide.title}
                                        width={800}
                                        height={800}
                                        className="header-bottom-rightImg"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroSliderClient;
