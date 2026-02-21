import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";

export default function CartSummary() {
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();

  const deliveryFee = 2.5;

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 mb-4">Votre panier est vide</p>

        <Link
          to="/menu"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Continuer vos achats
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Résumé du Panier</h2>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.price.toFixed(2)}€</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
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

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Frais de livraison</span>
            <span>{deliveryFee.toFixed(2)}€</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>Total</span>
            <span className="text-blue-600">
              {(totalPrice + deliveryFee).toFixed(2)}€
            </span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="w-full block text-center bg-blue-600 text-white py-3 rounded mt-6 hover:bg-blue-700"
        >
          Procéder au paiement
        </Link>
      </div>
    </div>
  );
}