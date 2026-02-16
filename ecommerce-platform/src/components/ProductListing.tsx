'use client';

import { useState, useMemo, useEffect } from 'react';
import { Category, Product } from '@prisma/client';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import Link from 'next/link';
import Hero from './Hero';
import { useSearchParams } from 'next/navigation';

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

type Props = {
    products: ProductDTO[];
    categories: Category[];
};

export default function ProductListing({ products, categories }: Props) {
    const searchParams = useSearchParams();
    const initialSort = searchParams.get('sort') || 'price-asc';

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        categoryIds: [] as string[],
        minPrice: '',
        maxPrice: '',
        colors: [] as string[],
        stockStatus: [] as string[],
    });
    const [currentPage, setCurrentPage] = useState(1);

    const [sortOption, setSortOption] = useState(initialSort);
    const [gridColumns, setGridColumns] = useState(5);

    // Update sort/filter option if URL param changes
    useEffect(() => {
        const currentSort = searchParams.get('sort');
        if (currentSort) {
            setSortOption(currentSort);
        }

        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setFilters(prev => ({
                ...prev,
                categoryIds: [categoryParam]
            }));
        }
    }, [searchParams]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(product => {
            // Category Filter
            if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(product.categoryId)) {
                return false;
            }

            // Color Filter
            if (filters.colors.length > 0 && (!product.color || !filters.colors.includes(product.color))) {
                return false;
            }

            // Price Filter
            const price = product.price;
            if (filters.minPrice && price < Number(filters.minPrice)) return false;
            if (filters.maxPrice && price > Number(filters.maxPrice)) return false;

            // Stock Status Filter
            if (filters.stockStatus.length > 0) {
                const isStockSelected = filters.stockStatus.includes('in-stock');
                const isOutOfStockSelected = filters.stockStatus.includes('out-of-stock');

                // If both are selected, do nothing (implied show all)
                // If only one is selected, filter accordingly
                if (isStockSelected && !isOutOfStockSelected) {
                    if (product.stock <= 0) return false;
                }
                if (!isStockSelected && isOutOfStockSelected) {
                    if (product.stock > 0) return false;
                }
            }

            return true;
        });

        // Sorting Logic
        result.sort((a, b) => {
            switch (sortOption) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'favorites':
                    return (b.favoriteCount || 0) - (a.favoriteCount || 0);
                case 'newest':
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                default:
                    return 0;
            }
        });

        return result;
    }, [products, filters, sortOption]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortOption]);

    // Pagination Logic
    const ITEMS_PER_PAGE = 30;
    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredAndSortedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Derived Category Title
    const currentCategoryTitle = useMemo(() => {
        if (filters.categoryIds.length === 1) {
            const cat = categories.find(c => c.id === filters.categoryIds[0]);
            return cat ? cat.name : 'Tüm Ürünler';
        } else if (filters.categoryIds.length > 1) {
            return 'Seçili Kategoriler';
        }
        return 'Tüm Ürünler';
    }, [filters.categoryIds, categories]);

    return (
        <>
            <main className="listing-page-container main-content">
                {/* Mobile Filter Button */}
                <div className="mobile-filter-bar mobile-only">
                    <button className="btn-filter-toggle" onClick={() => setIsSidebarOpen(true)}>
                        <span className="icon">⚡</span> Filtrele
                    </button>
                    <span className="result-count">{filteredAndSortedProducts.length} Ürün</span>
                </div>

                <div className="listing-layout">
                    <div className="listing-sidebar">
                        <Sidebar
                            categories={categories}
                            products={products}
                            onFilterChange={setFilters}
                            isOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>

                    <section className="listing-products">
                        <div className="section-header desktop-only">
                            <h2 className="category-page-title">{currentCategoryTitle}</h2>

                            <div className="listing-controls">
                                {/* Sort Dropdown */}
                                <div className="sort-dropdown-wrapper">
                                    <select
                                        className="sort-select"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="price-asc">Fiyat Artan</option>
                                        <option value="price-desc">Fiyat Azalan</option>
                                        <option value="rating">Yüksek Puanlılar</option>
                                        <option value="favorites">En Çok Beğenilenler</option>
                                        <option value="newest">En Yeniler</option>
                                    </select>
                                </div>

                                <span className="product-count-label">{filteredAndSortedProducts.length} ürün</span>

                                {/* View Toggle */}
                                <div className="view-toggles">
                                    <button
                                        className={`view-btn ${gridColumns === 4 ? 'active' : ''}`}
                                        onClick={() => setGridColumns(4)}
                                        aria-label="4 Columns"
                                        title="4'lü Görünüm"
                                    >
                                        <div className="grid-icon grid-icon-4">
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={i} className="grid-cell"></div>
                                            ))}
                                        </div>
                                    </button>
                                    <button
                                        className={`view-btn ${gridColumns === 5 ? 'active' : ''}`}
                                        onClick={() => {
                                            console.log('Switching to 5 columns');
                                            setGridColumns(5);
                                        }}
                                        aria-label="5 Columns"
                                        title="5'li Görünüm"
                                    >
                                        <div className="grid-icon grid-icon-5">
                                            {Array.from({ length: 15 }).map((_, i) => (
                                                <div key={i} className="grid-cell"></div>
                                            ))}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {paginatedProducts.length > 0 ? (
                            <>
                                <div
                                    className="product-grid"
                                    style={{
                                        '--grid-cols': gridColumns
                                    } as React.CSSProperties}
                                >
                                    {paginatedProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            categoryName={categories.find(c => c.id === product.categoryId)?.name}
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pagination-container">
                                        <button
                                            className="page-btn prev"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            &lt;
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                            <button
                                                key={pageNum}
                                                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                        <button
                                            className="page-btn next"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <p>Bu filtrelemeye uygun ürün bulunamadı.</p>
                                <button onClick={() => setFilters({ categoryIds: [], minPrice: '', maxPrice: '', colors: [], stockStatus: [] })} className="btn btn-outline">
                                    Filtreleri Temizle
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
