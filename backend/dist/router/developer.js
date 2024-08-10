"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../config");
const client_1 = require("@prisma/client");
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/jobs", middleware_1.middleware_dev, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield prisma.job.findMany({
            include: {
                JobProvider: true,
            },
        });
        res.status(200).json(jobs);
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("Signing in to upchain(devs)");
    const result = tweetnacl_1.default.sign.detached.verify(message, new Uint8Array(signature), new web3_js_1.PublicKey(publicKey).toBytes());
    if (!result) {
        return res.status(401).json({ message: "Invalid signature" });
    }
    const existingUser = yield prisma.developer.findFirst({
        where: {
            address: publicKey,
        },
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            devId: existingUser.id,
        }, config_1.JWT_SECRET_DEV);
        res.json({ token });
    }
    else {
        const user = yield prisma.developer.create({
            data: {
                address: publicKey,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            devId: user.id,
        }, config_1.JWT_SECRET_DEV);
        res.json({ token });
    }
}));
exports.default = router;
