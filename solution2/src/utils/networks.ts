import { ICoreContracts, INetwork, IStrategyContracts, Slug, TNetworkData } from "@/types/types";

const coreContracts: ICoreContracts = {
  registryImplementation: {
    name: "Registry Implementation",
    address: "0xAEc621EC8D9dE4B524f4864791171045d6BBBe27",
  },
  registryProxy: {
    name: "Registry Proxy",
    address: "0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3",
  },
  alloImplementation: {
    name: "Allo Implementation",
    address: "0x8dde1922d5f772890f169714faceef9551791caf",
  },
  alloProxy: {
    name: "Allo Proxy",
    address: "0x79536CC062EE8FAFA7A19a5fa07783BD7F792206",
  },
};

const strategyContracts: IStrategyContracts = {
  donationVotingMerklePayoutVault: {
    name: "Donation Voting Merkle Vault Payout",
    address: "0x68d67bf72fcCf0E0f269C67b934b4050d2917F91",
  },
  donationVotingMerklePayoutDirect: {
    name: "Donation Voting Merkle Direct Payout",
    address: "0xD13ec67938B5E9Cb05A05D8e160daF02Ed5ea9C9",
  },
}

export const getNetworksBySlug = (slug: Slug): TNetworkData => {
  const networks = getNetworks();
  const network = Object.values(networks).find((network) => network.slug === slug);
  if (!network) {
    throw new Error(`Network ${slug} not found`);
  }
  return network; 
};
// goerli, optimism-goerli, sepolia, pgn-sepolia, celo-alfajores
export const getNetworks = (): INetwork => {
  return {
    [5]: {
      id: "5",
      slug: Slug.GOERLI,
      name: "Goerli",
      explorer: "https://goerli.etherscan.io/",
      coreContracts: coreContracts,
      strategyContracts: strategyContracts,
      symbol: "gETH",
    },
    [420]: {
      id: "420",
      slug: Slug.OPTIMISM_GOERLI,
      name: "Optimism Goerli",
      explorer: "https://goerli-optimism.etherscan.io/",
      coreContracts: coreContracts,
      strategyContracts: strategyContracts,
      symbol: "opETH",
    },
    [42069]: {
      id: "42069",
      slug: Slug.SEPOLIA,
      name: "Sepolia",
      explorer: "https://sepolia.etherscan.io/",
      coreContracts: coreContracts,
      strategyContracts: strategyContracts,
      symbol: "sETH",
    },
    [58008]: {
      id: "58008",
      slug: Slug.PGN_SEPOLIA,
      name: "PGN Sepolia",
      explorer: "https://explorer.sepolia.publicgoods.network/",
      coreContracts: coreContracts,
      strategyContracts: strategyContracts,
      symbol: "pgnETH",
    },
    [44787]: {
      id: "44787",
      slug: Slug.CELO_ALFAJORES,
      name: "Celo Alfajores",
      explorer: "https://explorer.celo.org/alfajores/",
      coreContracts: coreContracts,
      strategyContracts: strategyContracts,
      symbol: "CELO",
    },
  };
};
