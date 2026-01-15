'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
}

export default function NavBar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                }
            })
            .catch((err) => console.error('Failed to fetch user:', err));
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-white/5">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent hover:opacity-80 transition-opacity">
                AI Media Planner
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary hidden sm:inline-block">
                            {user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-lg transition-colors border border-transparent hover:border-foreground/10"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/10 rounded-lg transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-foreground rounded-lg transition-colors shadow-lg shadow-primary/20"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
