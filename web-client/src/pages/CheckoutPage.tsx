import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pour la démo, on simule le paiement
      // En production, vous utiliseriez Stripe Payment Intent
      const response = await axios.post(
        `${API_URL}/orders`,
        {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          deliveryType,
          deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
          paymentMethodId: 'pm_card_visa', // Simulé
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      navigate(`/orders/${response.data.order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Finaliser la Commande</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Informations Client */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Informations Client</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nom</label>
                  <input
                    type="text"
                    value={`${user?.firstName} ${user?.lastName}`}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Type de Livraison */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Type de Livraison</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={(e) => setDeliveryType(e.target.value as 'pickup')}
                    className="w-4 h-4"
                  />
                  <span>Retrait sur place</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={(e) => setDeliveryType(e.target.value as 'delivery')}
                    className="w-4 h-4"
                  />
                  <span>Livraison à domicile</span>
                </label>
              </div>
            </div>

            {/* Adresse de Livraison */}
            {deliveryType === 'delivery' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Adresse de Livraison</h2>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Entrez votre adresse..."
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Bouton Soumettre */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Confirmer la Commande'}
            </button>
          </form>
        </div>

        {/* Résumé */}
        <div className="bg-card border border-border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Résumé</h2>
          <div className="space-y-2 mb-6 pb-6 border-b border-border">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{totalPrice.toFixed(2)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}
