import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export default function CartPage() {
  const { items, totalPrice, totalItems, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Votre Panier</h1>
        <p className="text-muted-foreground mb-8">Votre panier est vide</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Votre Panier</h1>
        <p className="text-muted-foreground">{totalItems} article(s)</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-card border border-border rounded-lg p-4 flex gap-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold mb-2">{item.name}</h3>
                <p className="text-primary font-semibold mb-3">
                  {(item.price * item.quantity).toFixed(2)}€
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="bg-secondary p-1 rounded hover:bg-secondary/80 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="bg-secondary p-1 rounded hover:bg-secondary/80 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-destructive hover:bg-destructive/10 p-2 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Résumé</h2>
          <div className="space-y-3 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-semibold">{totalPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frais de livraison</span>
              <span className="font-semibold">À définir</span>
            </div>
          </div>
          <div className="flex justify-between mb-6 text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{totalPrice.toFixed(2)}€</span>
          </div>
          <Link
            to={isAuthenticated ? '/checkout' : '/login'}
            className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-semibold mb-3"
          >
            {isAuthenticated ? 'Procéder au paiement' : 'Se connecter pour commander'}
          </Link>
          <button
            onClick={() => clearCart()}
            className="w-full border border-border py-2 rounded-lg hover:bg-secondary transition"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}
