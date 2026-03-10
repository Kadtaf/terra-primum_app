import { Link } from "react-router-dom";
import { ClipboardList, Utensils, Settings, Users } from "lucide-react";
// Page d'accueil du dashboard admin avec des liens vers les différentes sections de gestion
export default function DashboardHome() {
    return (
        <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-600">
            Bienvenue dans l’espace d’administration. Gérez les commandes, le menu,
            les utilisateurs et les paramètres du restaurant.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Commandes */}
            <Link
            to="/admin/orders"
            className="p-6 bg-white shadow rounded-lg hover:shadow-xl hover:scale-[1.02] transition transform"
            >
            <ClipboardList className="w-10 h-10 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Gestion des commandes</h2>
            <p className="text-gray-600 mt-2">
                Voir et gérer les commandes en temps réel
            </p>
            </Link>

            {/* Menu */}
            <Link
            to="/admin/menu"
            className="p-6 bg-white shadow rounded-lg hover:shadow-xl hover:scale-[1.02] transition transform"
            >
            <Utensils className="w-10 h-10 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold">Gestion du menu</h2>
            <p className="text-gray-600 mt-2">
                Ajouter, modifier ou supprimer des produits
            </p>
            </Link>

            {/* Paramètres */}
            <Link
            to="/admin/settings"
            className="p-6 bg-white shadow rounded-lg hover:shadow-xl hover:scale-[1.02] transition transform"
            >
            <Settings className="w-10 h-10 text-orange-600 mb-4" />
            <h2 className="text-xl font-semibold">Paramètres du restaurant</h2>
            <p className="text-gray-600 mt-2">
                Horaires, frais de livraison, jours fermés
            </p>
            </Link>

            {/* Utilisateurs */}
            <Link
            to="/admin/users"
            className="p-6 bg-white shadow rounded-lg hover:shadow-xl hover:scale-[1.02] transition transform"
            >
            <Users className="w-10 h-10 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
            <p className="text-gray-600 mt-2">
                Rôles, statuts, gestion des comptes
            </p>
            </Link>

        </div>
        </div>
    );
}