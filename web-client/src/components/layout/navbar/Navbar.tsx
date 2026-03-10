// src/components/layout/navbar/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import Logo from "./Logo";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import AdminSidebarMobile from "@/components/admin/AdminSidebarMobile";

export default function Navbar() {
  const { totalItems } = useCartStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("mobile-navbar-portal");
    setPortalTarget(el);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <DesktopNavbar handleLogout={handleLogout} />

            <div className="flex items-center gap-4 md:hidden">
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 hover:text-[var(--color-primary)] transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="transition-transform duration-300 active:scale-90"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {portalTarget && (
        <>
          {createPortal(
            <MobileNavbar
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              handleLogout={handleLogout}
              setAdminDrawerOpen={setAdminDrawerOpen}
            />,
            portalTarget,
          )}

          {createPortal(
            <AdminSidebarMobile
              open={adminDrawerOpen}
              setOpen={setAdminDrawerOpen}
            />,
            portalTarget,
          )}
        </>
      )}
    </>
  );
}
