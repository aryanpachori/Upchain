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
const express_1 = __importDefault(require("express"));
const web3_js_1 = require("@solana/web3.js");
const actions_1 = require("@solana/actions");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const headers = (0, actions_1.createActionHeaders)();
const PAYMENT_AMOUNT_SOL = 0.1;
const DEFAULT_SOL_ADDRESS = "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL";
const connection = new web3_js_1.Connection("https://solana-devnet.g.alchemy.com/v2/qlsrTkNGjnuK46GWAC2AVAaVnVZ2ylVf");
router.use((0, actions_1.actionCorsMiddleware)({}));
// Endpoint to get action data
router.get("/actions/transfer-sol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseHref = new URL(`/v1/blinks/transfer-sol`, req.protocol + "://" + req.get("host")).toString();
        const payload = {
            title: "UPCHAIN",
            icon: "https://solana-actions.vercel.app/solana_devs.jpg",
            description: "Pay 0.1 SOL to post a job on Upchain",
            label: "Pay and Post Job",
            links: {
                actions: [
                    {
                        label: "PAY 0.1 SOL",
                        href: `${baseHref}?amount=${PAYMENT_AMOUNT_SOL}&to=${DEFAULT_SOL_ADDRESS}`,
                    },
                    {
                        label: "Create Job",
                        href: `${baseHref}`,
                        parameters: [
                            {
                                name: "title",
                                label: "Enter the title for the Job",
                                required: true,
                            },
                            {
                                name: "description",
                                label: "Enter the job description",
                                required: true,
                            },
                            {
                                name: "requirements",
                                label: "Enter job requirements",
                                required: true,
                            },
                            {
                                name: "amount",
                                label: "Enter the payment amount (in SOL)",
                                required: true,
                            },
                        ],
                    },
                ],
            },
        };
        res.set(headers);
        res.json(payload);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An unknown error occurred" });
    }
}));
// Endpoint to handle payment and job creation
router.post("/transfer-sol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account, title, description, requirements, amount } = req.body;
        if (!account || !title || !description || !requirements || !amount) {
            throw new Error('Missing required parameters');
        }
        const user = new web3_js_1.PublicKey(account);
        const ix = web3_js_1.SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: new web3_js_1.PublicKey(DEFAULT_SOL_ADDRESS),
            lamports: Number(amount) * web3_js_1.LAMPORTS_PER_SOL,
        });
        const tx = new web3_js_1.Transaction();
        tx.add(ix);
        tx.feePayer = user;
        tx.recentBlockhash = (yield connection.getLatestBlockhash({ commitment: "finalized" })).blockhash;
        const serialTX = tx
            .serialize({ requireAllSignatures: false, verifySignatures: false })
            .toString("base64");
        // Save job details to the database
        const newJob = yield prisma.job.create({
            data: {
                title,
                description,
                requirements,
                amount: Number(amount),
                jobProviderId: Math.random() // Assuming the account is used as the jobProviderId
            },
        });
        const response = {
            transaction: serialTX,
            message: "Job posted successfully",
        };
        res.json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An unknown error occurred" });
    }
}));
exports.default = router;
