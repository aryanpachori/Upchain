"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function Landing() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push("/jobs");
    }
  }, [publicKey, router]);

  const words = [
    { text: "Empower", className: "text-white" },
    { text: "Your", className: "text-white" },
    { text: "Projects", className: "text-white" },
    { text: "with", className: "text-white" },
    { text: "Solana Payments.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="text-blue-500 font-bold font-sans dark:text-neutral-200 text-3xl text-center ">
        UpChain (Devs)<br />
        <div className="sm:text-base mt-2 pb-5">
          If you're a seller looking for developers, click{" "}
          <a className="text-slate-300 underline" href="https://chatgpt.com/">here!</a>
        </div>
      </div>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
    </div>
  );
}
