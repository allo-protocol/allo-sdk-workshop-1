"use client";

import { EProgressStatus, ETarget, TProgressStep } from "@/app/types";
import { Allo, MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import {
  Allocation,
  Recipient,
  SetAllocatorData,
} from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { createContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { getChain, wagmiConfigData } from "@/services/wagmi";
import { useRouter } from "next/navigation";
import { trucateString } from "@/components/shared/Address";

const initialSteps: TProgressStep[] = [
  {
    id: 'allocator-0',
    content: "Updating allocators",
    target: "",
    href: "#",
    status: EProgressStatus.IN_PROGRESS,
  },
];

export interface IPoolContextProps {
  isLoaded: boolean;
  isAllocator: boolean;
  isPoolManager: boolean;
  isRecipient: boolean;
  strategy?: MicroGrantsStrategy;
  batchSetAllocator: (data: SetAllocatorData[]) => Promise<void>;
  allocate: (data: Allocation) => Promise<void>;
  steps: TProgressStep[];
}

export const PoolContext = createContext<IPoolContextProps>({
  isLoaded: false,
  isAllocator: false,
  isPoolManager: false,
  isRecipient: false,
  strategy: undefined,
  batchSetAllocator: async () => {},
  allocate: async () => {},
  steps: initialSteps,
});

export const PoolContextProvider = (props: {
  chainId: string;
  poolId: string;
  children: JSX.Element | JSX.Element[];
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);
  const [isAllocator, setIsAllocator] = useState(false);
  const [isPoolManager, setIsPoolManager] = useState(false);
  const [isRecipient, setIsRecipient] = useState(false);
  const [strategy, setStrategy] = useState<MicroGrantsStrategy | undefined>(
    undefined
  );

  const { isConnected, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    const checkAllocator = async () => {
      if (isConnected && address) {
        setIsLoaded(false);
        const allo = new Allo({
          chain: Number(props.chainId),
        });

        const _isPoolManager = await allo.isPoolManager(
          Number(props.poolId),
          address
        );

        setIsPoolManager(_isPoolManager);

        const strategy = await allo.getStrategy(Number(props.poolId));
        const microGrants = new MicroGrantsStrategy({
          chain: Number(props.chainId),
          address: strategy as `0x${string}`,
          poolId: Number(props.poolId),
        });

        setStrategy(microGrants);

        try {
          const _isAllocator = await microGrants.isValidAllocator(address);
          setIsAllocator(_isAllocator);
        } catch (error) {
          console.log("Error checking allocator", error);
        }

        const recipient: Recipient = await microGrants.getRecipient(address);

        setIsRecipient(recipient.recipientStatus !== 0);
        setIsLoaded(true);
      }
    };

    checkAllocator();
  }, [props.chainId, props.poolId, address, isConnected]);

  const updateStepTarget = (index: number, target: string) => {
    const newSteps = [...steps];
    newSteps[index].target = target;
    setSteps(newSteps);
  };

  const updateStepStatus = (index: number, status: EProgressStatus) => {
    const newSteps = [...steps];
    newSteps[index].status = status;
    setSteps(newSteps);
  };

  const updateStepHref = (index: number, href: string) => {
    const newSteps = [...steps];
    newSteps[index].href = href;
    setSteps(newSteps);
  };

  const batchSetAllocator = async (data: SetAllocatorData[]) => {
    if (strategy) {
      const chainInfo: any | unknown = getChain(Number(props.chainId));

      const txData: TransactionData = strategy.getBatchSetAllocatorData(data);

      try {
        const tx = await sendTransaction({
          to: txData.to as string,
          data: txData.data,
          value: BigInt(txData.value),
        });

        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
        });

        updateStepTarget(0, ` at ${trucateString(tx.hash.toString())}`);
        updateStepHref(
          0,
          `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash
        );

        updateStepStatus(0, EProgressStatus.IS_SUCCESS);
        setTimeout(() => {
          router.refresh();
        }, 3000);
      } catch (e) {
        console.log("Updating Allocators", e);
        updateStepStatus(0, EProgressStatus.IS_ERROR);
      }
    }
  };

  const allocate = async (data: Allocation) => {
    setSteps([
      {
        id: "0",
        content: "Allocating",
        target: ETarget.POOL,
        href: "#",
        status: EProgressStatus.IN_PROGRESS,
      },
    ]);

    if (strategy) {
      const chainInfo: any | unknown = getChain(Number(props.chainId));

      const txData: TransactionData = strategy.getAllocationData(
        data.recipientId,
        data.status
      );

      try {
        const tx = await sendTransaction({
          to: txData.to as string,
          data: txData.data,
          value: BigInt(txData.value),
        });

        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
        });

        updateStepTarget(0, `${chainInfo.name} at ${trucateString(tx.hash)}`);
        updateStepHref(
          0,
          `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash
        );

        updateStepStatus(0, EProgressStatus.IS_SUCCESS);

        setTimeout(() => {
          router.refresh();
        }, 3000);
      } catch (e) {
        console.log("Allocating", e);
        updateStepStatus(0, EProgressStatus.IS_ERROR);
      }
    }
  };

  return (
    <PoolContext.Provider
      value={{
        isLoaded,
        isAllocator,
        isPoolManager,
        isRecipient,
        strategy,
        batchSetAllocator,
        allocate,
        steps,
      }}
    >
      {props.children}
    </PoolContext.Provider>
  );
};
