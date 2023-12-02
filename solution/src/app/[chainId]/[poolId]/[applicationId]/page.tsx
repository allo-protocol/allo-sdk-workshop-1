import { TApplicationData, TApplicationMetadata } from "@/app/types";
import ApplicationDetail from "@/components/application/ApplicationDetail";
import Container from "@/components/shared/Container";
import { PoolContextProvider } from "@/context/PoolContext";
import { getIPFSClient } from "@/services/ipfs";
import { graphqlEndpoint, getMicroGrantRecipientQuery } from "@/utils/query";
import request from "graphql-request";

export default async function Application({
  params,
}: {
  params: { chainId: string; poolId: string; applicationId: string };
}) {
  let isError = false;
  let banner;

  const response: { microGrantRecipient: TApplicationData } = await request(
    graphqlEndpoint,
    getMicroGrantRecipientQuery,
    {
      chainId: params.chainId,
      poolId: params.poolId,
      recipientId: params.applicationId.toLocaleLowerCase(),
    },
  );

  const recipient = response.microGrantRecipient;
  const microGrant = recipient.microGrant;

  const ipfsClient = getIPFSClient();
  const DEFAULT_NAME = `Pool ${microGrant.poolId}`;
  const metadata: TApplicationMetadata = await ipfsClient.fetchJson(
    recipient.metadataPointer,
  );

  if (!metadata.name) metadata.name = DEFAULT_NAME;

  try {
    const bannerImage = await ipfsClient.fetchJson(metadata.base64Image);
    banner = bannerImage!.data ? bannerImage.data : "";
  } catch (error) {
    isError = true;
    console.error(error);
  }

  return (
    <Container>
      <PoolContextProvider chainId={params.chainId} poolId={params.poolId}>
        <ApplicationDetail
          application={recipient}
          metadata={metadata}
          bannerImage={banner}
          isError={isError}
        />
      </PoolContextProvider>
    </Container>
  );
}
