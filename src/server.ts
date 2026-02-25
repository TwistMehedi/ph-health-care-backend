import app from "./app.js";
import { env } from "./config/config.js";
import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
    console.log("Database connection successfully");
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
