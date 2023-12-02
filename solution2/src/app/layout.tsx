import { NetworkContextProvider } from "@/Context/NetworkContext";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlloScan",
  description: "Dashboard for all things Allo v2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <NetworkContextProvider>
        <body>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Navbar />
            <main>
              <div className="lg:px-0 px-1 sm:px-2 md:px-6">
                <Suspense fallback={<Loading />}>
                  <div className={inter.className}>{children}</div>
                </Suspense>
              </div>
            </main>
            <Footer />
          </div>
        </body>
        <></>
      </NetworkContextProvider>
    </html>
  );
}
