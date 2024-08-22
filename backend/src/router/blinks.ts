import express from "express";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  actionCorsMiddleware,
  createActionHeaders,
  ActionPostResponse,
} from "@solana/actions";
import { PrismaClient } from "@prisma/client";
import { BASE64_IMG } from "../config";

const prisma = new PrismaClient();
const router = express.Router();
const headers = createActionHeaders();
const PAYMENT_AMOUNT_SOL = 1;
const DEFAULT_SOL_ADDRESS = "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL";
const connection = new Connection(
  process.env.RPC_URL || clusterApiUrl("devnet")
);

router.use(actionCorsMiddleware({}));

router.get("/actions/transfer-sol", async (req, res) => {
  try {
    const baseHref = new URL(
      `/v1/blinks/actions/transfer-sol`,
      req.protocol + "://" + req.get("host")
    ).toString();

    const payload = {
      title: "JOBLINK",
      icon: `data:image/png;base64,${BASE64_IMG}`,
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

router.post("/actions/transfer-sol", async (req, res) => {
  try {
    const { account, data } = req.body;
    const { title, description, requirements, amount } = data;

    if (!account || !title || !description || !requirements || !amount) {
      throw new Error("Missing required parameters");
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

    let provider = await prisma.provider.findUnique({
      where: { address: account },
    });

    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          address: account,
        },
      });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        amount: Number(amount),
        jobProviderId: provider.id,
      },
    });

    const response =  {
      transaction: serialTX,
      message:
        "Job posted successfully. Please go to https://upchain-delta.vercel.app/ to view job responses(NOTE: Login with the same wallet used for job creation)",
    };

    
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred" });
  }

  
});

export default router;
