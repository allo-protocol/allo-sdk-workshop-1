import { TNewApplicationResponse, TPoolData, TPoolMetadata } from "@/app/types";
import PoolOverview from "@/components/pool/PoolOverview";
import Container from "@/components/shared/Container";
import { PoolContextProvider } from "@/context/PoolContext";
import { getIPFSClient } from "@/services/ipfs";
import { graphqlEndpoint, getMicroGrantsRecipientsQuery } from "@/utils/query";
import request from "graphql-request";
import { Suspense } from "react";

export default async function Pool({
  params,
}: {
  params: { chainId: string; poolId: string };
}) {
  try {
    // TODO: MAKE SURE POOL ID IS VALID
    // NOTE: Not sure how to handle this other than creating a middleware.ts file, we can't
    // make this a client component because it needs to use the async data fetching.
    const response: any = await request(
      graphqlEndpoint,
      getMicroGrantsRecipientsQuery,
      { chainId: params.chainId, poolId: params.poolId },
    );

    const pool: TPoolData = response.microGrant;

    const poolMetadata: TPoolMetadata = await getIPFSClient().fetchJson(
      pool.pool.metadataPointer,
    );

    let poolBanner = undefined;

    if (poolMetadata.base64Image) {
      poolBanner = await getIPFSClient().fetchJson(poolMetadata.base64Image);
      if (poolBanner!.data) {
        poolBanner = poolBanner.data;
      }
    }

    let applications: TNewApplicationResponse[] = [];

    for (let i = 0; i < pool.microGrantRecipients.length; i++) {
      const application = pool.microGrantRecipients[i];
      if (application.metadataPointer !== "") {
        const metadata = await getIPFSClient().fetchJson(
          application.metadataPointer,
        );
        application.metadata = metadata;
        if (metadata.base64Image) {
          const image = await getIPFSClient().fetchJson(metadata.base64Image);
          application.applicationBanner = image.data;
        }
      }
      applications.push(application);
    }

    return (
      <Container>
        <PoolContextProvider chainId={params.chainId} poolId={params.poolId}>
          <PoolOverview
            applications={applications}
            poolBanner={poolBanner}
            chainId={params.chainId}
            poolId={params.poolId}
            pool={pool}
            metadata={poolMetadata}
          />
        </PoolContextProvider>
      </Container>
    );
  } catch (e) {
    console.log(e);
    return (
      <Container>
        <div>Pool not found</div>
      </Container>
    );
  }
}
