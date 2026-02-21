
import { useEffect, useState } from "react";
import Footer from "./Footer";
import { getPublicRestaurantSettings } from "@/services/restaurantSettingsService";

export default function FooterContainer() {
    const [openingHours, setOpeningHours] = useState<any>(null);

    const daysFr: Record<string, string> = {
        monday: "Lundi",
        tuesday: "Mardi",
        wednesday: "Mercredi",
        thursday: "Jeudi",
        friday: "Vendredi",
        saturday: "Samedi",
        sunday: "Dimanche",
    };

    const orderedDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    useEffect(() => {
        const fetchSettings = async () => {
        try {
            const settings = await getPublicRestaurantSettings();
            setOpeningHours(settings.openingHours);
        } catch (error) {
            console.error("Erreur récupération horaires:", error);
        }
        };

        fetchSettings();
    }, []);

    return (
        <Footer
        openingHours={openingHours}
        orderedDays={orderedDays}
        daysFr={daysFr}
        />
    );
}
