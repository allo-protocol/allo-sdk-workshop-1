import { TNewApplication, TPoolMetadata } from "@/app/types";
import dotenv from "dotenv";
dotenv.config();

type CommonConfig = {
  chainId: number;
  poolId: number;
  nonce: number;
  rpc: string;
  ownerProfileId: `0x${string}`;
  ownerAddress: `0x${string}`;
  anchorAddress: `0x${string}`;
  profileName: string;
  managers: `0x${string}`[];
  application: TNewApplication;
  recipientId: `0x${string}`;
  metadata: {
    protocol: bigint;
    pointer: string;
  };
  members: `0x${string}`[];
  pool: TPoolMetadata;
};

// NOTE: Update this with your own base64 image
export const base64Image = ``;

export const commonConfig: CommonConfig = {
  chainId: 421614,
  poolId: 216,
  nonce: Math.floor(Math.random() * 10000),
  rpc: process.env.NEXT_PUBLIC_RPC_URL as string, // arbitrum-sepolia
  ownerProfileId:
    "0x9abfca304ae55abc43a50e846e80fbe0bc01ee6abdb6cf5c218f6ade517590c0",
  ownerAddress: "0x8C180840fcBb90CE8464B4eCd12ab0f840c6647C",
  anchorAddress: "0xbd35e5f5ec336eef6946314e668ed95aed4552ac",
  profileName: "Allo Workshop",
  managers: [],
  application: {
    requestedAmount: BigInt(1e13),
    recipientAddress: "0x8C180840fcBb90CE8464B4eCd12ab0f840c6647C",
    profileId:
      "0x13ffe09671f07a4eb6bfcf96fa58d93bedabf721d26d0cc162f267504816f3db",
    name: "Test Application",
    website: "https://docs.allo.gitcoin.co",
    profileName: "Jax Test",
    email: "test@gitcoin.co",
    description: "This is a test application",
    base64Image: base64Image,
  },
  metadata: {
    protocol: BigInt(1), // NOTE: This is the pointer to the metadata on IPFS
    pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
  },
  recipientId: "0xbd35e5f5ec336eef6946314e668ed95aed4552ac",
  members: [],
  pool: {
    profileId:
      "0x9abfca304ae55abc43a50e846e80fbe0bc01ee6abdb6cf5c218f6ade517590c0",
    name: "Allo Starter Kit Pool",
    description: "A pool for developers to test the Allo SDK",
    website: "https://allo.gitcoin.co",
    base64Image: base64Image,
  },
};
