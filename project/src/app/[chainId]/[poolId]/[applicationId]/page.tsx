import ApplicationDetail from "@/components/application/ApplicationDetail";
import Container from "@/components/shared/Container";
import { PoolContextProvider } from "@/context/PoolContext";
import { getApplicationData } from "@/utils/request";

export default async function Application({
  params,
}: {
  params: { chainId: string; poolId: string; applicationId: string };
}) {
  const { application, metadata, bannerImage } = await getApplicationData(
    params.chainId,
    params.poolId,
    params.applicationId,
  );

  return (
    <Container>
      <PoolContextProvider chainId={params.chainId} poolId={params.poolId}>
        <ApplicationDetail
          application={application}
          metadata={metadata}
          bannerImage={bannerImage}
        />
      </PoolContextProvider>
    </Container>
  );
}
