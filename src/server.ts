import app from "./app.js";
import { env } from "./config/config.js";
import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
    console.log("Database connection successfully");
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
