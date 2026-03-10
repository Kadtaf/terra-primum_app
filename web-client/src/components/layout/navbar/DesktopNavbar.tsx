import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface Props {
    handleLogout: () => void;
}

export default function DesktopNavbar({ handleLogout }: Props) {
    const { isAuthenticated, user } = useAuthStore();
    const isAdmin = isAuthenticated && user?.role === "admin";

    const { totalItems } = useCartStore();

    return (
        <div className="hidden md:flex items-center gap-8">
            <Link
                to="/menu"
                className="text-sm hover:text-[var(--color-primary)] transition"
            >
                Menu
            </Link>
            <Link
                to="/about"
                className="text-sm hover:text-[var(--color-primary)] transition"
            >
                À propos
            </Link>
            <Link
                to="/contact"
                className="text-sm hover:text-[var(--color-primary)] transition"
            >
                Contact
            </Link>

            {isAuthenticated && (
                <>
                <Link
                    to="/orders"
                    className="text-sm hover:text-[var(--color-primary)] transition"
                >
                    Commandes
                </Link>
                <Link
                    to="/loyalty"
                    className="text-sm hover:text-[var(--color-primary)] transition"
                >
                    Fidélité
                </Link>
                </>
            )}

            {isAdmin && (
                <Link
                to="/admin"
                className="text-sm hover:text-[var(--color-primary)] transition"
                >
                Admin
                </Link>
            )}

            {isAuthenticated ? (
            <div className="flex items-center gap-4">
                <Link to="/cart" className="relative hover:text-[var(--color-primary)] transition">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                        </span>
                    )}
                </Link>
                <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:text-[var(--color-primary)] transition"
                >
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user?.firstName}</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm hover:text-[var(--color-primary)] transition"
                >
                    <LogOut className="w-5 h-5" />
                </button>

                <ThemeToggle />
            </div>
            ) : (
            <div className="flex items-center gap-4">
                <Link
                    to="/login"
                    className="text-sm hover:text-[var(--color-primary)] transition"
                >
                    Connexion
                </Link>
                <Link
                    to="/register"
                    className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-primary-light)] transition"
                >
                    S'inscrire
                </Link>
                <ThemeToggle />
            </div>
            )}
        </div>
    );
}
