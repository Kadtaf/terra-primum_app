export const restaurantInfo = {
  name: "Le Local en Mouvement",
  tagline: "Restauration Rapide Premium",
  description: "Découvrez notre concept innovant de restauration rapide premium. Produits frais, locaux et préparés à la minute pour une expérience culinaire unique.",
  address: "123 Rue de Bordeaux, 33000 Bordeaux",
  phone: "+33 5 56 12 34 56",
  email: "contact@localenmouvement.fr",
  website: "www.localenmouvement.fr",
  
  hours: {
    monday: { open: "11:30", close: "22:00" },
    tuesday: { open: "11:30", close: "22:00" },
    wednesday: { open: "11:30", close: "22:00" },
    thursday: { open: "11:30", close: "22:00" },
    friday: { open: "11:30", close: "23:00" },
    saturday: { open: "12:00", close: "23:00" },
    sunday: { open: "12:00", close: "22:00" },
  },

  features: [
    {
      icon: "🌿",
      title: "Produits Locaux",
      description: "Tous nos ingrédients proviennent de producteurs locaux de la région bordelaise"
    },
    {
      icon: "⚡",
      title: "Préparation Rapide",
      description: "Commande prête en 10-15 minutes, sans compromis sur la qualité"
    },
    {
      icon: "👨‍🍳",
      title: "Chef Expérimenté",
      description: "Nos chefs maîtrisent l'art de la cuisine rapide haut de gamme"
    },
    {
      icon: "💚",
      title: "Options Saines",
      description: "Menu varié avec options végétariennes et vegan"
    }
  ],

  menu: {
    sandwiches: {
      name: "Sandwichs Gourmets",
      description: "Nos sandwichs faits maison avec pain artisanal",
      items: [
        {
          id: "sandwich-1",
          name: "Sandwich Jambon de Pays",
          description: "Pain artisanal, jambon de pays, tomate, laitue, mayonnaise maison",
          price: 8.50,
          image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
        },
        {
          id: "sandwich-2",
          name: "Sandwich Poulet Rôti",
          description: "Poulet fermier rôti, oignons caramélisés, roquette, sauce BBQ",
          price: 9.50,
          image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
        },
        {
          id: "sandwich-3",
          name: "Sandwich Végétal",
          description: "Houmous, légumes grillés, feta, roquette, sauce tahini",
          price: 8.00,
          image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
        },
        {
          id: "sandwich-4",
          name: "Sandwich Thon Méditerranéen",
          description: "Thon frais, tomate, olive, oignon rouge, citron frais",
          price: 9.00,
          image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
        }
      ]
    },
    burgers: {
      name: "Burgers Premium",
      description: "Burgers avec viande locale et fromage affiné",
      items: [
        {
          id: "burger-1",
          name: "Burger Classique",
          description: "Steak haché 180g, cheddar, tomate, laitue, oignons, sauce spéciale",
          price: 11.50,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        },
        {
          id: "burger-2",
          name: "Burger Double Fromage",
          description: "2x steak haché 90g, emmental, comté, bacon, oignons caramélisés",
          price: 13.50,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        },
        {
          id: "burger-3",
          name: "Burger Poulet Croustillant",
          description: "Filet de poulet croustillant, cheddar, tomate, laitue, sauce ranch",
          price: 12.00,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        },
        {
          id: "burger-4",
          name: "Burger Végétal",
          description: "Galette de légumes maison, avocat, tomate, roquette, sauce vegan",
          price: 11.00,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        },
        {
          id: "burger-5",
          name: "Burger Gourmand Spécial",
          description: "Steak haché 180g, foie gras, truffe, comté, sauce périgourdine",
          price: 16.50,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        }
      ]
    },
    salades: {
      name: "Salades Composées",
      description: "Salades fraîches avec ingrédients de saison",
      items: [
        {
          id: "salad-1",
          name: "Salade Niçoise",
          description: "Laitue, thon, oeuf dur, tomate, olive, anchois, vinaigrette",
          price: 10.50,
          image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
        },
        {
          id: "salad-2",
          name: "Salade César Poulet",
          description: "Laitue romaine, poulet grillé, parmesan, croûtons, sauce César",
          price: 11.00,
          image: "https://media.istockphoto.com/id/1213546819/fr/photo/salade-de-pois-chiches-sur-une-vue-sup%C3%A9rieure-grise-de-fond.jpg?s=1024x1024&w=is&k=20&c=dv5bP8zzbkqhhqyvoovZT4m3kCY4y_jkQLul_aRgnfM=",
        },
        {
          id: "salad-3",
          name: "Salade Méditerranéenne",
          description: "Tomate, concombre, feta, olive, oignon rouge, roquette, huile d'olive",
          price: 9.50,
          image: "https://media.istockphoto.com/id/1213546819/fr/photo/salade-de-pois-chiches-sur-une-vue-sup%C3%A9rieure-grise-de-fond.jpg?s=1024x1024&w=is&k=20&c=dv5bP8zzbkqhhqyvoovZT4m3kCY4y_jkQLul_aRgnfM=",
        },
        {
          id: "salad-4",
          name: "Salade Verte Gourmande",
          description: "Laitue, roquette, épinards, fromage chèvre, noix, vinaigrette miel",
          price: 10.00,
          image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
        }
      ]
    },
    accompagnements: {
      name: "Accompagnements",
      description: "Frites, légumes et sauces maison",
      items: [
        {
          id: "side-1",
          name: "Frites Maison",
          description: "Frites croustillantes cuites à la graisse de canard",
          price: 3.50,
          image: "https://www.istockphoto.com/photo/appetizing-french-fries-in-a-bowl-gm966934632-263790734?utm_source=pixabay&utm_medium=affiliate&utm_campaign=sponsored_image&utm_content=srp_topbanner_media&utm_term=frites+maison",
        },
        {
          id: "side-2",
          name: "Frites Douces",
          description: "Frites de patate douce, légèrement salées",
          price: 4.00,
          image: "https://images.unsplash.com/photo-1599599810694-2202a9e0792d?w=400https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=300&fit=cropfit=crop",
        },
        {
          id: "side-3",
          name: "Légumes Grillés",
          description: "Courgettes, aubergines, poivrons grillés à l'huile d'olive",
          price: 4.50,
          image: "https://images.unsplash.com/photo-1599599810694-2202a9e0792d?w=400https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=300&fit=cropfit=crop",
        },
        {
          id: "side-4",
          name: "Sauce Maison",
          description: "Mayonnaise, BBQ, Sriracha ou Tahini - Au choix",
          price: 1.00,
          image: "https://images.unsplash.com/photo-1599599810694-2202a9e0792d?w=400https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=300&fit=cropfit=crop",
        }
      ]
    },
    boissons: {
      name: "Boissons",
      description: "Jus frais, sodas et boissons artisanales",
      items: [
        {
          id: "drink-1",
          name: "Jus de Fruits Frais",
          description: "Orange, pomme ou raisin - Pressé chaque matin",
          price: 3.50,
          image: "https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=400https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=cropfit=crop",
        },
        {
          id: "drink-2",
          name: "Smoothie Tropical",
          description: "Mangue, ananas, noix de coco, lait de coco",
          price: 4.50,
          image: "https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=400https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=cropfit=crop",
        },
        {
          id: "drink-3",
          name: "Eau Pétillante",
          description: "Eau minérale pétillante locale",
          price: 2.00,
          image: "https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=400https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=cropfit=crop",
        },
        {
          id: "drink-4",
          name: "Soda Artisanal",
          description: "Gingembre-citron ou Pomme-menthe",
          price: 2.50,
          image: "https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=400https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=croph=300https://images.unsplash.com/photo-1600271886742-f049cd1f3033?w=400&h=300&fit=cropfit=crop",
        }
      ]
    },
    desserts: {
      name: "Desserts",
      description: "Desserts faits maison et gourmandises",
      items: [
        {
          id: "dessert-1",
          name: "Brownie Chocolat",
          description: "Brownie maison au chocolat noir 70%, servi chaud",
          price: 4.50,
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        },
        {
          id: "dessert-2",
          name: "Tarte aux Fruits",
          description: "Tarte aux fruits de saison avec crème pâtissière",
          price: 5.00,
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        },
        {
          id: "dessert-3",
          name: "Cheesecake",
          description: "Cheesecake New York avec coulis de fruits rouges",
          price: 5.50,
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        },
        {
          id: "dessert-4",
          name: "Macarons Assortis",
          description: "Boîte de 3 macarons artisanaux - Saveurs au choix",
          price: 4.00,
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        }
      ]
    }
  }
};
