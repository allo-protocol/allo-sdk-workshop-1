import { TPoolDetail } from "../Pool/types";

export type TProfile = {
  profileId: string;
  anchor: string;
  name: string;
  chainId: number;
  creator: string;
  owner: string;
};

export type TProfileDetail = TProfile & {
  createdAt: string;
  updatedAt: string;
  pools: TPoolDetail[];
  metadataPointer: string;
  metadataProtocol: number;
  nonce: number;
  owner: string;
  role: {
    roleAccounts: {
      accountId: string;
    }[];
  };
};

export interface IProfileResponse {
  profiles: TProfileDetail[];
}

export interface IProfileDetailResponse {
  profile: TProfileDetail;
}
