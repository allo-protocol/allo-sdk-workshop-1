# Allo Protocol Workshop 1

Why am I learning this?

The Allo Protocol is a new way to build applications for funding and allocating
resources. It is a new way to build applications that are more fair, more
transparent, and more open.

[Slides](https://docs.google.com/presentation/d/19WZyHii1vaGM-M2AxqfXwuOHl-S9OUBT-dupK35ZcyI/edit?usp=sharing)

- **Table of Contents**
  - [Prerequisites](#prerequisites)
  - [Objectives](#objectives)
  - [Resources](#resources)

## Introduction [3 mins]

The Allo Protocol is a new way to build applications for funding and allocating
resources. It is a new way to build applications that are more fair, more
transparent, and more open.

- [3 mins] Slides: What is the Allo Protocol?

## Objectives

By the end of this, developers should be able to:

- [ ] Understand the essential parts of the Allo Protocol and how they work
      together with the Allo SDK
- [ ] Implement the Allo SDK to read and create a new Strategy(Pool) and Profile
- [ ] Start building a new application using the Allo SDK

## Prerequisites

- [ ] [Node.js](https://nodejs.org/en/download/)
- [ ] [Git](https://git-scm.com/downloads)
- [ ] [Yarn](https://yarnpkg.com/en/docs/install),
      [NPM](https://www.npmjs.com/get-npm),
      [PNPM](https://pnpm.js.org/en/installation), or
      [Bun](https://bun.sh/docs/installation)
- [ ] [Pináta](https://pinata.cloud) - create a free Pináta account

## Preparation [10 mins]

- [ ] Fork and clone
      [this](https://github.com/allo-protocol/allo-sdk-workshop-1.git)
      repository.

```bash
  # Clone the repository
  git clone https://github.com/allo-protocol/allo-sdk-workshop-1

  # Change into the directory
  cd allo-sdk-workshop-1/project

  # You should now be in the /solution directory

  # Checkout the start branch
  git checkout start
```

- [ ] Install dependencies with bun/yarn install.

```bash
  # Install dependencies
  bun install

  # For NPM specifically you need to use this command
  npm install --legacy-peer-deps
```

- [ ] Setup `.env` values
```bash
  # General
  NEXT_PUBLIC_ENVIRONMENT="dev"

  # IPFS
  NEXT_PUBLIC_PINATA_JWT=###
  NEXT_PUBLIC_IPFS_READ_GATEWAY=###
  NEXT_PUBLIC_IPFS_WRITE_GATEWAY=###

  # PROVIDER - these are shared keys and may be throttled
  INFURA_ID=ae484befdd004b64bfe2059d3526a138
  ALCHEMY_ID=ajWJk5YwtfTZ5vCAhMg8I8L61XFhyJpa
  PROJECT_ID=31b0b6255ee5cc68ae76cab5fa96a9a0

  # DATABASE
  # NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5555/graphql
  NEXT_PUBLIC_GRAPHQL_URL=https://alloscan.spec.dev/graphql
```

## Demo [7 mins]

- [7 mins] Demo SeaGrants to show how we set up a grant strategy and application
  using the Allo SDK

## Code Along [30 mins]

1. [15-20 mins] Create a new Strategy(Pool), Create a new Pool & Profile (A
   profile is required to create a pool on Allo)

- Code-along: `NewPoolContext.tsx`

To create a new Allo instance, you need to provide the chain information. In
this example, we're using the 5 (Goerli) chain information (see supported chains
[here](https://github.com/allo-protocol/allo-v2/blob/main/contracts/README.md)).

```javascript
// Importy Allo from SDK
import { Allo } from "@allo-team/allo-v2-sdk/";

// Create a new Allo instance
const allo = new Allo({ chain: 5 });
```

To create a new Registry instance, you need to provide the chain information. In
this example, we're using the 5 (Goerli) chain information (see supported chains
[here](https://github.com/allo-protocol/allo-v2/blob/main/contracts/README.md)).

```javascript
// Importy Registry from SDK
import { Registry } from "@allo-team/allo-v2-sdk/";

// Create a new Registry instance
const registry = new Registry({ chain: 5 });
```

To create a new profile using the `createProfile` function:

```javascript
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

// Prepare the transaction arguments
const createProfileArgs: CreateProfileArgs = {
  nonce: 3,
  name: "Developer",
  metadata: {
    protocol: BigInt(1),
    pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
  },
  owner: "0xE7eB5D2b5b188777df902e89c54570E7Ef4F59CE",
  members: [
    "0x5cdb35fADB8262A3f88863254c870c2e6A848CcA",
    "0xE7eB5D2b5b188777df902e89c54570E7Ef4F59CE",
  ],
};

// Create the transaction with the arguments
const txData: TransactionData = registry.createProfile(createProfileArgs);

// Client could be from ethers, viem, etc..
const hash = await client.sendTransaction({
  data: txData.data,
  account,
  value: BigInt(txData.value),
});

console.log(`Transaction hash: ${hash}`);
```

To start interacting with the MicroGrants contract, create a new instance of
`MicroGrantsStrategy`:

```javascript
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

const strategy = new MicroGrantsStrategy({
  chain: 5,
});
```

If you are aware of the poolId, you can load that while creating the instance

```javascript
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

const strategy = new MicroGrantsStrategy({
  chain: 5,
  poolId: 1, // valid pool Id
});
```

### Get the strategy deploy parameters

```javascript
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

const strategyType = StrategyType.Gov; // Specify the strategy type
const deployParams = strategy.getDeployParams(strategyType);

// Client could be from ethers, viem, etc.
const hash = await walletClient!.deployContract({
  abi: deployParams.abi,
  bytecode: deployParams.bytecode as `0x${string}`,
  args: [],
});
```

### Get the initialize data

```javascript
if (data.strategyType === StrategyType.MicroGrants) {
  initStrategyData = await strategy.getInitializeData(initParams);
} else if (data.strategyType === StrategyType.Hats) {
  initStrategyData = await strategy.getInitializeDataHats(initParams);
} else if (data.strategyType === StrategyType.Gov) {
  initStrategyData = await strategy.getInitializeDataGov(initParams);
} else {
  throw new Error("Invalid strategy type");
}
```

### Create the pool transaction

To create a new pool:

```typescript
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

const createPoolArgs: CreatePoolArgs = {
  profileId: "your_profileId_here", // sender must be a profile member
  strategy: "approved_strategy_contract", // approved strategy contract
  initStrategyData: initStrategyData, // unique to the strategy
  token: "token_address_here",
  amount: "pool_amount_here",
  metadata: {
    protocol: BigInt(1),
    pointer: "your_ipfs_hash",
  },
  managers: ["pool_manager_address"],
};

const txData: TransactionData = allo.createPool(createPoolArgs);

// Client could be from ethers, viem, etc.
const hash = await client.sendTransaction({
  data: txData.data,
  to: txData.to,
  value: BigInt(txData.value),
});

console.log(`Transaction hash: ${hash}`);
```

1. [10 mins] Create a new application

- Code-along: `ApplicationContext.tsx`

To create a new Registry instance, you need to provide the chain information. In
this example, we're using the 5 (Goerli) chain information (see supported chains
[here](https://github.com/allo-protocol/allo-v2/blob/main/contracts/README.md)).

```javascript
// Importy Registry from SDK
import { Registry } from "@allo-team/allo-v2-sdk/";

// Create a new Registry instance
const registry = new Registry({ chain: 5 });
```

To create a new profile using the `createProfile` function:

```javascript
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

// Prepare the transaction arguments
const createProfileArgs: CreateProfileArgs = {
  nonce: 3,
  name: "Developer",
  metadata: {
    protocol: BigInt(1),
    pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
  },
  owner: "0xE7eB5D2b5b188777df902e89c54570E7Ef4F59CE",
  members: [
    "0x5cdb35fADB8262A3f88863254c870c2e6A848CcA",
    "0xE7eB5D2b5b188777df902e89c54570E7Ef4F59CE",
  ],
};

// Create the transaction with the arguments
const txData: TransactionData = registry.createProfile(createProfileArgs);

// Client could be from ethers, viem, etc..
const hash = await client.sendTransaction({
  data: txData.data,
  account,
  value: BigInt(txData.value),
});

console.log(`Transaction hash: ${hash}`);
```

To start interacting with the MicroGrants contract, create a new instance of
`MicroGrantsStrategy`:

```javascript
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

const strategy = new MicroGrantsStrategy({
  chain: 5,
});
```

If you are aware of the poolId, you can load that while creating the instance

```javascript
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

const strategy = new MicroGrantsStrategy({
  chain: 5,
  poolId: 1, // valid pool Id
});
```

```javascript
const registerRecipientData = strategy.getRegisterRecipientData({
      registryAnchor: anchorAddress as `0x${string}`,
      recipientAddress: data.recipientAddress as `0x${string}`,
      requestedAmount: data.requestedAmount,
      metadata: {
        protocol: BigInt(1),
        pointer: pointer.IpfsHash,
      },
    });
```

1. [5 mins] Run the application locally

## Wrap up [5 mins]

todo:

## Resources

- [Allo Protocol](https://github.com/allo-protocol/allo-v2/blob/main/README.md) -
  This is the main repository for the Allo Protocol smart contracts.
- [Allo SDK](https://github.com/allo-protocol/allo-v2-sdk) - This is the main
  repository for the Allo SDK.
- [Allo Scan](https://github.com/allo-protocol/allo-scan) - Our first
  application built on the Allo Protocol, a block explorer showing all the
  transactions on the Allo Protocol with some basic features.
- [Sea Grants](https://github.com/allo-protocol/SeaGrants) - Our second
  application built on the Allo Protocol, a micro-grant style application and
  funding platform using user defined strategies.
- [Spec](https://github.com/allo-protocol/allo-v2-spec) - Our indexing service
  for the Allo Protocol that allows us to query the blockchain for data using
  GraphQL.
- [GraphQL Playground](https://alloscan.spec.dev/graphiql) - A GraphQL
  playground for the Allo Protocol built on top of Spec.
