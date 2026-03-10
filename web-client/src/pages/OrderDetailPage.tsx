import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { ArrowLeft, Loader } from "lucide-react";
import io from "socket.io-client";
import { useNotificationStore } from "../stores/notificationStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";



interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  deliveryType: string;
  deliveryAddress?: string;
  estimatedTime?: string;
  createdAt: string;
  items?: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notification store
  const showNotif = useNotificationStore((state) => state.showNotif);

  // Tous les hooks AVANT tout return conditionnel
  useEffect(() => {
    if (!id) return;

    fetchOrder();

    const socket = io(SOCKET_URL);
    socket.emit("join-order-room", id);

    socket.on("order-status-updated", (data) => {
      if (data.orderId !== id) return;

      setOrder((prev) => {
        if (!prev) return prev;

        const oldStatus = prev.status;
        const newStatus = data.status;

        // Si le statut change → notification
        if (oldStatus !== newStatus) {
          const titles: Record<string, string> = {
            pending: "Commande reçue",
            confirmed: "Commande confirmée",
            preparing: "Préparation en cours",
            ready: "Commande prête",
            delivered: "Commande livrée",
            cancelled: "Commande annulée",
          };

          const messages: Record<string, string> = {
            pending: "Nous avons bien reçu votre commande.",
            confirmed: "Le restaurant a confirmé votre commande.",
            preparing: "Votre commande est en préparation.",
            ready: "Votre commande est prête à être récupérée.",
            delivered: "Votre commande a été livrée.",
            cancelled: "Votre commande a été annulée.",
          };

          showNotif({
            type: newStatus === "cancelled" ? "error" : "info",
            title: titles[newStatus] || "Mise à jour de votre commande",
            message: messages[newStatus] || `Statut mis à jour : ${newStatus}`,
          });
        }

        return { ...prev, status: newStatus };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur récupération commande:", err);
      setError("Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?"))
      return;

    try {
      await axios.post(
        `${API_URL}/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder((prev) =>
        prev ? { ...prev, status: "cancelled" } : prev
      );
    } catch (err) {
      console.error("Erreur annulation:", err);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      confirmed: "Confirmée",
      preparing: "En préparation",
      ready: "Prête",
      delivered: "Livrée",
      cancelled: "Annulée",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Redirection si non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirection si id invalide
  if (!id) {
    return <Navigate to="/orders" replace />;
  }

  if (loading) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted">Chargement de la commande...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <p className="text-red-600 mb-4">
          {error || "Commande non trouvée"}
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux commandes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux commandes
          </button>
          <h1 className="text-3xl font-bold">
            Commande #{order.id.slice(0, 8)}
          </h1>
        </div>

        <span
          className={`text-lg px-4 py-2 rounded-full font-semibold ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Détails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Suivi de la Commande</h2>

            <div className="space-y-4">
              {["pending", "confirmed", "preparing", "ready", "delivered"].map(
                (step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          ["pending", "confirmed", "preparing", "ready", "delivered"].indexOf(
                            order.status
                          ) >= index
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        ✓
                      </div>

                      {index < 4 && (
                        <div
                          className={`w-0.5 h-12 ${
                            ["pending", "confirmed", "preparing", "ready", "delivered"].indexOf(
                              order.status
                            ) > index
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pt-1">
                      <p className="font-semibold capitalize">
                        {getStatusLabel(step)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Articles */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Articles</h2>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center pb-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-semibold">
                      {item.product?.name || "Produit"}
                    </p>
                    <p className="text-sm text-muted">
                      Quantité: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Informations de Livraison */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Informations de Livraison
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-muted">Type:</span>{" "}
                <span className="font-semibold">
                  {order.deliveryType === "delivery"
                    ? "Livraison à domicile"
                    : "Retrait sur place"}
                </span>
              </p>

              {order.deliveryAddress && (
                <p>
                  <span className="text-muted">Adresse:</span>{" "}
                  <span className="font-semibold">
                    {order.deliveryAddress}
                  </span>
                </p>
              )}

              {order.estimatedTime && (
                <p>
                  <span className="text-muted">Heure estimée:</span>{" "}
                  <span className="font-semibold">
                    {new Date(order.estimatedTime).toLocaleTimeString("fr-FR")}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Résumé</h2>

            <div className="space-y-3 pb-4 border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted">Sous-total</span>
                <span className="font-semibold">
                  {order.totalPrice.toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total</span>
              <span className="text-primary">
                {order.totalPrice.toFixed(2)}€
              </span>
            </div>
          </div>

          {/* Informations */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Informations</h2>

            <p className="text-sm text-muted mb-4">
              Commandée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {!["delivered", "cancelled"].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                className="w-full border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50 transition font-semibold"
              >
                Annuler la commande
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}