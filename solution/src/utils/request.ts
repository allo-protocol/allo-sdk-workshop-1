"use server";

import {
  TApplicationData,
  TApplicationMetadata,
  TProfileResponse,
  TProfilesByOwnerResponse,
} from "@/app/types";
import {
  getMicroGrantRecipientQuery,
  getProfile,
  getProfilesByOwnerQuery,
  graphqlEndpoint,
} from "./query";
import request from "graphql-request";
import { getIPFSClient } from "@/services/ipfs";

const getProfilesByOwner = async ({
  chainId,
  account,
}: {
  chainId: string;
  account: string | `0x${string}`;
}): Promise<TProfilesByOwnerResponse[]> => {
  const response: {
    profilesByOwner: TProfilesByOwnerResponse[];
  } = await request(graphqlEndpoint, getProfilesByOwnerQuery, {
    chainId: chainId,
    owner: account,
  });

  // filter out old profiles that were created before the new registry where deployed
  const filteredProfiles = response.profilesByOwner.filter(
    (profile) =>
      new Date(profile.createdAt) > new Date("2023-11-02T00:00:00+00:00"),
  );
  return filteredProfiles;
};

export const getProfileById = async ({
  chainId,
  profileId,
}: {
  chainId: string;
  profileId: string;
}): Promise<TProfileResponse> => {
  const response: {
    profile: TProfileResponse;
  } = await request(graphqlEndpoint, getProfile, {
    chainId: chainId,
    profileId: profileId,
  });

  return response.profile;
};

export default getProfilesByOwner;

export const getApplicationData = async (
  chainId: string,
  poolId: string,
  applicationId: string,
): Promise<{
  application: TApplicationData;
  metadata: TApplicationMetadata;
  bannerImage: string;
}> => {
  try {
    let banner;

    const response: { microGrantRecipient: TApplicationData } = await request(
      graphqlEndpoint,
      getMicroGrantRecipientQuery,
      {
        chainId: chainId,
        poolId: poolId,
        recipientId: applicationId.toLocaleLowerCase(),
      },
    );

    const application = response.microGrantRecipient;

    const ipfsClient = getIPFSClient();
    const metadata: TApplicationMetadata = await ipfsClient.fetchJson(
      application.metadataPointer,
    );

    if (!metadata.name) metadata.name = `Pool ${application.microGrant.poolId}`;

    try {
      const bannerImage = await ipfsClient.fetchJson(metadata.base64Image);
      banner = bannerImage!.data ? bannerImage.data : "";
    } catch (error) {
      throw new Error("Error fetching banner image");
    }

    return {
      application: application,
      metadata: metadata,
      bannerImage: banner,
    };
  } catch (error) {
    throw new Error("Error fetching application data");
  }
};
