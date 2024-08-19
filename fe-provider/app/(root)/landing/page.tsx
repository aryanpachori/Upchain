"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { BACKEND_URL } from "@/utils";
export default function Landing() {
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();

  async function signNsend() {
    if (!publicKey) {
      return;
    }
    const message = new TextEncoder().encode("Signing in to upchain(seller)");
    const signature = await signMessage?.(message);
    const response = await axios.post(`${BACKEND_URL}/signin`, {
      publicKey: publicKey?.toString(),
      signature,
    });
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      router.push("/postjob");
    }
  }

  useEffect(() => {
    signNsend();
  }, [publicKey]);

  const words = [
    { text: "Find", className: "text-white" },
    { text: "gigs", className: "text-white" },
    { text: "and", className: "text-white" },
    { text: "get", className: "text-white" },
    { text: "paid", className: "text-white" },
    { text: "effortlessly", className: "text-white" },
    { text: "with", className: "text-white" },
    { text: "Solana Payments.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="text-blue-500 font-bold font-sans dark:text-neutral-200 text-3xl text-center ">
        UpChain (Seller) <br />
        <div className="sm:text-base mt-2 pb-5">
          If you're a developer looking for gigs click{" "}
          <a className="text-slate-300 underline" href="https://chatgpt.com/">
            here!
          </a>
        </div>
      </div>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
      <div className="text-red-500 font-mono text-center mt-5">(This application is currently running on Solana Devnet.<br/> All tokens and transactions are for testing purposes only)</div>
    </div>
  );
}
