
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Leaf } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useState } from 'react';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-primary hidden sm:inline">
                Le Local en Mouvement
              </span>
              <span className="text-xl font-bold text-primary sm:hidden">
                Local
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/menu" className="text-sm hover:text-primary transition">
                Menu
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/orders" className="text-sm hover:text-primary transition">
                    Commandes
                  </Link>
                  <Link to="/loyalty" className="text-sm hover:text-primary transition">
                    Fidélité
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin/orders" className="text-sm hover:text-primary transition">
                  Admin
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Panier */}
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 hover:text-primary transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user?.firstName}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm hover:text-primary transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-4">
                  <Link to="/login" className="text-sm hover:text-primary transition">
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border">
              <Link
                to="/menu"
                className="block py-2 text-sm hover:text-primary transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="block py-2 text-sm hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Commandes
                  </Link>
                  <Link
                    to="/loyalty"
                    className="block py-2 text-sm hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fidélité
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 text-sm hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  {isAdmin && (
                      <Link
                        to="/admin/orders"
                        className="block py-2 text-sm hover:text-primary transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm hover:text-primary transition"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-sm hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-sm hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Le Local en Mouvement</h4>
              <p className="text-sm text-muted-foreground">
                Restauration rapide premium à Bordeaux
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/menu" className="hover:text-primary transition">Menu</Link></li>
                <li><Link to="/cart" className="hover:text-primary transition">Panier</Link></li>
                {isAuthenticated && (
                  <li><Link to="/orders" className="hover:text-primary transition">Commandes</Link></li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: contact@local-en-mouvement.fr</li>
                <li>Tél: +33 5 XX XX XX XX</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Horaires</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Lun-Jeu: 11h-22h</li>
                <li>Ven-Sam: 11h-23h</li>
                <li>Dim: 12h-22h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Le Local en Mouvement. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
