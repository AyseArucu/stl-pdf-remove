import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'

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

import SideAdsWrapper from '@/components/ads/SideAdsWrapper';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = cookies().get('user_session')?.value;
    let user = null;
    try {
        user = session ? JSON.parse(session) : null;
    } catch (e) {
        console.error("Failed to parse user session", e);
    }

    return (
        <html lang="tr">
            <body className={inter.className}>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <UserProvider user={user}>
                        <Providers>
                            <FavoritesProvider>
                                <Header user={user} />
                                <main className="flex-grow">
                                    {children}
                                </main>
                                <SideAdsWrapper />
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
