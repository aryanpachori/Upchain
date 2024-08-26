import {
  ActionGetResponse,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";

import { BASE64_IMG, DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./config";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey } = validatedQueryParams(requestUrl);
    const baseHref = new URL(
      `/api/actions/createjob?to=${toPubkey.toBase58()}`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "JOBLINK",
      icon: new URL("/logo.png", requestUrl.origin).toString(),
      description: "Pay 0.1 SOL to post a job on Upchain",
      label: "Pay and Post Job",
      links: {
        actions: [
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

    return new NextResponse(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const body = await req.json();
    const { toPubkey } = validatedQueryParams(requestUrl);
    const { title, description, requirements, amount } = body.data;
    if (!title || !description || !requirements || !amount) {
      return new Response(
        "Missing required fields: title, description, requirements, or amount",
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/qlsrTkNGjnuK46GWAC2AVAaVnVZ2ylVf"
    );

    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: toPubkey,
      lamports: DEFAULT_SOL_AMOUNT * LAMPORTS_PER_SOL,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message:
          "Job posted successfully. Please go to https://upchain-delta.vercel.app/ to view job responses(NOTE: Login with the same wallet used for job creation)",
      },
    });

    const createJob = await axios.post(`${BACKEND_URL}/blink`, {
      title,
      description,
      requirements,
      amount: Number(amount),
      account,
    });

    return new NextResponse(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  return {
    toPubkey,
  };
}
