import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { RestaurantSettings } from "@/types/RestaurantSettings";
import { getRestaurantSettings, updateRestaurantSettings } from "@/services/restaurantSettingsService";

import OpeningHoursEditor from "./OpeningHoursEditor";
import DeliverySettingsEditor from "./DeliverySettingsEditor";

import { useToast } from "@/components/ui/use-toast";
import { resetRestaurantSettings } from "@/services/restaurantSettingsService";

import { getStatusSettings } from "@/utils/restaurantStatus";

export default function RestaurantSettingsManagement() {
    const token = useAuthStore.getState().token;
    const { toast } = useToast();

    const [settings, setSettings] = useState<RestaurantSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Charger les paramètres
    const fetchSettings = useCallback(async () => {
        if (!token) return;

        try {
            const data = await getRestaurantSettings(token);
            setSettings(data);
        } catch (error) {
            toast({
                title: "Erreur de chargement",
                description: "Impossible de charger les paramètres du restaurant.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Mise à jour des paramètres
    const handleUpdate = async (updated: Partial<RestaurantSettings>) => {
        if (!token) return;

        try {
            const newSettings = await updateRestaurantSettings(updated, token);
            setSettings(newSettings);

            toast({
                title: "Paramètres mis à jour",
                description: "Les paramètres du restaurant ont été enregistrés avec succès.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour les paramètres.",
                variant: "destructive",
            });
        }
    };

    const handleReset = async () => {
        if (!token) return;

        try {
            const newSettings = await resetRestaurantSettings(token);
            setSettings(newSettings);

            toast({
                title: "Paramètres réinitialisés",
                description: "Les paramètres du restaurant ont été réinitialisés avec succès.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de réinitialiser les paramètres.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    if (!settings) {
        return (
            <div className="text-center py-8 text-red-600">
                Impossible de charger les paramètres.
            </div>
        );
    }

    const { openingHours, deliveryFee, minOrderAmount } = settings;
    const status = getStatusSettings(openingHours);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Paramètres du Restaurant</h1>

            <div className="text-center mb-4">
                <div
                    className={`inline-block px-4 py-2 rounded text-white text-sm font-semibold ${
                        status.status === "open" ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                    {status.message}
                </div>
            </div>

            <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
            >
                Réinitialiser
            </button>

            {showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4">
                        <h2 className="text-lg font-bold">Confirmer la réinitialisation</h2>
                        <p>
                            Cette action va restaurer tous les paramètres du restaurant à leurs valeurs par défaut.
                            Cette opération est irréversible.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={async () => {
                                    await handleReset();
                                    setShowResetConfirm(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <OpeningHoursEditor
                openingHours={openingHours}
                onSave={(openingHours) => handleUpdate({ openingHours })}
            />

            <DeliverySettingsEditor
                deliveryFee={deliveryFee}
                minOrderAmount={minOrderAmount}
                onSave={(data) => handleUpdate(data)}
            />
        </div>
    );
}