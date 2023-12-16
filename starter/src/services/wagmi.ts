"use client";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  arbitrum,
  base,
  celo,
  goerli,
  mainnet,
  optimism,
  polygon,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import dotenv from "dotenv";
dotenv.config();

const stagingChains = [
  // celoAlfajores,
  goerli,
  // sepolia,
  // polygonMumbai,
  // arbitrumGoerli,
];

const productionChains = [arbitrum, base, celo, mainnet, polygon, optimism];

const availableChains =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "dev"
    ? stagingChains
    : productionChains;

const { chains, publicClient } = configureChains(
  [...stagingChains],
  [
    alchemyProvider({
      apiKey: "ajWJk5YwtfTZ5vCAhMg8I8L61XFhyJpa",
    }),
    // Infura key here if you want to use it
    // infuraProvider({
    //   apiKey: "ae484befdd004b64bfe2059d3526a138",
    // }),
    // public provider for fallback
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Allo Starter Kit",
  projectId: "31b0b6255ee5cc68ae76cab5fa96a9a0",
  chains,
});

export const wagmiConfigData = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const chainData = chains;

export const getChain = (chainId: number) => {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
};
