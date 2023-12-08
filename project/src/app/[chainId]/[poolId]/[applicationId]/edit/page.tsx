import { TPoolData } from "@/app/types";
import ApplicationForm from "@/components/application/ApplicationForm";
import Container from "@/components/shared/Container";
import { ApplicationContextProvider } from "@/context/ApplicationContext";
import { getMicroGrantQuery, graphqlEndpoint } from "@/utils/query";
import request from "graphql-request";

export default async function EditApplication({
  params,
}: {
  params: { chainId: string; poolId: string; applicationId: string };
}) {
  const response: { microGrant: TPoolData } = await request(
    graphqlEndpoint,
    getMicroGrantQuery,
    {
      chainId: params.chainId,
      poolId: params.poolId,
    },
  );

  const microGrant = response.microGrant;

  return (
    <Container>
      <ApplicationContextProvider>
        <ApplicationForm microGrant={microGrant} />
      </ApplicationContextProvider>
    </Container>
  );
}
