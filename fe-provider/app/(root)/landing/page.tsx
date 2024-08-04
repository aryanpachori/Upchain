"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Landing() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push("/postjob");
    }
  }, [publicKey, router]);

  const words = [
    { text: "Empower", className: "text-white"},
    { text: "Your" , className: "text-white"},
    { text: "Projects",className: "text-white"},
    { text: "with" , className: "text-white"},
    { text: "Solana Payments.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <p className="text-blue-500 font-bold font-sans dark:text-neutral-200 sm:text-base text-3xl">
        UpChain
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
    </div>
  );
}
