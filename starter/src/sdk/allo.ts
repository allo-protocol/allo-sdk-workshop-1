import { getIPFSClient } from "@/services/ipfs";
import { Allo } from "@allo-team/allo-v2-sdk";
import { deployMicrograntsStrategy } from "./microgrants";
import { createProfile } from "./registry";

export const allo = new Allo({ chain: 5 });

export const createPool = async () => {
  // Create a profile to use as the pool owner/creator
  const profileId = await createProfile();

  // Save metadata to IPFS
  const ipfsClient = getIPFSClient();

  const metadata = {
    profileId: profileId,
    name: "Allo Starter Kit",
    website: "https://allo.gitcoin.co",
    description: "A starter kit for Allo",
    // base64Image: "",
  };

  let pointer;
  let imagePointer;

  // if (metadata.base64Image && metadata.base64Image.includes("base64")) {
  //   imagePointer = await ipfsClient.pinJSON({
  //     data: metadata.base64Image,
  //   });
  //   metadata.base64Image = imagePointer;
  // }

  pointer = await ipfsClient.pinJSON(metadata);

  deployMicrograntsStrategy(pointer);

  // Create the pool
};
