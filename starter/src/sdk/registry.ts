import { RegistryABI } from "@/abi/Registry";
import { commonConfig } from "@/config/common";
import { wagmiConfigData } from "@/services/wagmi";
import { getEventValues } from "@/utils/common";
import { Registry } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { sendTransaction } from "@wagmi/core";

// create a registry instance
// todo: snippet => createRegistryInstance
export const registry = new Registry({
  chain: commonConfig.chainId,
  rpc: commonConfig.rpc,
});

// NOTE: Update this function to use your own data.
export const createProfile = async () => {
  // prepare the arguments -> type comes from the SDK
  const createProfileArgs: CreateProfileArgs = {
    nonce: commonConfig.nonce,
    name: commonConfig.profileName,
    metadata: commonConfig.metadata,
    owner: commonConfig.ownerAddress,
    members: commonConfig.members,
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
