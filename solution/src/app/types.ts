import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";

export type TStrategyType = keyof typeof StrategyType;

type ApplicationStatus = "Accepted" | "Rejected" | "Pending" | "Paid";

export type TApplication = {
  id: number;
  name: string;
  description?: string;
  status: ApplicationStatus;
  base64Image: string;
  recipientAddress: `0x${string}`;
  amountRequested: string;
};

export interface IApplication extends TApplication {
  profileOwner: `0x${string}`;
  nonce: number;
  createdAt: string;
  updatedAt?: string;
}

export type TPool = {
  id: number;
  name: string;
  chainId: number;
  dates: {
    start: string;
    end: string;
  };
  strategy: `0x${string}`; // address of the strategy contract
  amount: number;
  tokenSymbol: string;
  active: boolean;
};

export type TProfile = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  requestedAmount: string;
  metadataPointer: string;
  isUsingRegistryAnchor: boolean;
  status: string;
};

export type TApplicationMetadata = {
  name: string;
  website: string;
  description: string;
  email: string;
  base64Image: string;
};

export type TNewApplication = TApplicationMetadata & {
  requestedAmount: bigint;
  recipientAddress: `0x${string}`;
  profileId?: `0x${string}`;
  profileName?: string;
};

export type TNewApplicationResponse = {
  blockTimestamp: string;
  isUsingRegistryAnchor: boolean;
  metadataPointer: string;
  recipientAddress: `0x${string}`;
  recipientId: `0x${string}`;
  requestedAmount: string;
  status: ApplicationStatus;
  metadata?: TApplicationMetadata;
  applicationBanner?: string;
};

export type TPoolMetadata = {
  profileId: `0x${string}`;
  name: string;
  website: string;
  description: string;
  base64Image?: string;
};

export type TMicroGrantRecipient = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  requestedAmount: string;
  metadataPointer: string;
  blockTimestamp: string;
  isUsingRegistryAnchor: boolean;
  status: ApplicationStatus;
  metadata?: any;
  applicationBanner?: string;
};

export type TNewPool = TPoolMetadata & {
  // chain info
  tokenAddress: `0x${string}`;
  fundPoolAmount: string;
  maxAmount: string;
  managers: `0x${string}`[];
  startDate: string;
  endDate: string;
  approvalThreshold: number;
  useRegistryAnchor: boolean;
  profileName?: string;
  strategyType: TStrategyType;
  // Hat
  hatId?: number;
  // Gov
  gov?: string;
  minVotePower?: string;
  snapshotReference?: string;
};

export type TNewPoolResponse = {
  address: `0x${string}`;
  poolId: number;
};

export type TPoolData = {
  poolId: string;
  chainId: string;
  strategy: string;
  allocationStartTime: number;
  allocationEndTime: number;
  approvalThreshold: number;
  maxRequestedAmount: string;
  blockTimestamp: string;
  useRegistryAnchor: boolean;
  pool: {
    strategy: string;
    strategyName: string;
    tokenMetadata: {
      name?: string;
      symbol?: string;
      decimals?: number;
    };
    token: `0x${string}`;
    amount: string;
    metadataPointer: string;
    poolBanner: string;
    metadata: TPoolMetadata;
    profile: {
      profileId: `0x${string}`;
      name: string;
    };
  };
  allocateds: TAllocatedData[];
  distributeds: TDistributedData[];
  microGrantRecipients: TMicroGrantRecipient[];
  strategyType: TStrategyType;
  // Hat
  hatId?: number;
  // Gov
  gov?: string;
  minVotePower?: string;
  snapshotReference?: string;
};

export type TApplicationData = {
  microGrant: {
    chainId: string;
    poolId: string;
    allocationStartTime: number;
    allocationEndTime: number;
    maxRequestedAmount: string;
    blockTimestamp: string;
    pool: {
      strategy: string;
      tokenMetadata: {
        name?: string;
        symbol?: string;
        decimals?: number;
      };
      token: `0x${string}`;
      amount: string;
    };
    allocateds: TAllocatedData[];
    distributeds: TDistributedData[];
  };
  sender: string;
  recipientId: string;
  recipientAddress: string;
  requestedAmount: string;
  metadataPointer: string;
  blockTimestamp: string;
  isUsingRegistryAnchor: boolean;
  status: string;
};

export type TAllocatedData = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  sender: `0x${string}`;
  contractAddress: `0x${string}`;
  contractName: string;
  chainId: string;
  blockTimestamp: string;
  status: string;
  transactionHash: string;
};

export type TDistributedData = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  sender: `0x${string}`;
  contractAddress: `0x${string}`;
  contractName: string;
  chainId: string;
  amount: string;
  blockTimestamp: string;
  transactionHash: string;
};

// Progress Modal

export enum ETarget {
  NONE = "None",
  IPFS = "IPFS",
  CHAIN = "Blockchain",
  SPEC = "Spec",
  POOL = "Pool",
  ALLO = "Allo",
}

export enum EProgressStatus {
  IS_SUCCESS = "IS_SUCCESS",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  IS_ERROR = "IS_ERROR",
}

export type TProgressStep = {
  id?: string;
  content: string;
  target?: string;
  href?: string;
  status: EProgressStatus;
};

export enum EPoolStatus {
  UPCOMING = "Upcoming",
  ACTIVE = "Active",
  ENDED = "Ended",
}

export type TActivity = {
  id: number;
  status: string;
  prefixText?: string;
  textBold?: string;
  href?: string;
  suffixText?: string;
  date: string;
  dateTime: string;
};

export type TFlyoutOptions = {
  useFlyout: boolean;
  label: string;
  startIndex: number;
};

export type TProfilesByOwnerResponse = {
  profileId: string;
  name: string;
  owner: string;
  createdAt: string;
  anchor: string;
};

export type TProfileResponse = {
  profileId: string;
  nonce: number;
  name: string;
  metadataPointer: string;
  owner: string;
  anchor: string;
  creator: string;
  createdAt: string;
};

export type AbiComponent = {
  name: string;
  type: string;
  internalType?: string;
  components?: Array<AbiComponent>;
};

export type AbiItem = {
  type: string; // 'function', 'event', 'constructor', etc.
  name?: string; // Function or event name
  anonymous?: boolean; // true if the function is anonymous
  inputs?: Array<{
    name: string;
    type: string;
    internalType?: string;
    indexed?: boolean;
    components?: Array<AbiComponent>;
  }>; // Function or event parameters
  outputs?: Array<{
    name: string;
    type: string;
    internalType?: string;
    components?: Array<{
      internalType?: string;
      name?: string;
      type?: string;
      components?: Array<{
        internalType?: string;
        name?: string;
        type?: string;
      }>;
    }>;
  }>; // Function outputs
  stateMutability?: "pure" | "view" | "nonpayable" | "payable"; // Function state mutability
};

export type ContractAbi = Array<AbiItem>;
