import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { middleware_provider } from "./middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/application", middleware_provider, async (req, res) => {
  try {
    const responses = await prisma.application.findMany({
      include: {
        Job: true,
        Developer: true,
      },
    });
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/postjob", middleware_provider, async (req, res) => {
  const { title, description, requirements, amount } = req.body;
  //@ts-ignore
  const jobProviderId = req.providerId;

  if (!title || !description || !requirements || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        amount: Number(amount),
        jobProviderId,
      },
    });
    res.status(201).json(newJob);
  } catch (e) {
    console.error("Error creating job:", e);
    res.status(500).json({ message: "Failed to create job" });
  }
});

router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("Signing in to upchain(seller)");

  const result = nacl.sign.detached.verify(
    message,
    new Uint8Array(signature.data),
    new PublicKey(publicKey).toBytes()
  );

  if (!result) {
    return res.status(401).json({ message: "Invalid signature" });
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
