import { Link } from "react-router-dom";

export default function DashboardHome() {
    return (
        <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
            to="/admin/orders"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
            >
            <h2 className="text-xl font-semibold">Gestion des commandes</h2>
            <p className="text-gray-600 mt-2">Voir et gérer les commandes en temps réel</p>
            </Link>

            <Link
            to="/admin/menu"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
            >
            <h2 className="text-xl font-semibold">Gestion du menu</h2>
            <p className="text-gray-600 mt-2">Ajouter, modifier ou supprimer des produits</p>
            </Link>

            <Link
            to="/admin/settings"
            className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition"
            >
            <h2 className="text-xl font-semibold">Paramètres du restaurant</h2>
            <p className="text-gray-600 mt-2">Horaires, frais de livraison, jours fermés</p>
            </Link>
        </div>
        </div>
    );
}