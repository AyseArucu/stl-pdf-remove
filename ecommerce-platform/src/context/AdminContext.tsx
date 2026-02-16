'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminTranslations, AdminDictionary } from '@/lib/admin-dictionary';

type Language = 'TR' | 'EN';

type AdminContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: AdminDictionary;
    theme: string;
    toggleTheme: () => void;
    permissions: string[];
    setPermissions: (perms: string[]) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children, initialPermissions = [] }: { children: React.ReactNode, initialPermissions?: string[] }) {
    const [language, setLanguageState] = useState<Language>('TR');
    const [theme, setTheme] = useState('light');
    const [permissions, setPermissions] = useState<string[]>(initialPermissions);

    // Load from localStorage
    useEffect(() => {
        const storedLang = localStorage.getItem('admin_lang') as Language;
        if (storedLang && (storedLang === 'TR' || storedLang === 'EN')) {
            setLanguageState(storedLang);
        }

        const storedTheme = localStorage.getItem('admin_theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('admin_lang', lang);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('admin_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };


    const t = adminTranslations[language];

    return (
        <AdminContext.Provider value={{ language, setLanguage, t, theme, toggleTheme, permissions, setPermissions }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
