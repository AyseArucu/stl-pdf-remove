'use client';

import { useState, useEffect } from 'react';
import { Category, Product } from '@prisma/client';

type FilterState = {
    categoryIds: string[];
    minPrice: string;
    maxPrice: string;
    colors: string[];
    stockStatus: string[]; // 'in-stock' | 'out-of-stock'
};

type ProductDTO = Omit<Product, 'createdAt'> & { createdAt: string | Date };

type SidebarProps = {
    categories: Category[];
    products: (Product | ProductDTO)[]; // Needed to extract available colors/prices dynamically if desired
    onFilterChange: (filters: FilterState) => void;
    initialFilters?: Partial<FilterState>;
    isOpen: boolean; // For mobile visibility
    onClose: () => void; // For closing mobile drawer
};

export default function Sidebar({ categories, products, onFilterChange, initialFilters, isOpen, onClose }: SidebarProps) {
    const [filters, setFilters] = useState<FilterState>({
        categoryIds: initialFilters?.categoryIds || [],
        minPrice: initialFilters?.minPrice || '',
        maxPrice: initialFilters?.maxPrice || '',
        colors: initialFilters?.colors || [],
        stockStatus: initialFilters?.stockStatus || [],
    });

    // Extract unique colors from products
    const availableColors = Array.from(new Set(products.map(p => p.color).filter(Boolean))) as string[];

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleCategoryChange = (catId: string) => {
        setFilters(prev => {
            const newCatIds = prev.categoryIds.includes(catId)
                ? prev.categoryIds.filter(id => id !== catId)
                : [...prev.categoryIds, catId];
            return { ...prev, categoryIds: newCatIds };
        });
    };

    const handleColorChange = (color: string) => {
        setFilters(prev => {
            const newColors = prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color];
            return { ...prev, colors: newColors };
        });
    };

    const handleStockStatusChange = (status: string) => {
        setFilters(prev => {
            const newStatus = prev.stockStatus.includes(status)
                ? prev.stockStatus.filter(s => s !== status)
                : [...prev.stockStatus, status];
            return { ...prev, stockStatus: newStatus };
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const [categorySearch, setCategorySearch] = useState('');

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    return (
        <>
            {/* Desktop & Mobile Drawer Overlay */}
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

            <aside className={`sidebar-container ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-header mobile-only">
                    <h3>Filtreler</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>



                <div className="filter-group">
                    <h4 className="filter-title">Kategoriler</h4>

                    <input
                        type="text"
                        placeholder="Kategori ara..."
                        className="category-search-input"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                    />

                    <ul className="filter-list category-list-scrollable">
                        {filteredCategories.map(cat => (
                            <li key={cat.id} className="filter-item">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filters.categoryIds.includes(cat.id)}
                                        onChange={() => handleCategoryChange(cat.id)}
                                    />
                                    <span className="checkbox-text">{cat.name}</span>
                                </label>
                            </li>
                        ))}
                        {filteredCategories.length === 0 && (
                            <li className="no-result-text">Sonuç bulunamadı.</li>
                        )}
                    </ul>

                    {/* Stock Status Merged Here */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <h4 className="filter-title" style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>Stok Durumu</h4>
                        <ul className="filter-list">
                            <li className="filter-item">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filters.stockStatus.includes('in-stock')}
                                        onChange={() => handleStockStatusChange('in-stock')}
                                    />
                                    <span className="checkbox-text">Stokta Var</span>
                                </label>
                            </li>
                            <li className="filter-item">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filters.stockStatus.includes('out-of-stock')}
                                        onChange={() => handleStockStatusChange('out-of-stock')}
                                    />
                                    <span className="checkbox-text">Stokta Yok</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>



                <div className="filter-group">
                    <h4 className="filter-title">Fiyat Aralığı</h4>
                    <div className="price-inputs">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="En Az"
                            value={filters.minPrice}
                            onChange={handlePriceChange}
                            className="price-input"
                        />
                        <span className="price-separator">-</span>
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="En Çok"
                            value={filters.maxPrice}
                            onChange={handlePriceChange}
                            className="price-input"
                        />
                    </div>
                </div>



                <div className="mobile-only filter-actions">
                    <button className="btn btn-primary full-width" onClick={onClose}>
                        Sonuçları Göster
                    </button>
                </div>
            </aside>
        </>
    );
}
