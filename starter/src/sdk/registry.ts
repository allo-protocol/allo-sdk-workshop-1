import { RegistryABI } from "@/abi/Registry";
import { wagmiConfigData } from "@/services/wagmi";
import { getEventValues } from "@/utils/common";
import { Registry } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { sendTransaction } from "@wagmi/core";

// create a registry instance
// todo: snippet => createRegistryInstance
export const registry = new Registry({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
});

// NOTE: Update this function to use your own data.
export const createProfile = async () => {
  // prepare the arguments -> type comes from the SDK
  const createProfileArgs: CreateProfileArgs = {
    // random number to prevent nonce reuse, this is required.
    // NOTE: The profile ID id based on the provided nonce and the caller's address.
    nonce: Math.floor(Math.random() * 10000),
    name: "Allo Workshop",
    metadata: {
      protocol: BigInt(1),
      pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
    },
    // owner is added as a member by default
    members: [],
    owner: "0x8C180840fcBb90CE8464B4eCd12ab0f840c6647C",
  };

  console.log("Creating profile with args: ", createProfileArgs);

  // create the transaction with the arguments -> type comes from SDK
  // todo: snippet => createProfileTx
  const txData: TransactionData = await registry.createProfile(
    createProfileArgs
  );

  const txHash = await sendTransaction({
    to: txData.to,
    data: txData.data,
    value: BigInt(txData.value),
  });

  const receipt = await wagmiConfigData.publicClient.waitForTransactionReceipt({
    hash: txHash.hash,
    confirmations: 2,
  });

  const profileId =
    getEventValues(receipt, RegistryABI, "ProfileCreated").profileId || "0x";

  if (profileId === "0x") {
    throw new Error("Profile creation failed");
  }

  return profileId;
};
