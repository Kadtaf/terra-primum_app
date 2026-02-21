import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { useSocket } from "@/hooks/useSocket";
import { Order } from "@/types/Order";
import adminAxios from "@/api/adminAxios";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const token = useAuthStore.getState().token;
  const { socket, on, off } = useSocket();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  // Charger les commandes admin
  const fetchOrders = useCallback(async () => {
    try {
      const response = await adminAxios.get("/admin/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Erreur récupération commandes admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mise à jour du statut
  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await axios.put(
        `${API_URL}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
    }
  };

  // Socket.io : nouvelles commandes
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    };

    on("new-order", handleNewOrder);

    return () => {
      off("new-order", handleNewOrder);
    };
  }, [socket, on, off]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des commandes</h1>

      {/* Filtres */}
      <div className="flex gap-2">
        {["all", "pending", "confirmed", "preparing", "ready", "delivered"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Client</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Montant</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order.id.slice(0, 8)}</td>

                <td className="px-6 py-4">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : "Client supprimé"}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {Number(order.totalPrice).toFixed(2)}€
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as Order["status"])
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="preparing">En préparation</option>
                    <option value="ready">Prête</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}