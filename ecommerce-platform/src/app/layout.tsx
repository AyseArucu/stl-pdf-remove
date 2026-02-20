import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })
import './globals.css'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SupportWidget from '@/components/SupportWidget'
import ScrollToTop from '@/components/ScrollToTop'


export const metadata: Metadata = {
    title: 'E-commerce',
    description: 'Simple e-commerce site',
}

import { FavoritesProvider } from '@/context/FavoritesContext';
import { UserProvider } from '@/context/UserContext';
// import HomeServices from '@/components/HomeServices';

import SideAdsWrapper from '@/components/ads/SideAdsWrapper';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = (await cookies()).get('user_session')?.value;
    let user = null;
    try {
        user = session ? JSON.parse(session) : null;
    } catch (e) {
        console.error("Failed to parse user session", e);
    }

    return (
        <html lang="tr" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <UserProvider user={user}>
                        <Providers>
                            <FavoritesProvider>
                                <Suspense fallback={<div className="h-16 bg-[#2d0a31] animate_pulse" />}>
                                    <Header user={user} />
                                </Suspense>
                                <main className="flex-grow">
                                    <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" /></div>}>
                                        {children}
                                    </Suspense>
                                </main>
                                <Suspense fallback={null}>
                                    <SideAdsWrapper />
                                </Suspense>
                                <SupportWidget />
                                <ScrollToTop />
                                <Footer />
                            </FavoritesProvider>
                        </Providers>
                    </UserProvider>
                </div>
            </body>
        </html>
    )
}
