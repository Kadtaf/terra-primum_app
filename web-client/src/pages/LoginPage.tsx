import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Leaf } from 'lucide-react';
import { useNotificationStore } from "@/stores/notificationStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
 

    const showNotif = useNotificationStore((state) => state.showNotif);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);

      showNotif({
        type: "success",
        title: "Connexion réussie",
        message: "Bienvenue dans votre espace.",
      });

      navigate("/");
    } catch (err) {
      const msg = error || "Erreur lors de la connexion";

      showNotif({
        type: "error",
        title: "Échec de la connexion",
        message: msg,
      });

      setLocalError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Notification */}
        

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">
              Le Local en Mouvement
            </span>
          </div>
          <p className="text-muted-foreground">Connectez-vous à votre compte</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Error */}
          {(localError || error) && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-lg text-sm">
              {localError || error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
          >
            {isLoading ? "Connexion..." : "Se Connecter"}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-semibold"
            >
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
