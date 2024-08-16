import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { TextRevealCard } from "./ui/text-reveal-card";

export default function Appbar() {
  const { disconnect } = useWallet();
  const router = useRouter();
  const handleDisconnect = () => {
    localStorage.removeItem("token");
    disconnect();
    router.push("/");
  };
  return (
    <header className="w-screen bg-gray-800 text-primary-foreground py-4 px-6 flex items-center justify-between box-border overflow-hidden">
      <TextRevealCard
        text="Welcome to the Dashboard"
        className="flex items-center h-12 bg-gray-800 border border-slate-800 rounded-md"
      />
     
      <div className="flex gap-4 ml-auto">
        <button
          onClick={() => router.push("/jobs")}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2"
        >
          Jobs
        </button>
        <button
          onClick={() => router.push("/contracts")}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2"
        >
          Contracts
        </button>
        <button
          onClick={handleDisconnect}
          className="inline-flex h-12 px-3 py-1 pt-2 rounded-md bg-red-500 font-semibold font-mono transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500"
        >
          Disconnect Wallet
        </button>
      </div>
    </header>
  );
}
