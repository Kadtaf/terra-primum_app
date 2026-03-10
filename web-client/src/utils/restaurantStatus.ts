export function getStatusSettings(
    openingHours: Record<string, { open: string; close: string } | null>
) {
    const now = new Date();
    const dayKey = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    const todayHours = openingHours[dayKey];

    // Jour fermé explicitement
    if (todayHours === null) {
        return {
            status: "closed",
            message: "Fermé aujourd’hui",
        };
    }

    // Horaires non définis (erreur de config)
    if (!todayHours) {
        return {
            status: "closed",
            message: "Horaires non définis",
        };
    }

    const { open, close } = todayHours;

    const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
    };

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = toMinutes(open);
    const closeMinutes = toMinutes(close);

    if (nowMinutes < openMinutes) {
        return {
            status: "closed",
            message: `Ouvre à ${open}`,
        };
    }

    if (nowMinutes >= closeMinutes) {
        return {
            status: "closed",
            message: `Fermé — ouvre à ${open}`,
        };
    }

    const minutesLeft = closeMinutes - nowMinutes;

    return {
        status: "open",
        message: `Ouvert — ferme dans ${minutesLeft} min`,
    };
}