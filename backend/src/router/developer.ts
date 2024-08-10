import { JWT_SECRET_DEV } from "./../config";
import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { middleware_dev } from "./middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/jobs", middleware_dev, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        JobProvider: true,
      },
    });
    res.status(200).json(jobs);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("Signing in to upchain(devs)");

  const result = nacl.sign.detached.verify(
    message,
    new Uint8Array(signature),
    new PublicKey(publicKey).toBytes()
  );

  if (!result) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const existingUser = await prisma.developer.findFirst({
    where: {
      address: publicKey,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        devId: existingUser.id,
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
        devId: user.id,
      },
      JWT_SECRET_DEV
    );
    res.json({ token });
  }
});

export default router;
