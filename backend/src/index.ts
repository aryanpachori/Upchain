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
  const payload = {
    rules: [
      // Route for exact matches under /actions
      { pathPattern: "/actions/transfer-sol", apiPath: "/v1/blinks/actions/transfer-sol" },
      
      // Wildcard route for any other actions under /actions
      { pathPattern: "/actions/**", apiPath: "/v1/blinks/actions/**" }
    ],
  };
  res.set(headers);
  res.json(payload);
});
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
