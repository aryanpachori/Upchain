import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { BACKEND_URL } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, requirements, amount, account } = req.body;

    const createJob = await axios.post(`${BACKEND_URL}/blink`, {
      title,
      description,
      requirements,
      amount: Number(amount),
      account,
    });

    return res.status(200).json({ message: "Job created successfully" });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ error: "Failed to create job" });
  }
}
