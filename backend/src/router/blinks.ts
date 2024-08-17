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

const router = express.Router();
const headers = createActionHeaders();
const PAYMENT_AMOUNT_SOL = 0.1;
const DEFAULT_SOL_ADDRESS = "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL";
const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/qlsrTkNGjnuK46GWAC2AVAaVnVZ2ylVf"
);

router.use(actionCorsMiddleware({}));

router.get("/actions/transfer-sol", async (req, res) => {
  try {
    const baseHref = new URL(
      `/v1/blinks/transfer-sol`,
      req.protocol + "://" + req.get("host")
    ).toString();

    const payload = {
      title: "POST Job",
      icon: "https://solana-actions.vercel.app/solana_devs.jpg",
      description: "Pay 0.1 SOL to post a job on Upchain",
      label: "Pay and Post Job",
      links: {
        actions: [
          {
            label: "PAY 0.1 SOL",
            href: `${baseHref}?amount=${PAYMENT_AMOUNT_SOL}&to=${DEFAULT_SOL_ADDRESS}`,
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

router.post("/transfer-sol", async (req, res) => {
  try {
    const { account } = req.body;
    if (!account) {
      throw new Error('Invalid "account" provided');
    }
    const user = new PublicKey(account);

    const ix = SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: new PublicKey("94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL"),
      lamports: PAYMENT_AMOUNT_SOL * LAMPORTS_PER_SOL,
    });

    const tx = new Transaction();
    tx.add(ix);
    tx.feePayer = new PublicKey(account);
    tx.recentBlockhash = (
      await connection.getLatestBlockhash({ commitment: "finalized" })
    ).blockhash;
    const serialTX = tx
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");

    const response: ActionPostResponse = {
      transaction: serialTX,
      message: "pubKey" + tx.feePayer,
    
    };
    return res.json(
        response,
        
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An unknown error occurred" });
  }
});

export default router;
