import { createApp } from "./app.js";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Could not connect to PostgreSQL. Is DATABASE_URL correct?");
    console.error(error);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(config.PORT, () => {
    console.log(`pglife-api listening on http://localhost:${config.PORT}`);
    console.log(`CORS origins: ${config.corsOrigins.join(", ")}`);
  });

  const shutdown = (signal: string) => () => {
    console.log(`\n${signal} received, shutting down.`);
    server.close(() => {
      void prisma.$disconnect().then(() => process.exit(0));
    });
  };

  process.on("SIGINT", shutdown("SIGINT"));
  process.on("SIGTERM", shutdown("SIGTERM"));
}

main();
