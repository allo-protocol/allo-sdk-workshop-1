"use client";
import React, { useState } from "react";

import { MicroGrantsABI } from "@/abi/Microgrants";
import { RegistryABI } from "@/abi/Registry";
import {
  EProgressStatus,
  ETarget,
  TNewApplication,
  TProgressStep,
} from "@/app/types";
import { getIPFSClient } from "@/services/ipfs";
import { getChain, wagmiConfigData } from "@/services/wagmi";
import {
  ethereumHashRegExp,
  extractLogByEventName,
  getEventValues,
  pollUntilDataIsIndexed,
  pollUntilMetadataIsAvailable,
} from "@/utils/common";
import { checkIfRecipientIsIndexedQuery } from "@/utils/query";
import { getProfileById } from "@/utils/request";
import {
  ZERO_ADDRESS
} from "@allo-team/allo-v2-sdk/dist/Common/types";
import { sendTransaction } from "@wagmi/core";
import { decodeEventLog } from "viem";
import { useAccount } from "wagmi";

export interface IApplicationContextProps {
  steps: TProgressStep[];
  createApplication: (
    data: TNewApplication,
    chain: number,
    poolId: number
  ) => Promise<string>;
}

const initialSteps: TProgressStep[] = [
  {
    id: 'application-0',
    content: "Using profile ",
    target: "",
    href: "",
    status: EProgressStatus.IN_PROGRESS,
  },
  {
    id: "application-1",
    content: "Saving your application to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "application-2",
    content: "Registering your application on ",
    target: ETarget.POOL,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "application-3",
    content: "Indexing your application on ",
    target: ETarget.SPEC,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: "application-4",
    content: "Indexing application metadata on ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
];

export const ApplicationContext = React.createContext<IApplicationContextProps>(
  {
    steps: [],
    createApplication: async () => {
      return "";
    },
  }
);

export const ApplicationContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);
  const { address } = useAccount();

  const updateStepTarget = (index: number, target: string) => {
    const newSteps = [...steps];
    newSteps[index].target = target;
    setSteps(newSteps);
  };

  const updateStepStatus = (index: number, flag: boolean) => {
    const newSteps = [...steps];
    if (flag) {
      newSteps[index].status = EProgressStatus.IS_SUCCESS;
    } else {
      newSteps[index].status = EProgressStatus.IS_ERROR;
    }

    if (flag && steps.length > index + 1)
      newSteps[index + 1].status = EProgressStatus.IN_PROGRESS;

    setSteps(newSteps);
    return newSteps;
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

  const createApplication = async (
    data: TNewApplication,
    chain: number,
    poolId: number
  ): Promise<string> => {

    // reset steps
    steps.map((step, index) => {
      if (index == 0) step.status = EProgressStatus.IN_PROGRESS;
      else step.status = EProgressStatus.NOT_STARTED;
    })
    setSteps(steps);

    // todo: check for supported chain. Update steps if not supported.
    if (chain !== 5) {
      // todo: update steps
      updateStepStatus(steps.length, false);
      updateStepContent(steps.length, "Unsupported chain");

      return "0x";
    }

    const chainInfo: any | unknown = getChain(chain);

    const newSteps = [...steps];
    newSteps.map((step, index) => {
      if (step.target === ETarget.CHAIN) {
        updateStepTarget(index, chainInfo.name);
      }
    });

    let stepIndex = 0;

    let profileContent = steps[0].content;
    let profileTarget = steps[0].target;

    // if data.profileName set a new step at index 0 of steps
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

    let profileId = data.profileId;
    // ToDo: Create instance of registry from SDK
    // -> snippet

    // 1. if profileName is set, create profile
    if (data.profileName && address) {
      const randomNumber = Math.floor(Math.random() * 10000000000);

      // ToDo: Prepare transaction for sending
      // -> snippet - createProfileTx

      try {
        const tx = await sendTransaction({
          to: txCreateProfile.to as string,
          data: txCreateProfile.data,
          value: BigInt(txCreateProfile.value),
        });

        const receipt =
          await wagmiConfigData.publicClient.waitForTransactionReceipt({
            hash: tx.hash,
          });

        profileId =
          getEventValues(receipt, RegistryABI, "ProfileCreated").profileId ||
          "0x";

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

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    updateStepStatus(stepIndex, true);

    stepIndex++;

    // 2. Save metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      name: data.name,
      website: data.website,
      description: data.description,
      email: data.email,
      base64Image: data.base64Image,
    };

    let imagePointer;
    let pointer;

    try {
      if (metadata.base64Image.includes("base64")) {
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

    // 3. Register application to pool
    let recipientId;
    let anchorAddress: string = ZERO_ADDRESS;

    // ToDo: Create instance of microgrants from SDK
    // -> snippet - createMicroGrantsInstance

    if (ethereumHashRegExp.test(profileId || "")) {
      anchorAddress = (
        await getProfileById({
          chainId: chain.toString(),
          profileId: profileId!.toLowerCase(),
        })
      ).anchor;
    }

    // ToDo: Prepare register recipient transaction for sending
    // -> snippet - getRegisterRecipientData

    try {
      // Send the transaction
      const tx = await sendTransaction({
        to: registerRecipientData.to as string,
        data: registerRecipientData.data,
        value: BigInt(registerRecipientData.value),
      });

      const reciept =
        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
        });

      const { logs } = reciept;
      const decodedLogs = logs.map((log) =>
        decodeEventLog({ ...log, abi: MicroGrantsABI }),
      );

      let log = extractLogByEventName(decodedLogs, "Registered");
      if (!log) {
        log = extractLogByEventName(decodedLogs, "UpdatedRegistration");
      }

      recipientId = log.args["recipientId"].toLowerCase();

      updateStepTarget(
        stepIndex,
        `${chainInfo.name} at ${tx.hash.slice(0, 6)}`,
      );

      updateStepHref(
        stepIndex,
        `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
      );

      updateStepStatus(stepIndex, true);
    } catch (e) {
      console.log("Registering Application", e);
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 4. Poll indexer for recipientId
    const pollingData: any = {
      chainId: chain,
      poolId: poolId,
      recipientId: recipientId.toLowerCase(),
    };
    const pollingResult: boolean = await pollUntilDataIsIndexed(
      checkIfRecipientIsIndexedQuery,
      pollingData,
      "microGrantRecipient",
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

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return recipientId;
  };

  return (
    <ApplicationContext.Provider
      value={{
        steps: steps,
        createApplication: createApplication,
      }}
    >
      {props.children}
    </ApplicationContext.Provider>
  );
};
