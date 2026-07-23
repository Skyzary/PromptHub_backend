import express from "express";
import "dotenv/config";
import { logger, httpLogger } from "./utils/loggers.ts";
import dbConnect from "./utils/dbConnect.ts";
import usersRouter from "./routes/users.ts";
try {
  await dbConnect();
  console.log("connected");
} catch (error) {
  logger.error(`Failed to connect to MongoDB: ${error}`);
}
const app = express();
app.use(express.json());
logger.info("Server started on port 3000");
app.use(httpLogger);
app.use("/api", usersRouter);
app.listen(process.env.PORT || 3000, () => {
  logger.info("Server started on port 3000");
});
