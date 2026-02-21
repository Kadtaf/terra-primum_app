import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import GlobalLoader from "./GlobalLoader";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, isLoading } = useAuthStore();

    // Pendant le chargement (loadUser), on affiche le loader global
    if (isLoading) {
        return <GlobalLoader />;
    }

    // Si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Sinon, accès autorisé
    return children;
}