export default function AboutPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
        <h1 className="text-4xl font-bold">À propos</h1>

        <p className="text-lg text-muted">
            Nous sommes un restaurant rapide premium, engagé dans la qualité,
            la fraîcheur et le local. Chaque plat est préparé à la minute avec
            des ingrédients soigneusement sélectionnés.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
            <h2 className="text-xl font-bold mb-2">Notre Mission</h2>
            <p className="text-muted">
                Offrir une expérience culinaire rapide mais exceptionnelle,
                accessible à tous.
            </p>
            </div>

            <div className="card p-6">
            <h2 className="text-xl font-bold mb-2">Nos Valeurs</h2>
            <ul className="text-muted space-y-2">
                <li>✔ Produits locaux</li>
                <li>✔ Transparence</li>
                <li>✔ Rapidité</li>
                <li>✔ Respect du client</li>
            </ul>
            </div>
        </div>
        </div>
    );
}