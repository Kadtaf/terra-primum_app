import { useState } from 'react';
import { restaurantInfo } from '../data/restaurant';
import { useCartStore } from '../stores/cartStore';
import { ShoppingCart, MapPin, Phone, Clock, Leaf } from 'lucide-react';

export default function HomePageComplete() {
  const [selectedCategory, setSelectedCategory] = useState('burgers');
  const { addItem } = useCartStore();

  const categories = Object.keys(restaurantInfo.menu);
  const currentMenu = restaurantInfo.menu[selectedCategory as keyof typeof restaurantInfo.menu];

  const handleAddToCart = (item: any) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {restaurantInfo.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {restaurantInfo.tagline}
            </p>
            <p className="text-lg mb-8 opacity-80">
              {restaurantInfo.description}
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#menu" className="btn btn-primary">
                Découvrir le Menu
              </a>
              <a href="#contact" className="btn btn-outline">
                Nous Contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Pourquoi Nous Choisir ?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {restaurantInfo.features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Notre Menu</h2>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'btn btn-primary'
                    : 'btn btn-secondary'
                }`}
              >
                {restaurantInfo.menu[category as keyof typeof restaurantInfo.menu].name}
              </button>
            ))}
          </div>

          {/* Category Description */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-2">{currentMenu.name}</h3>
            <p className="text-muted text-lg">{currentMenu.description}</p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMenu.items.map((item: any) => (
              <div key={item.id} className="card overflow-hidden hover:shadow-lg transition">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold mb-2">{item.name}</h4>
                  <p className="text-muted text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {item.price.toFixed(2)}€
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Nous Trouver</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="card text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Adresse</h3>
              <p className="text-muted">{restaurantInfo.address}</p>
            </div>

            {/* Phone */}
            <div className="card text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Téléphone</h3>
              <a href={`tel:${restaurantInfo.phone}`} className="text-primary font-semibold">
                {restaurantInfo.phone}
              </a>
            </div>

            {/* Hours */}
            <div className="card text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Horaires</h3>
              <p className="text-muted text-sm">Lun-Jeu: 11h30-22h</p>
              <p className="text-muted text-sm">Ven: 11h30-23h</p>
              <p className="text-muted text-sm">Sam-Dim: 12h-22h</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à Commander ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Découvrez nos délicieux plats préparés avec passion
          </p>
          <a href="/menu" className="btn bg-white text-primary hover:bg-opacity-90">
            Voir le Menu Complet
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                {restaurantInfo.name}
              </h4>
              <p className="text-muted">{restaurantInfo.tagline}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-muted text-sm mb-2">{restaurantInfo.phone}</p>
              <p className="text-muted text-sm">{restaurantInfo.email}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suivez-Nous</h4>
              <div className="flex gap-4">
                <a href="#" className="text-primary hover:underline">Facebook</a>
                <a href="#" className="text-primary hover:underline">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted text-sm">
            <p>© 2026 {restaurantInfo.name}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
