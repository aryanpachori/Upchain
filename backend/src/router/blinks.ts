import express from "express";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  actionCorsMiddleware,
  createActionHeaders,
  ActionPostResponse,
} from "@solana/actions";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const router = express.Router();
const headers = createActionHeaders();
const PAYMENT_AMOUNT_SOL = 0.1;
const DEFAULT_SOL_ADDRESS = "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL";
const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/qlsrTkNGjnuK46GWAC2AVAaVnVZ2ylVf"
);

router.use(actionCorsMiddleware({}));

// Endpoint to get action data
router.get("/actions/transfer-sol", async (req, res) => {
  try {
    const baseHref = new URL(
      `/v1/blinks/transfer-sol`,
      req.protocol + "://" + req.get("host")
    ).toString();

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred" });
  }
});

// Endpoint to handle payment and job creation
router.post("/transfer-sol", async (req, res) => {
  try {
    const { account, title, description, requirements, amount } = req.body;

    if (!account || !title || !description || !requirements || !amount) {
      throw new Error('Missing required parameters');
    }

    const user = new PublicKey(account);

    const ix = SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: new PublicKey(DEFAULT_SOL_ADDRESS),
      lamports: Number(amount) * LAMPORTS_PER_SOL,
    });

    const tx = new Transaction();
    tx.add(ix);
    tx.feePayer = user;
    tx.recentBlockhash = (
      await connection.getLatestBlockhash({ commitment: "finalized" })
    ).blockhash;
    const serialTX = tx
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");

    // Save job details to the database
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        amount: Number(amount),
        jobProviderId: Math.random() // Assuming the account is used as the jobProviderId
      },
    });

    const response: ActionPostResponse = {
      transaction: serialTX,
      message: "Job posted successfully",
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred" });
  }
});

export default router;
