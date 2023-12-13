import { MicroGrantsABI } from "@/abi/Microgrants";
import { TNewApplication } from "@/app/types";
import { getIPFSClient } from "@/services/ipfs";
import { wagmiConfigData } from "@/services/wagmi";
import {
  NATIVE,
  ethereumHashRegExp,
  extractLogByEventName,
  getEventValues,
  pollUntilDataIsIndexed,
  pollUntilMetadataIsAvailable,
} from "@/utils/common";
import { checkIfRecipientIsIndexedQuery } from "@/utils/query";
import { getProfileById } from "@/utils/request";
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import {
  TransactionData,
  ZERO_ADDRESS,
} from "@allo-team/allo-v2-sdk/dist/Common/types";
import {
  Allocation,
  SetAllocatorData,
} from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { decodeEventLog } from "viem";
import { allo } from "./allo";
// import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

// "0xb79772d36362c27a56e9f0d914af6dbb0e5a9a07" pool 81

export const strategy = new MicroGrantsStrategy({
  chain: 5,
  // poolId: 81,
});

export const deployParams = strategy.getDeployParams("MicroGrants");

export const deployMicrograntsStrategy = async (
  pointer: any,
  profileId: string
) => {
  const walletClient = await getWalletClient({ chainId: 5 });
  // const profileId = await createProfile();

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

  console.log("date", new Date());

  const startDateInSeconds = Math.floor(new Date().getTime() / 1000) + 300;
  const endDateInSeconds = Math.floor(new Date().getTime() / 1000) + 10000;

  const initParams: any = {
    useRegistryAnchor: true,
    allocationStartTime: BigInt(startDateInSeconds),
    allocationEndTime: BigInt(endDateInSeconds),
    approvalThreshold: BigInt(1),
    maxRequestedAmount: BigInt(1e13),
  };

  console.log("initParams", initParams);

  const initStrategyData = await strategy.getInitializeData(initParams);
  const poolCreationData = {
    profileId: profileId,
    strategy: strategyAddress,
    initStrategyData: initStrategyData,
    // this is the test Allo token address
    token: NATIVE, // you need to change this to your token address
    amount: BigInt(1e14),
    metadata: {
      protocol: BigInt(1),
      pointer: pointer.IpfsHash,
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

export const batchSetAllocator = async (data: SetAllocatorData[]) => {
  if (strategy) {
    // const chainInfo: any | unknown = getChain(5);
    const strategyAddress = await allo.getStrategy(81);
    console.log("strategyAddress", strategyAddress);

    strategy.setContract(strategyAddress as `0x${string}`);
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (e) {
      console.log("Updating Allocators", e);
    }
  }
};

export const allocate = async (data: Allocation) => {
  if (strategy) {
    // const chainInfo: any | unknown = getChain(5);

    strategy.setPoolId(81);
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (e) {
      console.log("Allocating", e);
    }
  }
};

export const createApplication = async (
  data: TNewApplication,
  chain: number,
  poolId: number
): Promise<string> => {
  if (chain !== 5) return "0x";

  // Set some allocators for demo
  const allocatorData: SetAllocatorData[] = [
    {
      allocatorAddress: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
      flag: true,
    },
  ];

  // await batchSetAllocator(allocatorData);

  console.log("Allocators set");

  // const chainInfo: any | unknown = getChain(chain);
  let profileId = data.profileId;

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

    console.log("Metadata saved to IPFS with pointer: ", pointer);
  } catch (e) {
    console.error("IPFS", e);
  }

  // 3. Register application to pool
  let recipientId;
  const strategy = new MicroGrantsStrategy({ chain, poolId });
  let anchorAddress: string = ZERO_ADDRESS;

  if (ethereumHashRegExp.test(profileId || "")) {
    anchorAddress = (
      await getProfileById({
        chainId: chain.toString(),
        profileId: profileId!.toLowerCase(),
      })
    ).anchor;
  }

  console.log("anchorAddress", anchorAddress);

  const registerRecipientData = strategy.getRegisterRecipientData({
    registryAnchor: "0xcff0fdff14df9d00822279270e7ec87984151a84", // anchorAddress as `0x${string}`,
    recipientAddress: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42", // data.recipientAddress as `0x${string}`,
    requestedAmount: BigInt(1e13), // data.requestedAmount,
    metadata: {
      protocol: BigInt(1),
      pointer: pointer.IpfsHash,
    },
  });

  console.log("registerRecipientData", registerRecipientData);

  try {
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
      decodeEventLog({ ...log, abi: MicroGrantsABI })
    );

    let log = extractLogByEventName(decodedLogs, "Registered");
    if (!log) {
      log = extractLogByEventName(decodedLogs, "UpdatedRegistration");
    }

    recipientId = log.args["recipientId"].toLowerCase();
  } catch (e) {
    console.error("Error Registering Application", e);
  }

  // 4. Poll indexer for recipientId
  const pollingData: any = {
    chainId: chain,
    poolId: poolId,
    recipientId: recipientId.toLowerCase(),
  };
  const pollingResult: boolean = await pollUntilDataIsIndexed(
    checkIfRecipientIsIndexedQuery,
    pollingData,
    "microGrantRecipient"
  );

  if (pollingResult) {
    // do something with result...
  } else {
    console.error("Polling ERROR");
  }

  // 5. Index Metadata
  const pollingMetadataResult = await pollUntilMetadataIsAvailable(
    pointer.IpfsHash
  );

  if (pollingMetadataResult) {
    // do something with result...
  } else {
    console.error("Polling ERROR");
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  return recipientId;
};
