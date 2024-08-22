"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const provider_1 = __importDefault(require("./router/provider"));
const developer_1 = __importDefault(require("./router/developer"));
const blinks_1 = __importDefault(require("./router/blinks"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/v1/provider", provider_1.default);
app.use("/v1/developer", developer_1.default);
app.use("/v1/blinks", blinks_1.default);
app.get("/actions.json", (req, res) => {
    res.json({
        message: "This is your actions.json response",
    });
});
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
