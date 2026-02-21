// src/components/admin/AdminSidebarMobile.tsx
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

interface AdminSidebarMobileProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function AdminSidebarMobile({
    open,
    setOpen,
    }: AdminSidebarMobileProps) {
    const base =
        "flex items-center gap-3 px-4 py-2 rounded transition-colors duration-200";

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `${base} ${isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-800"}`;

    return (
        <>
        {/* BACKDROP */}
        <div
            className={`
            fixed inset-0 bg-black/40 z-[9998]
            transition-opacity duration-300
            ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
            onClick={() => setOpen(false)}
        />

        {/* DRAWER */}
        <div
            className={`
            fixed top-0 left-0 h-full w-[80vw] max-w-xs bg-gray-900 text-white
            z-[9999] shadow-xl border-r border-gray-800
            transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${open ? "translate-x-0" : "-translate-x-full"}
            `}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <span className="font-semibold text-lg">Admin</span>
                <button onClick={() => setOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="p-4 flex flex-col gap-2">
                <NavLink
                    to="/admin"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Commandes
                </NavLink>

                <NavLink
                    to="/admin/menu"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Menu
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Catégories
                </NavLink>

                <NavLink
                    to="/admin/stats"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Statistiques
                </NavLink>

                <NavLink
                    to="/admin/settings"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Paramètres
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={linkClass}
                    onClick={() => setOpen(false)}
                >
                    Utilisateurs
                </NavLink>
            </nav>
        </div>
        </>
    );
}
