"use client";
import React, { FC, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { usePathname, useRouter } from "next/navigation";
import Appbar from "../../components/Appbar";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && window.location.pathname !== "/landing") {
      router.push("/");
    }
  }, [router]);
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint =
    "https://solana-devnet.g.alchemy.com/v2/qlsrTkNGjnuK46GWAC2AVAaVnVZ2ylVf";
  const wallets = useMemo(
    () => [],

    [network]
  );
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {!isLandingPage && <Appbar />}
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
