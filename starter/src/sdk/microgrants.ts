import { MicroGrantsABI } from "@/abi/Microgrants";
import { wagmiConfigData } from "@/services/wagmi";
import { getEventValues } from "@/utils/common";
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { allo } from "./allo";
import { createProfile } from "./registry";
// import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

export const strategy = new MicroGrantsStrategy({
  chain: 5,
});

export const deployParams = strategy.getDeployParams("MicroGrants");

export const deployMicrograntsStrategy = async (pointer: string) => {
  const walletClient = await getWalletClient({ chainId: 5 });
  const profileId = await createProfile();

  let strategyAddress: string = "0x";
  let poolId = -1;

  try {
    const hash = await walletClient!.deployContract({
      abi: deployParams.abi,
      bytecode: deployParams.bytecode as `0x${string}`,
      args: [],
    });

    const result = await waitForTransaction({ hash: hash, chainId: 5 });
    strategyAddress = result.contractAddress!;
  } catch (e) {
    console.error("Deploying Strategy", e);
  }

  // NOTE: Set this up for token allowances when not the native token
  // if (data.tokenAddress !== NATIVE) {
  //   const allowance = await wagmiConfigData.publicClient.readContract({
  //     address: data.tokenAddress,
  //     abi: abi,
  //     functionName: "allowance",
  //     args: [address, allo.address()],
  //   });

  //   if ((allowance as bigint) <= BigInt(data.fundPoolAmount)) {
  //     const approvalAmount =
  //       BigInt(data.fundPoolAmount) - (allowance as bigint);

  //     const approveData = encodeFunctionData({
  //       abi: abi,
  //       functionName: "approve",
  //       args: [allo.address(), approvalAmount],
  //     });

  //     try {
  //       const tx = await sendTransaction({
  //         to: data.tokenAddress,
  //         data: approveData,
  //         value: BigInt(0),
  //       });

  //       await wagmiConfigData.publicClient.waitForTransactionReceipt({
  //         hash: tx.hash,
  //         confirmations: 2,
  //       });

  //       updateStepHref(
  //         stepIndex,
  //         `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash
  //       );
  //       updateStepStatus(stepIndex, true);
  //     } catch (e) {
  //       updateStepStatus(stepIndex, false);
  //       console.log("Approving Token", e);
  //     }
  //   } else {
  //     updateStepContent(stepIndex, "Token already approved on ");
  //     updateStepStatus(stepIndex, true);
  //   }
  // } else {
  //   updateStepContent(stepIndex, "Approval not needed on ");
  //   updateStepStatus(stepIndex, true);
  // }

  const startDateInSeconds = Math.floor(new Date().getDate() / 1000);
  const endDateInSeconds = Math.floor(new Date().getDate() / 1000) + 1000000;

  const initParams: any = {
    useRegistryAnchor: true,
    allocationStartTime: BigInt(startDateInSeconds),
    allocationEndTime: BigInt(endDateInSeconds),
    approvalThreshold: BigInt(1),
    maxRequestedAmount: BigInt(10e18),
  };

  const initStrategyData = await strategy.getInitializeData(initParams);
  const poolCreationData = {
    profileId: profileId,
    strategy: strategyAddress,
    initStrategyData: initStrategyData,
    // this is the test Allo token address
    token: "0xc55ac684bcB96E2a3aCcE1f1F1300dD32Cd8bA06", // you need to change this to your token address
    amount: BigInt(10e18),
    metadata: {
      protocol: BigInt(1),
      pointer: pointer,
    },
    managers: [
      "0x5cdb35fADB8262A3f88863254c870c2e6A848CcA",
      "0xE7eB5D2b5b188777df902e89c54570E7Ef4F59CE",
      "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
    ],
  };

  const createPoolData = await allo.createPoolWithCustomStrategy(
    poolCreationData
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
    // poolId is a BigInt and we need to parse it to a number
    if (logValues.poolId) poolId = Number(logValues.poolId);

    // NOTE: Index Pool Example
    // const pollingData: any = {
    //   chainId: 5,
    //   poolId: poolId,
    // };
    // let pollingResult = await pollUntilDataIsIndexed(
    //   checkIfPoolIsIndexedQuery,
    //   pollingData,
    //   "microGrant"
    // );

    // NOTE: Index Metadata Example
    // const pollingMetadataResult = await pollUntilMetadataIsAvailable(
    //   pointer.IpfsHash
    // );

    setTimeout(() => {}, 5000);

    return {
      address: strategyAddress as `0x${string}`,
      poolId: poolId,
    };
  } catch (e) {
    console.error("Creating Pool", e);
  }
};
