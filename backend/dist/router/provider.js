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
const client_1 = require("@prisma/client");
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/application", middleware_1.middleware_provider, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responses = yield prisma.application.findMany({
            include: {
                Job: true,
                Developer: true,
            },
        });
        res.status(200).json(responses);
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/postjob", middleware_1.middleware_provider, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, requirements, amount } = req.body;
    //@ts-ignore
    const jobProviderId = req.providerId;
    if (!title || !description || !requirements || !amount) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newJob = yield prisma.job.create({
            data: {
                title,
                description,
                requirements,
                amount: Number(amount),
                jobProviderId,
            },
        });
        res.status(201).json(newJob);
    }
    catch (e) {
        console.error("Error creating job:", e);
        res.status(500).json({ message: "Failed to create job" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("Signing in to upchain(seller)");
    const result = tweetnacl_1.default.sign.detached.verify(message, new Uint8Array(signature.data), new web3_js_1.PublicKey(publicKey).toBytes());
    if (!result) {
        return res.status(401).json({ message: "Invalid signature" });
    }
    const existingUser = yield prisma.provider.findFirst({
        where: {
            address: publicKey,
        },
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            providerId: existingUser.id,
        }, config_1.JWT_SECRET);
        res.json({ token });
    }
    else {
        const user = yield prisma.provider.create({
            data: {
                address: publicKey,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            providerId: user.id,
        }, config_1.JWT_SECRET);
        res.json({ token });
    }
}));
exports.default = router;
