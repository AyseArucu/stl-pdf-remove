'use client';

import Link from 'next/link';
import { useState } from 'react';
import CartSummary from './CartSummary';

type User = {
    name: string;
} | null;

export default function Navbar({ user }: { user: User }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="navbar-container">
            <div className="navbar-content">
                <Link href="/" className="site-logo">
                    Mağaza
                </Link>

                <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
                    <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Kategoriler</Link>
                    <Link href="/?category=" className="nav-link" onClick={() => setIsMenuOpen(false)}>Ürünler</Link>

                    <div className="mobile-divider"></div>

                    <div className="auth-section">
                        {user ? (
                            <span className="user-greeting">Merhaba, {user.name}</span>
                        ) : (
                            <>
                                <Link href="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Giriş Yap</Link>
                                <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setIsMenuOpen(false)}>Üye Ol</Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="desktop-cart">
                    <CartSummary />
                </div>
            </div>
        </div>
    );
}
