import { Link } from "react-router-dom";

export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Admin</h2>

        <nav className="flex flex-col gap-4">
            <Link to="/admin" className="hover:text-yellow-400">Dashboard</Link>
            <Link to="/admin/orders" className="hover:text-yellow-400">Commandes</Link>
            <Link to="/admin/menu" className="hover:text-yellow-400">Menu</Link>
            <Link to="/admin/settings" className="hover:text-yellow-400">Paramètres</Link>
        </nav>
        </aside>
    );
}