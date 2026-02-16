import { prisma } from '@/lib/prisma';
import HeroSliderClient from './HeroSliderClient';

import { withTimeout } from "@/lib/timeout";

export default async function HeroSlider() {
    // Determine fetch strategy: Cache or dynamic
    // Slider usually static for some time, but we use server action to revalidate '/'
    // default cache behavior in Next 14 is aggressive, revalidatePath will clear it.

    // Use timeout to prevent page hang
    const slides = await withTimeout(
        prisma.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        }),
        3000,
        [] // Fallback to empty array
    );

    if (!slides || slides.length === 0) return null;

    return <HeroSliderClient slides={slides} />;
}
