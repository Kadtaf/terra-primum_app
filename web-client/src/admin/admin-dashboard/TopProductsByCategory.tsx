interface TopProductsByCategoryProps {
    data: {
        categoryId: string;
        categoryName: string;
        products: {
        productId: string;
        productName: string;
        totalSold: number;
        }[];
    }[];
}

export default function TopProductsByCategory({
    data,
    }: TopProductsByCategoryProps) {
    return (
        <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
            Produits les plus vendus par catégorie
        </h2>

        <div className="space-y-6">
            {data.map((cat) => (
            <div key={cat.categoryId} className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">{cat.categoryName}</h3>

                <ul className="space-y-2">
                {cat.products.map((p, index) => (
                    <li
                    key={p.productId}
                    className="flex justify-between items-center p-2 rounded hover:bg-muted transition"
                    >
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">
                        {index + 1}.
                        </span>
                        <span className="font-medium">{p.productName}</span>
                    </div>

                    <span className="font-bold text-blue-600">
                        {p.totalSold} ventes
                    </span>
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>
        </div>
    );
}
