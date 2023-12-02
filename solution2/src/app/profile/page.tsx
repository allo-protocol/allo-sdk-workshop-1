import { Loading } from "@/components/Loading";
import Profile from "@/components/Registry/Profile";
import { IProfileResponse } from "@/components/Registry/types";
import { getProfileDataQuery, graphqlEndpoint } from "@/utils/query";
import { request } from "graphql-request";
import { Suspense } from "react";

export default async function ProfileHome() {
  const response: IProfileResponse = await request(graphqlEndpoint, getProfileDataQuery);
  const { profiles } = response;

  return (
    <Suspense fallback={<Loading />}>
      <Profile data={profiles} />
    </Suspense>
  );
}
