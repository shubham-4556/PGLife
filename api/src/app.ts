import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { optionalAuth } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.js";
import citiesRoutes from "./routes/cities.js";
import interestsRoutes from "./routes/interests.js";
import meRoutes from "./routes/me.js";
import propertiesRoutes from "./routes/properties.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin/curl requests arrive without an Origin header.
        if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use(morgan(config.isProduction ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "pglife-api" });
  });

  // Every route below may read the signed-in user if a valid token is present.
  app.use("/api", optionalAuth);

  app.use("/api/auth", authRoutes);
  app.use("/api/cities", citiesRoutes);
  app.use("/api/properties", propertiesRoutes);
  app.use("/api/properties", interestsRoutes);
  app.use("/api/me", meRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
