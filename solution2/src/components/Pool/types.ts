import { TProfile } from "../Registry/types";

export type TPool = {
  poolId: string;
  chainId: string;
  amount: number;
  metadataPointer: string;
  metadataProtocol: number;
  strategy: string;
  token: string;
};

export type TPoolDetail = TPool & {
  profile: TProfile;
  tokenMetadata: TTokenMetadata;
  updatedAt: string;
  createdAt: string;
};

export type TTokenMetadata = {
  name: string;
  symbol: string;
  decimals: number;
};

export interface IPoolsResponse {
  pools: TPoolDetail[];
}

export interface IPoolDetailResponse {
  pool: TPoolDetail;
}
