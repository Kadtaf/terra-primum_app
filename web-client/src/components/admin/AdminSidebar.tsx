// src/components/AdminSidebar.tsx
import { NavLink } from "react-router-dom";
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    Cog6ToothIcon,
    UsersIcon,
    ChartBarIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { BarChart3, ScanText } from "lucide-react";

export default function AdminSidebar() {
    const base =
        "flex items-center gap-3 px-4 py-2 rounded transition-colors duration-200";

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `${base} ${isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-800"}`;

    return (
        <aside className="hidden md:block w-64 bg-gray-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8 tracking-wide text-[var(--color-accent)]">
            Admin
        </h2>

        <nav className="flex flex-col gap-2">
            {/* --- Dashboard --- */}
            <NavLink to="/admin" className={linkClass}>
            <HomeIcon className="w-5 h-5" />
            Dashboard
            </NavLink>

            {/* --- Commandes --- */}
            <NavLink to="/admin/orders" className={linkClass}>
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Commandes
            </NavLink>

            {/* --- Menu & Catégories --- */}
            <NavLink to="/admin/menu" className={linkClass}>
            <Squares2X2Icon className="w-5 h-5" />
            Menu
            </NavLink>

            <NavLink to="/admin/categories" className={linkClass}>
            <Squares2X2Icon className="w-5 h-5" />
            Catégories
            </NavLink>

            {/* --- Statistiques --- */}
            <NavLink to="/admin/stats" className={linkClass}>
            <ChartBarIcon className="w-5 h-5" />
            Statistiques
            </NavLink>

            {/* --- Factures fournisseurs --- */}
            <div className="mt-4 mb-1 text-yellow-700 text-sm uppercase tracking-wide">
            Factures fournisseurs
            </div>

            <NavLink to="/admin/purchase-invoices" className={linkClass}>
            <DocumentTextIcon className="w-5 h-5" />
            Liste des factures
            </NavLink>

            <NavLink to="/admin/purchase-invoices/new" className={linkClass}>
            <DocumentTextIcon className="w-5 h-5" />
            Nouvelle facture
            </NavLink>

            {/* --- OCR --- */}
            <NavLink to="/admin/purchase-invoices/ocr" className={linkClass}>
            <ScanText className="w-5 h-5" />
            Créer via OCR
            </NavLink>

            <NavLink
            to="/admin/purchase-invoices/price-history"
            className={linkClass}
            >
            <ChartBarIcon className="w-5 h-5" />
            Historique des prix
            </NavLink>

            {/* --- Stock --- */}
            <div className="mt-4 mb-1 text-yellow-700 text-sm uppercase tracking-wide">
            Stock
            </div>

            <NavLink to="/admin/stock" className={linkClass}>
            <BarChart3 className="w-5 h-5 mr-2" />
            Stock ingrédients
            </NavLink>

            {/* --- Paramètres & Utilisateurs --- */}
            <div className="mt-4 mb-1 text-yellow-700 text-sm uppercase tracking-wide">
            Administration
            </div>

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
