import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { LogOut, User } from "lucide-react";
import type { AxiosError } from "axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading, isAuthenticated } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirection si non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage({ type: "error", text: "Le prénom et le nom sont obligatoires." });
      return;
    }

    try {
      await updateProfile(formData.firstName, formData.lastName, formData.phone);

      setMessage({ type: "success", text: "Profil mis à jour avec succès." });
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Erreur lors de la mise à jour du profil.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <User className="w-8 h-8" />
          Mon Profil
        </h1>
        <p className="text-muted">Gérez vos informations personnelles</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-lg p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 XX XX XX XX"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
                >
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-border py-2 rounded-lg hover:bg-secondary transition font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <p className="text-sm text-muted mb-1">Prénom</p>
                <p className="text-lg font-semibold">{user?.firstName}</p>
              </div>

              <div>
                <p className="text-sm text-muted mb-1">Nom</p>
                <p className="text-lg font-semibold">{user?.lastName}</p>
              </div>

              <div>
                <p className="text-sm text-muted mb-1">Email</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition font-semibold"
              >
                Modifier le Profil
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Points */}
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted mb-2">Points de Fidélité</p>
            <p className="text-3xl font-bold text-primary mb-4">
              {user?.loyaltyPoints || 0}
            </p>

            <a
              href="/loyalty"
              className="inline-block text-primary hover:underline font-semibold text-sm"
            >
              Voir mon compte fidélité →
            </a>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full border border-red-500 text-red-600 py-3 rounded-lg hover:bg-red-50 transition font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Se Déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}