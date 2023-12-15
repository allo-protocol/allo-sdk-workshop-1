import { getIPFSClient } from "@/services/ipfs";
import { Allo } from "@allo-team/allo-v2-sdk";
import { deployMicrograntsStrategy } from "./microgrants";
import { createProfile } from "./registry";

// create a new instance of Allo
// todo: snippet => createAlloInstance
export const allo = new Allo({ chain: 5 });

export const createPool = async () => {
  // Create a profile to use as the pool owner/creator
  // todo: you can add the profileId you generated intiially here so you don't have to create a new one each time.
  // const profileId =
  //   "0x5423910a320d04f3cfc2344ed527379a541b6b13682186ab7e4b896daa84511f";
  const profileId = await createProfile();

  // Save metadata to IPFS
  const ipfsClient = getIPFSClient();
  const metadata = {
    profileId: profileId,
    name: "Allo Starter Kit",
    website: "https://allo.gitcoin.co",
    description: "A starter kit for Allo",
    base64Image: "", // skipping the image for the demo
  };

  // NOTE: Use this to pin your base64 image to IPFS
  // let imagePointer;
  // if (metadata.base64Image && metadata.base64Image.includes("base64")) {
  //   imagePointer = await ipfsClient.pinJSON({
  //     data: metadata.base64Image,
  //   });
  //   metadata.base64Image = imagePointer;
  // }

  const pointer = await ipfsClient.pinJSON(metadata);
  console.log("Metadata saved to IPFS with pointer: ", pointer);

  // Deploy the microgrants strategy - `microgrants.ts`
  const poolId = await deployMicrograntsStrategy(pointer, profileId);
  console.log("Pool created with ID: ", poolId);

  return poolId;
};
