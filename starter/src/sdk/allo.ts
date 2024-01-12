import { base64Image, commonConfig } from "@/config/common";
import { getIPFSClient } from "@/services/ipfs";
import { Allo } from "@allo-team/allo-v2-sdk";
import { deployMicrograntsStrategy } from "./microgrants";

// create an allo instance
// snippet => createAlloInstance
export const allo = new Allo({
  chain: commonConfig.chainId,
  rpc: commonConfig.rpc,
});

/**
 * create a pool with the microgrants strategy
 * @returns the pool ID
 */
export const createPool = async () => {
  // Note: You can add the profileId you generated intiially to the `/commonConfig.ts` so you don't
  // have to create a new one each time.
  // const profileId = await createProfile();

  // Save metadata to IPFS -> returns a pointer we save on chain for the metadata
  const ipfsClient = getIPFSClient();
  const metadata = {
    profileId: commonConfig.ownerProfileId,
    name: commonConfig.pool.name,
    website: commonConfig.pool.website,
    description: commonConfig.pool.description,
    base64Image: base64Image,
  };

  // NOTE: Use this to pin your base64 image to IPFS
  let imagePointer;
  if (metadata.base64Image && metadata.base64Image.includes("base64")) {
    imagePointer = await ipfsClient.pinJSON({
      data: metadata.base64Image,
    });
    metadata.base64Image = imagePointer;
  }

  const pointer = await ipfsClient.pinJSON(metadata);
  console.log("Metadata saved to IPFS with pointer: ", pointer);

  // Deploy the microgrants strategy - `microgrants.ts`
  const poolId = await deployMicrograntsStrategy(
    pointer,
    commonConfig.ownerProfileId
  );
  console.log("Pool created with ID: ", poolId);

  return poolId;
};
