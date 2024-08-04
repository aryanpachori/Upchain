import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Appbar() {
  const { disconnect } = useWallet();
  const router = useRouter();
  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };
  return (
    <header className="bg-gray-800 text-primary-foreground py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your job postings and applications
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/postjob")}
          className="px-6 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
        >
          Post a Job
        </button>

        <button
          onClick={() => router.push("/responses")}
          className="px-7 py-2 rounded-full bg-gradient-to-b from-green-400 to-green-500 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
        >
          Job Responses
        </button>

        <button
          onClick={handleDisconnect}
          className="px-8 py-2 rounded-md bg-red-500 text-white- font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500"
        >
          Disconnect Wallet
        </button>
      </div>
    </header>
  );
}
