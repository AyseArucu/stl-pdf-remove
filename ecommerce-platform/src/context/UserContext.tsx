'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'CUSTOMER';
} | null;

type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, user: initialUser }: { children: React.ReactNode; user: User }) {
    const [user, setUser] = useState<User>(initialUser);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
