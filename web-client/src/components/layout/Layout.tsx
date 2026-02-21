import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { getPublicRestaurantSettings } from "@/services/restaurantSettingsService";
import { getStatusSettings } from "@/utils/restaurantStatus";

import Navbar from "./navbar/Navbar";
import FooterContainer from "./FooterContainer";

type RestaurantStatus = {
  status: string;
  message: string;
};

export default function Layout() {
  const [restaurantStatus, setRestaurantStatus] =
    useState<RestaurantStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const settings = await getPublicRestaurantSettings();
        const statusInfo = getStatusSettings(settings.openingHours);
        setRestaurantStatus(statusInfo);
      } catch (error) {
        console.error("Erreur récupération statut restaurant:", error);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col">
      {restaurantStatus && (
        <div
          className={`
            text-center py-2 
            backdrop-blur-md 
            border-b border-[var(--color-border)]
            transition-all duration-300
            font-medium
            ${
              restaurantStatus.status === "open"
                ? "bg-green-600/20 text-green-700"
                : "bg-red-600/20 text-red-700"
            }
          `}
        >
          {restaurantStatus.message}
        </div>
      )}

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Outlet />
      </main>

      <FooterContainer />
    </div>
  );
}
