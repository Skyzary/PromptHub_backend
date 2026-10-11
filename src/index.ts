import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logger, httpLogger } from "./utils/loggers.ts";
import dbConnect from "./utils/dbConnect.ts";
import usersRouter from "./routes/users.ts";
import promptsRouter from "./routes/prompts.ts";
import authRouter from "./routes/auth.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger.ts";

await dbConnect();
console.log("connected");
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
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error(err.stack || err.message);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
      error: err.message || "Internal Server Error",
    });
  },
);

const port = process.env.PORT || 4300;

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/api/docs`);
});
