import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function AdminRoute({ children }: { children: JSX.Element }) {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    // 1. Si le store charge encore l'utilisateur
    if (isLoading) {
        return <div className="text-center py-8">Vérification des accès...</div>;
    }

    // 2. Si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si l'utilisateur est connecté mais pas admin
    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // 4. Accès autorisé
    return children;
}