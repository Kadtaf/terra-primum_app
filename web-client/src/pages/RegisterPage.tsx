import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNotificationStore } from "@/stores/notificationStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);

  const showNotif = useNotificationStore((state) => state.showNotif);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setLocalError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await register(email, password, firstName, lastName, phone);

      // Notification globale premium
      showNotif({
        type: "success",
        title: "Inscription réussie",
        message: "Votre compte a été créé avec succès.",
      });

      // Toast local
      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter.",
      });

      // Navigation avec délai pour laisser apparaître la notification
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch {
      const msg = error || "Impossible de créer le compte";

      // Notification globale premium
      showNotif({
        type: "error",
        title: "Échec de l'inscription",
        message: msg,
      });

      // Toast local
      toast({
        variant: "destructive",
        title: "Erreur",
        description: msg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">
              Le Local en Mouvement
            </span>
          </div>
          <p className="text-muted-foreground">
            Créez votre compte en quelques secondes
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-8 space-y-6"
        >
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Prénom *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Nom *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Téléphone (optionnel)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2">
              Mot de passe *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2">
              Confirmer le mot de passe *
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Local Error */}
          {localError && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-lg text-sm">
              {localError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
          >
            {isLoading ? "Création du compte..." : "Créer mon compte"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
