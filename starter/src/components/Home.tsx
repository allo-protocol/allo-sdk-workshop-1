"use client";

import { TNewApplication } from "@/app/types";
import { createPool } from "@/sdk/allo";
import { createApplication } from "@/sdk/microgrants";
import { createProfile } from "@/sdk/registry";
import { chainData, wagmiConfigData } from "@/services/wagmi";
import { Allocation } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";
import {
  ConnectButton,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import Link from "next/link";
import { parseUnits } from "viem";
import { WagmiConfig } from "wagmi";

const Home = () => {
  const profileId =
    "0x0aa2b47aa154688c11623fa2853f56c245684efd8c530047163775f5e0b304a5";
  const _newApplicationData: TNewApplication = {
    name: "Test Application",
    website: "https://docs.allo.gitcoin.co",
    description: "Test Application Description",
    email: "test@gitcoin.co",
    requestedAmount: parseUnits("0.1", 18),
    recipientAddress: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
    base64Image: "",
    profileName: "",
    profileId: profileId,
  };

  const _allocationData: Allocation = {
    recipientId: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
    status: Status.Accepted,
  };

  return (
    <WagmiConfig config={wagmiConfigData}>
      <RainbowKitProvider
        chains={chainData}
        modalSize="wide"
        theme={midnightTheme()}
      >
        <main className="flex min-h-screen flex-col items-center justify-between p-2">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Get started by editing&nbsp;
              <code className="font-mono font-bold">src/app/page.tsx</code>
            </p>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <ConnectButton />
            </div>
          </div>

          <div className="relative flex place-items-center text-5xl before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
            Allo
          </div>
          <div className="-mt-40">
            A general purpose protocol for the efficient allocation of capital.
          </div>

          <div>
            <div className="flex flex-row">
              <button
                onClick={() =>
                  createProfile().then((res: any) => {
                    console.log("Profile ID: ", res);
                    alert("Profile created with ID: " + res);
                  })
                }
                className="bg-gradient-to-r from-[#ff00a0] to-[#d75fab] text-white rounded-lg mx-2 px-4 py-2"
              >
                Create Profile
              </button>
              <button
                onClick={() => {
                  createPool().then((res: any) => {
                    console.log("Pool ID: ", res.poolId);
                    alert("Pool created with ID: " + res.poolId);
                  });
                }}
                className="bg-gradient-to-r from-[#ff00a0] to-[#d75fab] text-white rounded-lg mx-2 px-4 py-2"
              >
                Create Pool
              </button>
              <button
                onClick={() => {
                  // todo: add your new created poolID
                  createApplication(_newApplicationData, 5, 81).then(
                    (res: any) => {
                      console.log("Recipient ID: ", res.recipientId);
                      alert("Applied with ID: " + res.recipientId);
                    }
                  );
                }}
                className="bg-gradient-to-r from-[#ff00a0] to-[#d75fab] text-white rounded-lg mx-2 px-4 py-2"
              >
                Apply to Pool
              </button>
              {/* WIP */}
              {/* <button
                onClick={() => {
                  allocate(_allocationData).then((res: any) => {
                    console.log("Recipient ID: ", res.recipientId);
                    alert("Applied with ID: " + res.recipientId);
                  });
                }}
                className="bg-gradient-to-r from-[#ff00a0] to-[#d75fab] text-white rounded-lg mx-2 px-4 py-2"
              >
                Allocate to Pool
              </button> */}
            </div>
          </div>

          <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3">
            <Link
              href="https://docs.allo.gitcoin.co/"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                Docs{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Find in-depth information about Allo .
              </p>
            </Link>

            <Link
              href="https://github.com/allo-protocol/allo-v2-sdk"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                SDK Github{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Learn about Next.js in an interactive course with&nbsp;quizzes!
              </p>
            </Link>

            <Link
              href="https://github.com/allo-protocol/allo-v2"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                Allo Github{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Explore starter templates for Next.js.
              </p>
            </Link>
          </div>
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Home;
