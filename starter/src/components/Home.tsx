"use client";

import { TNewApplication } from "@/app/types";
import { base64Image, commonConfig } from "@/config/common";
import { createPool } from "@/sdk/allo";
import { allocate, createApplication } from "@/sdk/microgrants";
import { createProfile } from "@/sdk/registry";
import { Allocation } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";

import Link from "next/link";

const Home = () => {
  // Set this here so we dont have to create a new profile every time and we are not managing state in this demo.
  // We use the profileId to create a new application in `_newApplicationData`.

  const _newApplicationData: TNewApplication = {
    name: commonConfig.application.name,
    website: commonConfig.application.website,
    description: commonConfig.application.description,
    email: commonConfig.application.email,
    requestedAmount: BigInt(1e12),
    recipientAddress: commonConfig.recipientId,
    base64Image: base64Image,
    profileName: commonConfig.application.profileName,
    profileId: commonConfig.application.profileId,
  };

  const _allocationData: Allocation = {
    recipientId: commonConfig.recipientId,
    status: Status.Accepted,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-2">
      <div className="relative flex place-items-center text-5xl before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        Allo
      </div>
      <div className="-mt-40">
        A general purpose protocol for the efficient allocation of capital.
      </div>
      {/*  Button Group */}
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
              createApplication(
                _newApplicationData,
                commonConfig.chainId,
                commonConfig.poolId
              ).then((res: any) => {
                console.log("Recipient ID: ", res && res.recipientId);
              });
            }}
            className="bg-gradient-to-r from-[#ff00a0] to-[#d75fab] text-white rounded-lg mx-2 px-4 py-2"
          >
            Apply to Pool
          </button>
          <button
            onClick={() => {
              allocate(_allocationData).then(() => {
                console.log("Allocated");
              });
            }}
            className="bg-gradient-to-r from-[#ff00a0] to-[#d75fab] text-white rounded-lg mx-2 px-4 py-2"
          >
            Allocate to Pool
          </button>
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
    </div>
  );
};

export default Home;
