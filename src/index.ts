import "dotenv/config";
import { logger } from "./utils/loggers.ts";
import dbConnect from "./utils/dbConnect.ts";
import { createApp } from "./app.ts";

await dbConnect();
console.log("connected");
const app = createApp();

const port = process.env.PORT || 4300;

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/api/docs`);
});
