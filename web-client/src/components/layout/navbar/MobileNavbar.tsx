// src/components/layout/navbar/MobileNavbar.tsx
import { Link } from "react-router-dom";
import { X, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/hooks/useTheme";

interface MobileNavbarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (value: boolean) => void;
    handleLogout: () => void;
    setAdminDrawerOpen: (value: boolean) => void;
}

export default function MobileNavbar({
    mobileMenuOpen,
    setMobileMenuOpen,
    handleLogout,
    setAdminDrawerOpen,
    }: MobileNavbarProps) {
    const { isAuthenticated, user } = useAuthStore();
    const { theme, setTheme } = useTheme();

    const isAdmin = isAuthenticated && user?.role === "admin";

    return (
        <>
        {/* BACKDROP */}
        <div
            className={`
            fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]
            transition-opacity duration-300
            ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
            onClick={() => setMobileMenuOpen(false)}
        />

        {/* PANEL */}
        <div
            className={`
            fixed top-0 right-0 h-full
            w-[80vw] max-w-xs sm:w-72
            bg-[var(--color-background)]
            border-l border-[var(--color-border)] shadow-xl
            z-[9999]
            transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
        >
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
            <span className="font-semibold text-lg">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
            </button>
            </div>

            <div className="p-4 space-y-4 flex flex-col">
            <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>
                Menu
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                À propos
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
            </Link>

            {isAuthenticated ? (
                <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                    Commandes
                </Link>
                <Link to="/loyalty" onClick={() => setMobileMenuOpen(false)}>
                    Fidélité
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profil
                </Link>

                {isAdmin && (
                    <button
                    onClick={() => {
                        setAdminDrawerOpen(true);
                        setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm hover:text-[var(--color-primary)] transition"
                    >
                    Admin
                    </button>
                )}

                <button
                    onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm hover:text-[var(--color-primary)] transition"
                >
                    Déconnexion
                </button>
                </>
            ) : (
                <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Connexion
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    S'inscrire
                </Link>
                </>
            )}
            </div>

            {/* Theme toggle */}
            <div className="pt-6 mt-6 border-t border-[var(--color-border)]">
                <button
                    onClick={() => {
                    if (theme === "light") setTheme("dark");
                    else if (theme === "dark") setTheme("system");
                    else setTheme("light");
                    }}
                    className="flex items-center gap-3 text-sm rounded-lg hover:bg-[var(--color-border)] hover:text-[var(--color-primary)] transition"
                >
                    {theme === "dark" ? (
                    <>
                        <Moon className="w-5 h-5" />
                        Mode sombre
                    </>
                    ) : theme === "light" ? (
                    <>
                        <Sun className="w-5 h-5" />
                        Mode clair
                    </>
                    ) : (
                    <>
                        <span className="text-xs font-semibold">AUTO</span>
                        Mode automatique
                    </>
                    )}
                </button>
            </div>
        </div>
        </>
    );
}
