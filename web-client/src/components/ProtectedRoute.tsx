import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
// Ce composant bloque l'accès à une route si l'utilisateur n'est pas authentifié. Si l'utilisateur est authentifié, il rend les enfants (la route protégée). Sinon, il redirige vers la page de connexion.
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}