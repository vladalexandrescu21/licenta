import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { initialize } from "./repository.mjs";
import routes from "./routes.mjs";

const app = express();
app.use(cors());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", routes);

app.listen(8080, async () => {
  try {
    console.log("Listening on port 8080");
    await initialize();
  } catch (error) {
    console.error(error);
  }
});
