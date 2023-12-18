import { getIPFSClient } from "@/services/ipfs";
import { Allo } from "@allo-team/allo-v2-sdk";
import { deployMicrograntsStrategy } from "./microgrants";
// import { createProfile } from "./registry";

export const allo = new Allo({
  chain: 421614,
  rpc: "https://sepolia-rollup.arbitrum.io/rpc",
});

export const createPool = async () => {
  // Create a profile to use as the pool owner/creator
  const profileId =
    "0x93457ead47c0699099938b14a01a9de0d80f3b49bcee1806898abdf74d4a6cc6";
  // const profileId = await createProfile();

  // Save metadata to IPFS
  const ipfsClient = getIPFSClient();
  const metadata = {
    profileId: profileId,
    name: "Allo Starter Kit",
    website: "https://allo.gitcoin.co",
    description: "A starter kit for Allo",
    base64Image: "",
  };

  let imagePointer;
  if (metadata.base64Image && metadata.base64Image.includes("base64")) {
    imagePointer = await ipfsClient.pinJSON({
      data: metadata.base64Image,
    });
    metadata.base64Image = imagePointer;
  }

  const pointer = await ipfsClient.pinJSON(metadata);
  console.log("Metadata saved to IPFS with pointer: ", pointer);

  const poolId = await deployMicrograntsStrategy(pointer, profileId);
  console.log("Pool created with ID: ", poolId);

  return poolId;
};
