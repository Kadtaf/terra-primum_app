import { sequelize } from "./config/database";
import { seedDatabase } from "./seeds/seedDatabase";

async function run() {
  try {
    console.log("🔄 Synchronisation de la base...");
    await sequelize.sync({ force: true }); // ⚠️ Supprime et recrée les tables

    console.log("🌱 Lancement du seed...");
    await seedDatabase();

    console.log("✅ Seed terminé !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error);
    process.exit(1);
  }
}

run();