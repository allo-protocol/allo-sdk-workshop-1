import { RegistryABI } from "@/abi/Registry";
import { wagmiConfigData } from "@/services/wagmi";
import { getEventValues } from "@/utils/common";
import { Registry } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { sendTransaction } from "@wagmi/core";

// create a registry instance
// todo: snippet => createRegistryInstance
export const registry = new Registry({ chain: 5 });

// NOTE: Update this function to use your own data.
export const createProfile = async () => {
  // prepare the arguments
  const createProfileArgs: CreateProfileArgs = {
    // random number to prevent nonce reuse, this is required.
    // NOTE: The profile ID id based on the provided nonce and the caller's address.
    nonce: Math.floor(Math.random() * 10000),
    name: "Allo Workshop",
    metadata: {
      protocol: BigInt(1),
      pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
    },
    members: [
      "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
    ],
    owner: "0x1fD06f088c720bA3b7a3634a8F021Fdd485DcA42",
  };

  console.log("Creating profile with args: ", createProfileArgs);

  // create the transaction with the arguments
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
