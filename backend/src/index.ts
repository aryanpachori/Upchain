import express from "express";
import cors from "cors";
import providerRouter from "./router/provider";
import developerRouter from "./router/developer";
import blinksRouter from "./router/blinks";
import { createActionHeaders, actionCorsMiddleware } from "@solana/actions";

const app = express();
const headers = createActionHeaders();
app.use(cors());
app.use(express.json());
app.use(actionCorsMiddleware({}));
app.use("/v1/provider", providerRouter);
app.use("/v1/developer", developerRouter);
app.use("/v1/blinks", blinksRouter);
app.get("/actions.json", (req, res) => {
  res.set(headers);
  res.json({
    message: "This is your actions.json response",
  });
});
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
