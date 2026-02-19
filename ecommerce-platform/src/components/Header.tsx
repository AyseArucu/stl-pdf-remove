'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaBars, FaTimes, FaEllipsisV } from 'react-icons/fa';
import { useCart } from './CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { searchProducts } from '@/app/actions';
import type { Product } from '@/lib/db';

type User = {
    name: string;
} | null;

export default function Header({ user }: { user: User }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items } = useCart();
    const { favorites } = useFavorites();
    const searchContainerRef = useRef<HTMLDivElement>(null);



    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Sync input with URL param
    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        setSearchTerm(currentSearch);
    }, [searchParams]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 0) {
                const results = await searchProducts(searchTerm);
                setSearchResults(results);
                setShowDropdown(true);
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchInput = (term: string) => {
        setSearchTerm(term);
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowDropdown(false);

        if (searchResults.length === 1) {
            // 1 Match -> Redirect to PDP
            router.push(`/product/${searchResults[0].id}`);
        } else {
            // >1 or 0 Matches -> Redirect to Result List
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            router.push(`/?${params.toString()}`);
        }
    };

    const handleProductClick = (productId: string) => {
        setShowDropdown(false);
        router.push(`/product/${productId}`);
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Anasayfa', path: '/' },
        { name: 'Web Tasarım Hizmeti', path: '/custom-site' },
        { name: '3D Modeller / STL Dosyaları', path: '/3d-modeller-stl' },
        { name: 'Blog & Haber', path: '/blog' },
    ];

    // Hide Header on Admin Pages
    if (pathname.startsWith('/erashu/admin')) {
        return null;
    }

    return (
        <header className="sticky-header">
            <div className="container">
                <div className="logo-section">
                    <Link href="/" className="site-logo" onClick={closeMenu}>
                        ERASHU & GAMİNG
                    </Link>
                </div>



                {/* Navigation Menu - Vertical Dropdown */}
                <nav className={`nav-wrapper ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-menu">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.path}
                                    className={`nav-link ${pathname === link.path ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right Actions Area (Auth only) */}
                <div className="header-actions">
                    {/* User Auth */}
                    {user ? (
                        <div className="user-menu">
                            <Link href="/account" className="action-btn user-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span className="user-name">{user.name}</span>
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                            className="login-btn"
                        >
                            Giriş Yap
                        </Link>
                    )}



                    {/* 3-Dot Menu Button (Mobile Only) */}
                    <button
                        className="menu-dot-btn"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <FaEllipsisV />
                    </button>
                </div>
            </div>


        </header >
    );
}
