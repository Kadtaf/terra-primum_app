import { Link } from "react-router-dom";


interface FooterProps {
    openingHours: {
        [day: string]: { open: string; close: string } | null;
    } | null;
    orderedDays: string[];
    daysFr: Record<string, string>;
}

export default function Footer({ openingHours, orderedDays, daysFr }: FooterProps) {
    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">

            {/* Branding */}
            <div>
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">
                Le Terra - Délices
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
                Produits locaux, cuisine minute, qualité premium.
            </p>
            </div>

            {/* Navigation */}
            <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-[var(--color-primary)]">Accueil</Link></li>
                <li><Link to="/menu" className="hover:text-[var(--color-primary)]">Menu</Link></li>
                <li><Link to="/contact" className="hover:text-[var(--color-primary)]">Contact</Link></li>
            </ul>
            </div>

            {/* Horaires */}
            <div>
            <h4 className="font-semibold mb-4">Horaires</h4>

            {openingHours ? (
                <ul className="space-y-1 text-sm">
                {orderedDays.map((day) => {
                    const hours = openingHours[day];

                    return (
                    <li key={day} className="flex justify-between">
                        <span>{daysFr[day]}</span>

                        <span className="text-[var(--color-text-muted)]">
                        {hours && hours.open && hours.close
                            ? `${hours.open} – ${hours.close}`
                            : "Fermé"}
                        </span>
                    </li>
                    );
                })}
                </ul>
            ) : (
                <p className="text-sm text-[var(--color-text-muted)]">Chargement...</p>
            )}
            </div>

            {/* Google Maps */}
            <div>
            <h4 className="font-semibold mb-4">Nous trouver</h4>
            <iframe
                title="Localisation"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.123456789!2d-0.580036!3d44.772123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e67b123456789%3A0xabcdef123456789!2sGradignan!5e0!3m2!1sfr!2sfr!4v1700000000000"
                className="w-full h-48 rounded-lg border border-[var(--color-border)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            </div>
        </div>

        <div className="text-center text-xs text-[var(--color-text-muted)] mt-12">
            © {new Date().getFullYear()} Le Local en Mouvement — Tous droits réservés
        </div>
        </footer>
    );
}