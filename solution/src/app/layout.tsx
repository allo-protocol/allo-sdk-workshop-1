import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { WagmiConfig } from "wagmi";
import { wagmiConfigData, chainData } from "@/services/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ApplicationDetailContextProvider } from "@/context/ApplicationDetailContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Micro Grants",
  description: "A micro grants app built on top of the Allo protocol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <WagmiConfig config={wagmiConfigData}>
          <RainbowKitProvider chains={chainData}>
            <ApplicationDetailContextProvider>
              <Navbar />
              <main className="px-6 md:px-0 mt-8">{children}</main>
            </ApplicationDetailContextProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
