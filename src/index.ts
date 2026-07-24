import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { logger, httpLogger } from "./utils/loggers.ts";
import dbConnect from "./utils/dbConnect.ts";
import usersRouter from "./routes/users.ts";
import promptsRouter from "./routes/prompts.ts";
import authRouter from "./routes/auth.ts";

await dbConnect();
console.log("connected");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);
app.use("/api/users", usersRouter);
app.use("/api/prompts", promptsRouter);
app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  logger.info("Server started on port 3000");
});
