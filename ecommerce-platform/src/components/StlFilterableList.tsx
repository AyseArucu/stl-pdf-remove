'use client';

import { useState, useMemo } from 'react';
import StlCard from './StlCard';

interface StlTag {
    id: string;
    name: string;
}

interface StlModel {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    isFree: boolean;
    fileUrl: string;
    tags: StlTag[];
    viewCount?: number;
    downloadCount?: number;
    favoriteCount?: number;
}

export default function StlFilterableList({ models }: { models: StlModel[] }) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [categorySearch, setCategorySearch] = useState('');

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Map<string, string>(); // name -> id (or just set of names)
        models.forEach(model => {
            model.tags.forEach(tag => {
                tags.set(tag.name, tag.name);
            });
        });
        return Array.from(tags.values()).sort();
    }, [models]);

    // Filter tags for sidebar search
    const filteredTags = allTags.filter(tag =>
        tag.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Filter models
    const filteredModels = useMemo(() => {
        if (!selectedTag) return models;
        return models.filter(model => model.tags.some(t => t.name === selectedTag));
    }, [models, selectedTag]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
                <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24 transition-all hover:shadow-md">
                    <div className="mb-2">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                            Kategoriler
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{allTags.length}</span>
                        </h4>

                        <div className="relative mb-4 group">
                            <input
                                type="text"
                                placeholder="Kategori ara..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all group-hover:bg-white group-hover:border-gray-300"
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                            />
                            <span className="absolute left-3 top-3 text-gray-400 group-hover:text-purple-500 transition-colors">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </div>

                        <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                            {/* "All Models" Option */}
                            {categorySearch === '' && (
                                <li>
                                    <label className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${selectedTag === null ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm ring-1 ring-purple-100' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedTag === null ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                                            {selectedTag === null && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedTag === null}
                                            onChange={() => setSelectedTag(null)}
                                        />
                                        <span className="text-sm flex-1">Tüm Modeller</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-md ${selectedTag === null ? 'bg-white text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{models.length}</span>
                                    </label>
                                </li>
                            )}

                            {filteredTags.map(tag => {
                                const count = models.filter(m => m.tags.some(t => t.name === tag)).length;
                                const isSelected = selectedTag === tag;
                                return (
                                    <li key={tag}>
                                        <label className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm ring-1 ring-purple-100' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`}>
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white group-hover:border-purple-300'}`}>
                                                {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => setSelectedTag(isSelected ? null : tag)}
                                            />
                                            <span className="text-sm flex-1 truncate">{tag}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-md ${isSelected ? 'bg-white text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
                                        </label>
                                    </li>
                                );
                            })}

                            {filteredTags.length === 0 && (
                                <li className="text-center py-8 text-gray-400 text-sm flex flex-col items-center">
                                    <span className="text-2xl mb-2">😕</span>
                                    Sonuç bulunamadı
                                </li>
                            )}
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredModels.length > 0 ? (
                        filteredModels.map((model) => (
                            <div key={model.id} className="h-full">
                                <StlCard model={model} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 text-gray-300 shadow-inner">
                                🔍
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                Aradığınız kriterlere uygun herhangi bir model bulamadık. Lütfen farklı bir kategori seçmeyi deneyin.
                            </p>
                            <button
                                onClick={() => { setSelectedTag(null); setCategorySearch(''); }}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-purple-200 active:scale-95 flex items-center gap-2"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" /><path d="M3 3v9h9" /></svg>
                                Filtreleri Temizle
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
