
import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { middleware_provider } from "./middleware";

const router = Router();
const prisma = new PrismaClient();


router.post("/payment",middleware_provider,async(req,res)=>{
     
  const {contractId} = req.body;
  try{
     const contract = await prisma.contract.findUnique({
      where :{
        id : contractId
      },
      include : {
        Job :{
          select :{
            amount :true
          }
        }
      }
     })
     if(contract?.status !== "IN_PROGRESS"){
      return res.json({message : "Invalid"})
     }
    
   
  }catch(e){

  }
})

router.get("/submission", middleware_provider, async (req, res) => {
  //@ts-ignore
  const jobProviderId = req.providerId;
  try {
    const submissions = await prisma.contract.findMany({
      where: {
        Job: {
          jobProviderId: jobProviderId,
        },
        submissonLink: {
          not: null,
        },
      },
      select: {
        id: true,
        submissonLink: true,
        Job: {
          select: {
            id : true,
            title: true,
          },
        },
      },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

router.get("/job/:jobId/amount", middleware_provider, async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: Number(jobId),
      },
      select: {
        amount: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ amount: job.amount });
  } catch (error) {
    console.error("Error fetching job amount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/application/:jobId/:developerId", async (req, res) => {
  const { jobId, developerId } = req.params;
  if (!jobId || !developerId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    await prisma.application.deleteMany({
      where: {
        JobId: Number(jobId),
        DeveloperId: Number(developerId),
      },
    });
    res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/contract", middleware_provider, async (req, res) => {
  const { jobId, DeveloperId } = req.body;
  if (!jobId || !DeveloperId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const existingContract = await prisma.contract.findUnique({
      where: {
        jobId,
      },
    });
    if (existingContract) {
      return res
        .status(400)
        .json({ message: "Contract already exists for this job" });
    }
    const contract = await prisma.contract.create({
      data: {
        jobId: jobId,
        DeveloperId: DeveloperId,
        status: "IN_PROGRESS",
      },
    });

    await prisma.application.updateMany({
      where: {
        JobId: jobId,
        DeveloperId: DeveloperId,
      },
      data: {
        status: "APPROVED",
      },
    });

    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        developerId: DeveloperId,
      },
    });

    res.status(201).json(contract);
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/jobs", middleware_provider, async (req, res) => {
  //@ts-ignore
  const jobProviderId = req.providerId;
  try {
    if (!jobProviderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const jobs = await prisma.job.findMany({
      where: {
        jobProviderId: jobProviderId,
      },
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});

router.get("/application", middleware_provider, async (req, res) => {
  try {
    //@ts-ignore
    const jobProviderId = req.providerId;
    const jobs = await prisma.job.findMany({
      where: {
        jobProviderId: jobProviderId,
      },
      select: {
        id: true,
      },
    });
    const jobIds = jobs.map((job) => job.id);

    const responses = await prisma.application.findMany({
      where: {
        JobId: {
          in: jobIds,
        },
      },
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
