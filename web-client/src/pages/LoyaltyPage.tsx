import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../stores/authStore";
import { Gift, TrendingUp } from "lucide-react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface LoyaltyData {
  points: number;
  redeemableAmount: number;
}

interface Transaction {
  id: string;
  points: number;
  type: "earned" | "redeemed";
  createdAt: string;
}

export default function LoyaltyPage() {
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  // Redirection si non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);

      const [loyaltyRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/loyalty/points`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/loyalty/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setLoyalty(loyaltyRes.data);
      setTransactions(historyRes.data);
      setError(null);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Erreur lors du chargement des données de fidélité");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!loyalty || loyalty.points < 100) return;

    setRedeemLoading(true);
    setMessage(null);

    try {
      await axios.post(
        `${API_URL}/loyalty/redeem`,
        { points: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Vous avez utilisé 100 points et obtenu 10€ de réduction !");
      await fetchLoyaltyData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Erreur lors de l'utilisation des points");
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-bold">Programme de Fidélité</h1>

      {/* Points Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm opacity-90 mb-2">Vos Points</p>
            <p className="text-5xl font-bold">{loyalty?.points || 0}</p>
            <p className="text-sm opacity-90 mt-4">Gagnez 1 point par euro dépensé</p>
          </div>

          <div>
            <p className="text-sm opacity-90 mb-2">Réduction Disponible</p>
            <p className="text-5xl font-bold">{loyalty?.redeemableAmount || 0}€</p>
            <p className="text-sm opacity-90 mt-4">100 points = 10€ de réduction</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
          {message}
        </div>
      )}

      {/* Redeem Button */}
      <button
        onClick={handleRedeemPoints}
        disabled={!loyalty || loyalty.points < 100 || redeemLoading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Gift className="w-5 h-5" />
        {redeemLoading ? "Traitement..." : "Utiliser 100 Points (10€)"}
      </button>

      {/* Avantages */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Comment ça marche ?
        </h2>

        <div className="space-y-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {step}
              </div>

              <div>
                {step === 1 && (
                  <>
                    <h3 className="font-bold mb-1">Gagnez des Points</h3>
                    <p className="text-sm text-muted">Vous gagnez 1 point pour chaque euro dépensé</p>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="font-bold mb-1">Accumulez les Points</h3>
                    <p className="text-sm text-muted">100 points = 10€ de réduction</p>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="font-bold mb-1">Utilisez votre Réduction</h3>
                    <p className="text-sm text-muted">Appliquez votre réduction lors du paiement</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Historique</h2>

        {transactions.length === 0 ? (
          <p className="text-muted">Aucune transaction</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center pb-3 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="font-semibold">
                    {transaction.type === "earned" ? "Points gagnés" : "Points utilisés"}
                  </p>
                  <p className="text-sm text-muted">
                    {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    transaction.type === "earned" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "earned" ? "+" : "-"}
                  {Math.abs(transaction.points)} pts
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}