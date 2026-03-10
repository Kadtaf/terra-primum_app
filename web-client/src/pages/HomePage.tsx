import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Zap, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getPublicRestaurantSettings } from "@/services/restaurantSettingsService";
import { getStatusSettings } from "@/utils/restaurantStatus";




type RestaurantStatus = {
  status: string;
  message: string;
};

export default function HomePage() {
  const [status, setStatus] = useState<RestaurantStatus | null>(null);

  useEffect(() => {
      const fetchStatus = async () => {
        try {
          const settings = await getPublicRestaurantSettings();
          const statusInfo = getStatusSettings(settings.openingHours, settings.closedDays);
          setStatus(statusInfo);
        } catch (error) {
          console.error("Erreur lors de la récupération du statut du restaurant:", error);
        }
      };

      fetchStatus();
    }, []);

  return (
    <div className="space-y-20 animate-fadeIn">
      {status && (
        <div className="text-center mt-6">
          <span
            className={`inline-block px-4 py-2 rounded-full text-white text-sm font-semibold ${
              status.status === "open" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {status.message}
          </span>
        </div>
      )}
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Restauration Rapide Premium
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Découvrez une nouvelle façon de manger : produits frais, locaux,
            préparés à la minute
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/menu"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center gap-2"
            >
              Consulter le menu
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Pourquoi nous choisir ?
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <Leaf className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-2">Produits Locaux</h3>
            <p className="text-sm text-muted-foreground">
              100% des producteurs à moins de 150 km
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-2">Préparation Minute</h3>
            <p className="text-sm text-muted-foreground">
              Chaque plat assemblé devant vous
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-2">Premium Accessible</h3>
            <p className="text-sm text-muted-foreground">
              Panier moyen 12€ à 16€
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold mb-2">Programme Fidélité</h3>
            <p className="text-sm text-muted-foreground">
              Gagnez des points à chaque commande
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center">
          Comment ça marche ?
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                {step}
              </div>

              {step === 1 && (
                <>
                  <h3 className="font-bold mb-2">Consulter</h3>
                  <p className="text-sm text-muted-foreground">
                    Parcourez notre menu et sélectionnez vos plats
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="font-bold mb-2">Commander</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez au panier et procédez au paiement
                  </p>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="font-bold mb-2">Suivre</h3>
                  <p className="text-sm text-muted-foreground">
                    Suivez votre commande en temps réel
                  </p>
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="font-bold mb-2">Retirer</h3>
                  <p className="text-sm text-muted-foreground">
                    Récupérez votre commande à temps
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à commander ?</h2>

        <p className="text-lg mb-8 opacity-90">
          Découvrez nos délicieux plats préparés avec passion
        </p>

        <Link
          to="/menu"
          className="inline-block bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition"
        >
          Commencer maintenant
        </Link>
      </section>
    </div>
  );
}