import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const router = Router();
const prisma = new PrismaClient();
router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("Signing in to upchain(seller)");

  const result = nacl.sign.detached.verify(
    message,
    new Uint8Array(signature.data),
    new PublicKey(publicKey).toBytes()
  );

  if (!result) {
   return  res.status(401).json({ message: "Invalid signature" });
  }

  const existingUser = await prisma.provider.findFirst({
    where: {
      address: publicKey,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        providerId: existingUser.id,
      },
      JWT_SECRET
    );
    res.json({ token });
  } else {
    const user = await prisma.provider.create({
      data: {
        address: publicKey,
      },
    });
    const token = jwt.sign(
      {
        providerId: user.id,
      },
      JWT_SECRET
    );
    res.json({ token });
  }
});

export default router;
