import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

export default function CartSummary() {
  const { items, total, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="card text-center py-8">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted opacity-50" />
        <p className="text-muted mb-4">Votre panier est vide</p>
        <a href="/menu" className="btn btn-primary">
          Continuer vos achats
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Résumé du Panier</h2>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-muted">{item.price.toFixed(2)}€</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-1 hover:bg-border rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-semibold">{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-border rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 p-1 text-error hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="ml-4 text-right">
                <p className="font-bold">
                  {(item.price * item.quantity).toFixed(2)}€
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-muted">
            <span>Sous-total</span>
            <span>{total.toFixed(2)}€</span>
          </div>

          <div className="flex justify-between text-muted">
            <span>Frais de livraison</span>
            <span>2.50€</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t border-border pt-2">
            <span>Total</span>
            <span className="text-primary">{(total + 2.50).toFixed(2)}€</span>
          </div>
        </div>

        <button className="w-full btn btn-primary mt-6">
          Procéder au paiement
        </button>
      </div>
    </div>
  );
}
