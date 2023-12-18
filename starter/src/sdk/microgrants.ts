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
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
// import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
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

// create a strategy instance
// todo: snippet => createStrategyInstance
export const strategy = new MicroGrantsStrategy({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
});

export const deployParams = strategy.getDeployParams("MicroGrantsv1");

// console.log("deployParams", deployParams);

// NOTE: This is the deploy params for the MicroGrantsv1 contract
// 🚨 Please make sure your strategy type is correct or Spec will not index it.
// MicroGrants: StrategyType.MicroGrants
// Hats: StrategyType.Hats
// Gov: StrategyType.Gov
// todo: snippet => deployParams

// This is called from `allo.ts` and is used to deploy the strategy contract and create a pool.
// It is recommended you split this out into two functions, one to deploy the strategy and one to create the pool
// for a more usable application.
export const deployMicrograntsStrategy = async (
  pointer: any,
  profileId: string
) => {
  const walletClient = await getWalletClient({ chainId: 421614 });
  // const profileId = await createProfile();

  let strategyAddress: string = "0x";
  let poolId = -1;

  try {
    const hash = await walletClient!.deployContract({
      abi: deployParams.abi,
      bytecode: deployParams.bytecode as `0x${string}`,
      args: [],
    });

    const result = await waitForTransaction({ hash: hash, chainId: 421614 });
    strategyAddress = result.contractAddress!;
  } catch (e) {
    console.error("Deploying Strategy", e);
  }

  // NOTE: Timestamps should be in seconds and start should be a few minutes in the future to account for transaction times.7
  const startDateInSeconds = Math.floor(new Date().getTime() / 1000) + 300;
  const endDateInSeconds = Math.floor(new Date().getTime() / 1000) + 10000;

  const initParams: any = {
    useRegistryAnchor: true,
    allocationStartTime: BigInt(startDateInSeconds),
    allocationEndTime: BigInt(endDateInSeconds),
    approvalThreshold: BigInt(1),
    maxRequestedAmount: BigInt(1e13),
  };

  // get the init data
  // todo: snippet => getInitializeData

  const poolCreationData: CreatePoolArgs = {
    profileId: profileId, // sender must be a profile member
    strategy: strategyAddress, // approved strategy contract
    initStrategyData: initStrategyData, // unique to the strategy
    token: NATIVE, // you need to change this to your token address
    amount: BigInt(1e14),
    metadata: {
      protocol: BigInt(1),
      pointer: pointer.IpfsHash,
    },
    managers: [
      "0x add your wallet address here along with any other managers you want to add",
    ],
  };

  // Prepare the transaction data
  // todo: snippet => createPoolWithCustomStrategy

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
    //   chainId: 421614,
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
    const strategyAddress = await allo.getStrategy(3);
    console.log("strategyAddress", strategyAddress);

    strategy.setContract(strategyAddress as `0x${string}`);
    const txData: TransactionData = strategy.getBatchSetAllocatorData(data);

    console.log("txData", txData);

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

export const createApplication = async (
  data: TNewApplication,
  chain: number,
  poolId: number
): Promise<string> => {
  if (chain !== 421614) return "0x";

  // Set some allocators for demo
  // NOTE: Import type from SDK - SetAllocatorData[]
  const allocatorData: SetAllocatorData[] = [
    {
      allocatorAddress: "0x enter your wallet address here",
      flag: true,
    },
  ];

  // todo: set the allocators defined above
  await batchSetAllocator(allocatorData);

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
  const strategy = new MicroGrantsStrategy({
    chain,
    rpc: "https://arb-sepolia.g.alchemy.com/v2/SLqkAkF6od4OWU62e-XWbuzmKvwjehYp",
    poolId,
  });
  let anchorAddress: string = ZERO_ADDRESS;

  // Get the anchor address for the profileId
  if (ethereumHashRegExp.test(profileId || "")) {
    anchorAddress = (
      await getProfileById({
        chainId: chain.toString(),
        profileId: profileId!.toLowerCase(),
      })
    ).anchor;
  }

  console.log("anchorAddress", anchorAddress);

  // todo: snippet => getRegisterRecipientData
  const registerRecipientData = strategy.getRegisterRecipientData({
    registryAnchor: anchorAddress as `0x${string}`,
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

export const allocate = async (data: Allocation) => {
  if (strategy) {
    // const chainInfo: any | unknown = getChain(421614);

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
