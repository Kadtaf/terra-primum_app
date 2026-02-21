interface TopProduct {
    productId: string;
    name: string;
    totalSold: number;
}
// Composant pour afficher les produits les plus vendus
export default function TopProducts({ data }: { data: TopProduct[] }) {
    if (!data || data.length === 0) {
        return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Produits les plus vendus</h2>
            <p className="text-gray-500">Aucune donnée disponible.</p>
        </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Produits les plus vendus</h2>

        <ul className="space-y-3">
            {data.map((p, index) => (
            <li
                key={p.productId}
                className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition"
            >
                <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500 w-6">
                    {index + 1}.
                </span>
                <span className="font-medium">{p.name}</span>
                </div>

                <span className="font-bold text-blue-600">
                {p.totalSold} ventes
                </span>
            </li>
            ))}
        </ul>
        </div>
    );
}