import { JWT_SECRET_DEV } from './../config';
import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";


const router = Router();
const prisma = new PrismaClient();
router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("Signing in to upchain(devs)");

  const result = nacl.sign.detached.verify(
    message,
    new Uint8Array(signature),
    new PublicKey(publicKey).toBytes()
  );

  if (!result) {
   return  res.status(401).json({ message: "Invalid signature" });
  }

  const existingUser = await prisma.developer.findFirst({
    where: {
      address: publicKey,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        DevId: existingUser.id,
      },
      JWT_SECRET_DEV
    );
    res.json({ token });
  } else {
    const user = await prisma.developer.create({
      data: {
        address: publicKey,
      },
    }); 
    const token = jwt.sign(
      {
        DevId: user.id,
      },
      JWT_SECRET_DEV
    );
    res.json({ token });
  }
});

export default router;
