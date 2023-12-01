"use client";
import React, { useState } from "react";
import { MicroGrantsStrategy, Allo, Registry } from "@allo-team/allo-v2-sdk/";

import { getIPFSClient } from "@/services/ipfs";
import {
  EProgressStatus,
  ETarget,
  TNewPool,
  TNewPoolResponse,
  TProgressStep,
} from "@/app/types";
import {
  sendTransaction,
  getWalletClient,
  waitForTransaction,
} from "@wagmi/core";
import { getChain, wagmiConfigData } from "@/services/wagmi";
import {
  NATIVE,
  extractLogByEventName,
  getEventValues,
  pollUntilDataIsIndexed,
  pollUntilMetadataIsAvailable,
} from "@/utils/common";
import { checkIfPoolIsIndexedQuery } from "@/utils/query";
import { useAccount } from "wagmi";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { getProfileById } from "@/utils/request";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { abi } from "@/utils/erc20.abi";
import { decodeEventLog, encodeFunctionData } from "viem";
import { AlloABI } from "@/abi/Allo";
import { MicroGrantsABI } from "@/abi/Microgrants";

export interface INewPoolContextProps {
  steps: TProgressStep[];
  createNewPool: (data: TNewPool, chain: number) => Promise<TNewPoolResponse>;
}

const initialSteps: TProgressStep[] = [
  {
    id: "pool-0",
    content: "Using profile ",
    target: "",
    href: "",
    status: EProgressStatus.IN_PROGRESS,
  },
  {
    id: "pool-1",
    content: "Saving your application to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "pool-2",
    content: "Deploying new pool strategy to ",
    target: ETarget.CHAIN,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "pool-3",
    content: "Approve token on ",
    target: ETarget.ALLO,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "pool-4",
    content: "Creating new pool on ",
    target: ETarget.ALLO,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "pool-5",
    content: "Indexing your pool on ",
    target: ETarget.SPEC,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "pool-6",
    content: "Indexing pool metadata on ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
];

export const NewPoolContext = React.createContext<INewPoolContextProps>({
  steps: [],
  createNewPool: async () => {
    return {
      poolId: 0,
      address: "0x1234",
    };
  },
});

// if true, set current step to success and next step to in progress, if false set current step to error

export const NewPoolContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);
  const { address } = useAccount();

  const updateStepTarget = (index: number, target: string) => {
    const newSteps = [...steps];
    newSteps[index].target = target;
    setSteps(newSteps);
  };

  const updateStepHref = (index: number, href: string) => {
    const newSteps = [...steps];
    newSteps[index].href = href;
    setSteps(newSteps);
  };

  const updateStepContent = (index: number, content: string) => {
    const newSteps = [...steps];
    newSteps[index].content = content;
    setSteps(newSteps);
  };

  const updateStepStatus = (index: number, flag: boolean) => {
    const newSteps = [...steps];
    if (flag) {
      newSteps[index].status = EProgressStatus.IS_SUCCESS;
    } else {
      newSteps[index].status = EProgressStatus.IS_ERROR;
    }

    if (steps.length > index + 1)
      newSteps[index + 1].status = EProgressStatus.IN_PROGRESS;

    setSteps(newSteps);
    return newSteps;
  };

  const createNewPool = async (
    data: TNewPool,
    chain: number,
  ): Promise<TNewPoolResponse> => {
    const chainInfo: any = getChain(chain);

    const allo = new Allo({
      chain: chain,
    });

    console.log("DATA", data);

    // if step target is CHAIN update target to chainInfo.name
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.map((step) => {
        if (step.target === ETarget.CHAIN) {
          step.target = chainInfo.name;
        }
      });
      return newSteps;
    });

    let stepIndex = 0;

    let profileContent = steps[0].content;
    let profileTarget = steps[0].target;

    if (data.profileName) {
      profileContent = "Creating new profile ";
      profileTarget = data.profileName;
    } else {
      const profile = await getProfileById({
        chainId: chain.toString(),
        profileId: data.profileId!.toLowerCase(),
      });

      profileTarget = profile.name;
    }

    updateStepContent(stepIndex, profileContent);
    updateStepTarget(stepIndex, profileTarget);
    updateStepHref(stepIndex, "");

    // return values
    let strategyAddress: string = "0x";
    let poolId: number = -1;
    const walletClient = await getWalletClient({ chainId: chain });

    let profileId = data.profileId;

    // if profileName is set, create profile
    if (data.profileName && address) {
      const registry = new Registry({ chain: chain });
      const randomNumber = Math.floor(Math.random() * 10000000000);

      const txCreateProfile: TransactionData = await registry.createProfile({
        nonce: randomNumber,
        name: data.profileName,
        metadata: {
          protocol: BigInt(0),
          pointer: "",
        },
        owner: address,
        members: [],
      });

      try {
        const tx = await sendTransaction({
          to: txCreateProfile.to as string,
          data: txCreateProfile.data,
          value: BigInt(txCreateProfile.value),
        });

        const receipt =
          await wagmiConfigData.publicClient.waitForTransactionReceipt({
            hash: tx.hash,
            confirmations: 2,
          });

        console.log("RECEIPT", { receipt });

        const { logs } = receipt;
        profileId = logs[0].topics[1] || "0x";

        if (profileId === "0x") {
          throw new Error("Profile creation failed");
        }

        updateStepHref(
          stepIndex,
          `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
        );
      } catch (e) {
        updateStepStatus(stepIndex, false);
        console.log("Creating Profile", e);
      }
    }

    updateStepStatus(stepIndex, true);
    stepIndex++;

    // 1. Save metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      profileId: profileId,
      name: data.name,
      website: data.website,
      description: data.description,
      base64Image: data.base64Image,
    };

    let imagePointer;
    let pointer;

    try {
      if (metadata.base64Image && metadata.base64Image.includes("base64")) {
        imagePointer = await ipfsClient.pinJSON({
          data: metadata.base64Image,
        });
        metadata.base64Image = imagePointer.IpfsHash;
      }

      pointer = await ipfsClient.pinJSON(metadata);
      updateStepHref(stepIndex, "https://ipfs.io/ipfs/" + pointer.IpfsHash);
      updateStepStatus(stepIndex, true);
    } catch (e) {
      console.log("IPFS", e);
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 2. Deploy new pool strategy

    const strategy = new MicroGrantsStrategy({
      chain: chain,
    });

    const deployParams = strategy.getDeployParams(data.strategyType);

    try {
      const hash = await walletClient!.deployContract({
        abi: deployParams.abi,
        bytecode: deployParams.bytecode as `0x${string}`,
        args: [],
      });

      const result = await waitForTransaction({ hash: hash, chainId: chain });
      strategyAddress = result.contractAddress!;

      updateStepTarget(stepIndex, `${chainInfo.name}`);
      updateStepHref(
        stepIndex,
        `${chainInfo.blockExplorers.default.url}/tx/` + strategyAddress,
      );
      updateStepStatus(stepIndex, true);
    } catch (e) {
      console.log("Deploying Strategy", e);
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    if (data.tokenAddress !== NATIVE) {
      const allowance = await wagmiConfigData.publicClient.readContract({
        address: data.tokenAddress,
        abi: abi,
        functionName: "allowance",
        args: [address, allo.address()],
      });

      console.log("Allowance", allowance as bigint);
      console.log("Fund Pool Amount", data.fundPoolAmount);
      console.log("diff", (allowance as bigint) - BigInt(data.fundPoolAmount));

      if ((allowance as bigint) <= BigInt(data.fundPoolAmount)) {
        const approvalAmount =
          BigInt(data.fundPoolAmount) - (allowance as bigint);

        const approveData = encodeFunctionData({
          abi: abi,
          functionName: "approve",
          args: [allo.address(), approvalAmount],
        });

        try {
          const tx = await sendTransaction({
            to: data.tokenAddress,
            data: approveData,
            value: BigInt(0),
          });

          await wagmiConfigData.publicClient.waitForTransactionReceipt({
            hash: tx.hash,
            confirmations: 2,
          });

          updateStepHref(
            stepIndex,
            `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
          );
          updateStepStatus(stepIndex, true);
        } catch (e) {
          updateStepStatus(stepIndex, false);
          console.log("Approving Token", e);
        }
      } else {
        updateStepContent(stepIndex, "Token already approved on ");
        updateStepStatus(stepIndex, true);
      }
    } else {
      updateStepContent(stepIndex, "Approval not needed on ");
      updateStepStatus(stepIndex, true);
    }

    stepIndex++;
    const startDateInSeconds = Math.floor(
      new Date(data.startDate).getTime() / 1000,
    );

    const endDateInSeconds = Math.floor(
      new Date(data.endDate).getTime() / 1000,
    );

    const initParams: any = {
      useRegistryAnchor: data.useRegistryAnchor,
      allocationStartTime: BigInt(startDateInSeconds),
      allocationEndTime: BigInt(endDateInSeconds),
      approvalThreshold: BigInt(data.approvalThreshold),
      maxRequestedAmount: BigInt(data.maxAmount),
    };

    if (data.strategyType == StrategyType.Hats) {
      initParams["hats"] = "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137";
      initParams["hatId"] = data.hatId;
    } else if (data.strategyType == StrategyType.Gov) {
      initParams["gov"] = data.gov;
      initParams["minVotePower"] = BigInt(data!.minVotePower!);
      initParams["snapshotReference"] = data!.snapshotReference!;
    }

    let initStrategyData;

    if (data.strategyType === StrategyType.MicroGrants) {
      initStrategyData = await strategy.getInitializeData(initParams);
    } else if (data.strategyType === StrategyType.Hats) {
      initStrategyData = await strategy.getInitializeDataHats(initParams);
    } else if (data.strategyType === StrategyType.Gov) {
      initStrategyData = await strategy.getInitializeDataGov(initParams);
    } else {
      throw new Error("Invalid strategy type");
    }

    const poolCreationData = {
      profileId: profileId,
      strategy: strategyAddress,
      initStrategyData: initStrategyData,
      token: data.tokenAddress,
      amount: BigInt(data.fundPoolAmount),
      metadata: {
        protocol: BigInt(1),
        pointer: pointer.IpfsHash,
      },
      managers: data.managers,
    };

    const createPoolData = await allo.createPoolWithCustomStrategy(
      poolCreationData,
    );

    try {
      const tx = await sendTransaction({
        to: createPoolData.to as string,
        data: createPoolData.data,
        value: BigInt(createPoolData.value),
      });

      const receipt =
        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
          confirmations: 2,
        });

      const logValues = getEventValues(receipt, MicroGrantsABI, "Initialized");
      poolId = logValues.poolId;

      updateStepTarget(stepIndex, `${chainInfo.name}`);
      updateStepHref(
        stepIndex,
        `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
      );
      updateStepStatus(stepIndex, true);
    } catch (e) {
      updateStepStatus(stepIndex, false);
      console.log("Creating Pool", e);
    }

    stepIndex++;

    // 4. Index Pool
    const pollingData: any = {
      chainId: chain,
      poolId: poolId,
    };
    let pollingResult = await pollUntilDataIsIndexed(
      checkIfPoolIsIndexedQuery,
      pollingData,
      "microGrant",
    );

    if (pollingResult) {
      updateStepStatus(stepIndex, true);
    } else {
      console.log("Polling ERROR");
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 5. Index Metadata

    const pollingMetadataResult = await pollUntilMetadataIsAvailable(
      pointer.IpfsHash,
    );

    if (pollingMetadataResult) {
      updateStepStatus(stepIndex, true);
    } else {
      console.log("Polling ERROR");
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    setTimeout(() => {}, 5000);

    return {
      address: strategyAddress as `0x${string}`,
      poolId: poolId,
    };
  };

  return (
    <NewPoolContext.Provider
      value={{
        steps: steps,
        createNewPool: createNewPool,
      }}
    >
      {props.children}
    </NewPoolContext.Provider>
  );
};
