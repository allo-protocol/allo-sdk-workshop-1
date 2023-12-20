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

General knowlege of NEXT.js, React, and TypeScript is required. We use NEXT.js v14.0.1, React v18 and TypeScript v5.

Outline of project:

```
- /allo-sdk-workshop-1
  - /src
    - /abi
    - /app
    - /components
      - /Home.tsx
    - /sdk
      - allo.ts
      - microgrants.ts
      - registry.ts
    - /services
    - /utils
```

- [ ] [Node.js](https://nodejs.org/en/download/)
- [ ] [Git](https://git-scm.com/downloads)
- [ ] [Yarn](https://yarnpkg.com/en/docs/install),
      [NPM](https://www.npmjs.com/get-npm),
      [PNPM](https://pnpm.js.org/en/installation), or
      [Bun](https://bun.sh/docs/installation)
- [ ] [Pináta](https://pinata.cloud) - create a free Pináta account

> We use pináta to pin our metadata to IPFS. You can use any IPFS pinning service you like.

## Demo [7 mins]

- Demo SeaGrants to show how we set up a grant strategy and application using
  the Allo SDK

## What we'll build
<img width="1029" alt="Screenshot 2023-12-16 at 11 44 06 AM" src="https://github.com/allo-protocol/allo-sdk-workshop-1/assets/9419140/36a1d7d5-95fa-44b6-9099-5073d78c77b9">

## Preparation [10 mins]

- You can fork first before you clone the repository [here](https://github.com/codenamejason/allo-sdk-workshop-1/fork)

- [1 min] Clone & Checkout `start` branch of
  [this](https://github.com/allo-protocol/allo-sdk-workshop-1.git) repository.

```bash
  # Clone the repository
  git clone https://github.com/allo-protocol/allo-sdk-workshop-1

  # Change into the directory
  cd allo-sdk-workshop-1

  # Checkout the start branch
  git checkout start

  cd starter
  # You should now be in the /starter directory
```

- [3 mins] Install dependencies with bun/yarn install.

```bash
  # Install dependencies
  bun install

  # or
  yarn install

  # or
  pnpm install

  # For NPM specifically you need to use this command
  npm install --legacy-peer-deps
```

And to add the Allo SDK we run:

```bash
  bun install @allo-team/allo-v2-sdk

  # or
  yarn install @allo-team/allo-v2-sdk

  # or
  pnpm install @allo-team/allo-v2-sdk

  # For NPM specifically you need to use this command
  npm install @allo-team/allo-v2-sdk --legacy-peer-deps
```

- [5 mins] Setup `.env` values

## Code Along [30 mins]

1. [15-20 mins] Create a new Strategy(Pool), Create a new Pool & Profile (A
   profile is required to create a pool on Allo)

- Code-along: `allo.ts`, `registry.ts` & `microgrants.ts`

To create a new Allo instance, you need to provide the chain information. In
this example, we're using the 5 (Goerli) chain information (see supported chains
[here](https://github.com/allo-protocol/allo-v2/blob/main/contracts/README.md)).

In `allo.ts`:
```javascript
// Importy Allo from SDK
import { Allo } from "@allo-team/allo-v2-sdk/";

// Create a new Allo instance
export const allo = new Allo({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
});
```

To create a new Registry instance, you need to provide the chain information. In
this example, we're using the 5 (Goerli) chain information (see supported chains
[here](https://github.com/allo-protocol/allo-v2/blob/main/contracts/README.md)).

In `registry.ts`:
```javascript
// Importy Registry from SDK
import { Registry } from "@allo-team/allo-v2-sdk/";

// Create a new Registry instance
export const registry = new Registry({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
});
```

To create a new profile using the `createProfile` function:
```javascript
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

// Prepare the transaction arguments
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
    "0x add your wallet address here along with any other managers you want to add",
  ],
  owner: "0x add your wallet address here",
};

// Create the transaction with the arguments
const txData: TransactionData = await registry.createProfile(createProfileArgs);

// Client could be from ethers, viem, etc..
const hash = await client.sendTransaction({
  data: txData.data,
  account,
  value: BigInt(txData.value),
});

console.log(`Transaction hash: ${hash}`);
```

Let's run the app here and create a new profile. You can see the transaction result in the console and alert.
<img width="1159" alt="Screenshot 2023-12-16 at 11 52 34 AM" src="https://github.com/allo-protocol/allo-sdk-workshop-1/assets/9419140/44fc7f3e-d1ee-4d0e-bbb0-49d6a1388de4">

To start interacting with the MicroGrants contract, create a new instance of
MicroGrantsStrategy in `microgrants.ts`:

```javascript
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

export const strategy = new MicroGrantsStrategy({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
});
```

📝 If you are aware of the poolId, you can load that while creating the instance

```javascript
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

export const strategy = new MicroGrantsStrategy({
  chain: 421614,
  rpc: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
  poolId: 1, // a valid pool ID
});

```

### Get the strategy deploy parameters

In `microgrants.ts`:
```javascript
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

// Specify the strategy type - MicroGrants for default/demo purposes
const strategyType = StrategyType.MicroGrants; 
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
initStrategyData = await strategy.getInitializeData(initParams);
```

### Create the pool transaction

In `microgrants.ts` create a new pool:

```typescript
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

const poolCreationData: CreatePoolArgs = {
  profileId: profileId, // sender must be a profile member
  strategy: strategyAddress, // approved strategy contract
  initStrategyData: initStrategyData, // unique to the strategy
  token: NATIVE, // you need to change this to your token address
  amount: BigInt(1e14),
  metadata: {
    protocol: BigInt(1),
    pointer: pointer.IpfsHash,
  },
  managers: ["0x your wallet address here"],
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

### Register a recipient
- Code-along: `microgrants.ts`
```javascript
const registerRecipientData = strategy.getRegisterRecipientData({
  registryAnchor: anchorAddress as `0x${string}`,
  recipientAddress: "0x your wallet address", // data.recipientAddress as `0x${string}`,
  requestedAmount: BigInt(1e13), // data.requestedAmount,
  metadata: {
    protocol: BigInt(1),
    pointer: pointer.IpfsHash,
  },
});
```

1. [5 mins] Run the application locally

## Wrap up [5 mins]

- [5 mins] Q&A

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

- [Allo Governance Test Token Goerli](https://goerli.etherscan.io/address/0xc55ac684bcB96E2a3aCcE1f1F1300dD32Cd8bA06)
