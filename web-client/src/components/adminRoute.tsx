import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

// Ce composant bloque l'accès à une route si l'utilisateur n'est pas authentifié ou n'est pas admin. Si l'utilisateur est authentifié et est admin, il rend les enfants (la route protégée). Sinon, il redirige vers la page de connexion ou la page d'accueil.
export default function AdminRoute({ children }: { children: JSX.Element }) {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}