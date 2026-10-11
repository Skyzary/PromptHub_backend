import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { httpLogger, logger } from "./utils/loggers.ts";
import usersRouter from "./routes/users.ts";
import promptsRouter from "./routes/prompts.ts";
import authRouter from "./routes/auth.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger.ts";

export const createApp = (): express.Express => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(httpLogger);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api/users", usersRouter);
  app.use("/api/prompts", promptsRouter);
  app.use("/api/auth", authRouter);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  // Global Error Handler
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: express.NextFunction,
    ) => {
      const error = err as { message?: string; stack?: string; status?: number; statusCode?: number };
      logger.error(error.stack || error.message);
      const status = error.status || error.statusCode || 500;
      res.status(status).json({
        error: error.message || "Internal Server Error",
      });
    },
  );

  return app;
};
