'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

type FavoritesContextType = {
    favorites: string[];
    addToFavorites: (productId: string) => void;
    removeFromFavorites: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // We can't use useUser here because FavoritesContext is rendered inside UserProvider in layout?
    // Wait, in layout.tsx:
    // <UserProvider user={user}> <FavoritesProvider> ... </FavoritesProvider> </UserProvider>
    // So yes we can. but we need to import it.

    // However, to avoid circular deps or complex imports if UserContext is simple, let's just use it.
    // Dynamic import of actions to avoid build issues?

    // The previous implementation used localStorage only.
    // We want: IF USER -> DB. IF NO USER -> LocalStorage.

    // We need to inject user or use hook.
    // Since I can't easily see if useUser is exported effectively broadly or if it causes issues,
    // I will try to use `useUser()`.

    const { user } = useUser();

    useEffect(() => {
        const loadFavorites = async () => {
            if (user) {
                // Fetch from server
                try {
                    const { getFavorites } = await import('@/app/actions');
                    // We need to pass userId. user object usually has id.
                    // Check User type in UserContext.tsx. It has name, email, role. 
                    // Does it have ID?
                    // UserContext definitions showed:
                    // type User = { name: string; email: string; role: ... } | null;
                    // It does NOT have ID in the type definition!
                    // I need to update UserContext type definition first or cast it.
                    // The actual user object from cookies likely has ID.

                    const userWithId = user as any;
                    if (userWithId.id) {
                        const serverFavorites = await getFavorites(userWithId.id);
                        setFavorites(serverFavorites);
                    }
                } catch (e) {
                    console.error('Failed to load server favorites', e);
                }
            } else {
                // Load from LocalStorage
                const stored = localStorage.getItem('app_favorites');
                if (stored) {
                    try {
                        setFavorites(JSON.parse(stored));
                    } catch (e) { }
                }
            }
            setIsLoaded(true);
        };

        loadFavorites();
    }, [user]);

    useEffect(() => {
        if (isLoaded && !user) {
            localStorage.setItem('app_favorites', JSON.stringify(favorites));
        }
    }, [favorites, isLoaded, user]);

    const addToFavorites = async (productId: string) => {
        if (!favorites.includes(productId)) {
            setFavorites((prev) => [...prev, productId]);

            if (user) {
                try {
                    const { toggleProductFavorite } = await import('@/app/actions');
                    await toggleProductFavorite(productId, true);
                } catch (e) { console.error('Add fav error', e); }
            }
        }
    };

    const removeFromFavorites = async (productId: string) => {
        setFavorites((prev) => prev.filter((id) => id !== productId));

        if (user) {
            try {
                const { toggleProductFavorite } = await import('@/app/actions');
                await toggleProductFavorite(productId, false);
            } catch (e) { console.error('Remove fav error', e); }
        }
    };

    const isFavorite = (productId: string) => {
        return favorites.includes(productId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
