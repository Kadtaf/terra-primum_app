import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useSocket } from '@/hooks/useSocket';
import { Order } from '@/types/Order';

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  const token = useAuthStore.getState().token;
  const { socket, on, off } = useSocket();

  // Charger les commandes
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('/api/orders/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders || response.data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Charger les stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/orders/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data.stats || response.data.data || stats);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  }, [token, stats]);

  // Mise à jour du statut
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Mise à jour locale instantanée
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      fetchStats();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Socket.io : nouvelles commandes en temps réel
  useEffect(() => {
    if (!socket) return;

    // IMPORTANT : même callback pour on/off
    const handleNewOrder = (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    };

    on('new-order', handleNewOrder);

    return () => {
      off('new-order', handleNewOrder);
    };
  }, [socket, on, off]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Commandes</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">En Attente</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Complétées</p>
              <p className="text-3xl font-bold">{stats.completedOrders}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenu Total</p>
              <p className="text-3xl font-bold">
                {stats.totalRevenue.toFixed(2)}€
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Client
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.userId.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {order.totalPrice.toFixed(2)}€
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.deliveryType === 'delivery'
                    ? '🚚 Livraison'
                    : '🏪 Retrait'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        order.id,
                        e.target.value as Order['status'],
                      )
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
