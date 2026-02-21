// src/components/AdminSidebar.tsx
import { NavLink } from "react-router-dom";
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    Cog6ToothIcon,
    UsersIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AdminSidebar() {
    const base =
        "flex items-center gap-3 px-4 py-2 rounded transition-colors duration-200";

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `${base} ${isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-800"}`;

    return (
        // hidden sur mobile, visible md+
        <aside className="hidden md:block w-64 bg-gray-900 text-white min-h-screen p-6">
            <h2 className="text-2xl font-bold mb-8 tracking-wide">Admin</h2>

            <nav className="flex flex-col gap-2">
                <NavLink to="/admin" className={linkClass}>
                <HomeIcon className="w-5 h-5" />
                Dashboard
                </NavLink>

                <NavLink to="/admin/orders" className={linkClass}>
                <ClipboardDocumentListIcon className="w-5 h-5" />
                Commandes
                </NavLink>

                <NavLink to="/admin/menu" className={linkClass}>
                <Squares2X2Icon className="w-5 h-5" />
                Menu
                </NavLink>

                <NavLink to="/admin/categories" className={linkClass}>
                <Squares2X2Icon className="w-5 h-5" />
                Catégories
                </NavLink>

                <NavLink to="/admin/stats" className={linkClass}>
                <ChartBarIcon className="w-5 h-5" />
                Statistiques
                </NavLink>

                <NavLink to="/admin/settings" className={linkClass}>
                <Cog6ToothIcon className="w-5 h-5" />
                Paramètres
                </NavLink>

                <NavLink to="/admin/users" className={linkClass}>
                <UsersIcon className="w-5 h-5" />
                Utilisateurs
                </NavLink>
            </nav>
        </aside>
    );
}
