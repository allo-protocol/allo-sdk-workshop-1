"use server";

import { TProfileResponse, TProfilesByOwnerResponse } from "@/app/types";
import request from "graphql-request";
import { getProfile, getProfilesByOwnerQuery, graphqlEndpoint } from "./query";

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

  // filter out old profiles that were created before the new registry was deployed
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
