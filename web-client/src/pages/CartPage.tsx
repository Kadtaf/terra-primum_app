
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";

export default function CartPage() {
  const { items, totalPrice, totalItems, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();

  const deliveryFee = 2.5; // Optionnel : frais fixes

  if (items.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">Votre Panier</h1>
        <p className="text-muted mb-8">Votre panier est vide</p>

        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-primary-light)] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Votre Panier</h1>
        <p className="text-muted">{totalItems} article(s)</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-4 flex gap-4 shadow-sm"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-secondary rounded flex items-center justify-center text-muted">
                  Pas d’image
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-bold mb-2">{item.name}</h3>

                <p className="text-[var(--color-primary)] font-semibold mb-3">
                  {(item.price * item.quantity).toFixed(2)}€
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="bg-secondary p-1 rounded hover:bg-secondary/80 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="bg-secondary p-1 rounded hover:bg-secondary/80 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-[var(--color-error)] hover:bg-red-50 p-2 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-6 h-fit shadow-sm">
          <h2 className="text-xl font-bold mb-4">Résumé</h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-[var(--color-border)]">
            <div className="flex justify-between">
              <span className="text-muted">Sous-total</span>
              <span className="font-semibold">{totalPrice.toFixed(2)}€</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted">Frais de livraison</span>
              <span className="font-semibold">{deliveryFee.toFixed(2)}€</span>
            </div>
          </div>

          <div className="flex justify-between mb-6 text-lg font-bold">
            <span>Total</span>
            <span className="text-[var(--color-primary)]">
              {(totalPrice + deliveryFee).toFixed(2)}€
            </span>
          </div>

          <Link
            to={isAuthenticated ? "/checkout" : "/login"}
            className="w-full block text-center bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[var(--color-primary-light)] transition font-semibold mb-3"
          >
            {isAuthenticated
              ? "Procéder au paiement"
              : "Se connecter pour commander"}
          </Link>

          <button
            onClick={() => {
              if (confirm("Voulez-vous vraiment vider le panier ?")) {
                clearCart();
              }
            }}
            className="w-full border border-[var(--color-border)] py-2 rounded-lg hover:bg-secondary transition"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}