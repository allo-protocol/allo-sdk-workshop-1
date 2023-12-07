import PoolList from "@/components/pool/PoolList";
import { getActiveMicroGrantsQuery, getEndedMicroGrantsQuery, getUpcomingMicroGrantsQuery, graphqlEndpoint } from "@/utils/query";
import request from "graphql-request";
import { TPoolData, TPoolMetadata } from "@/app/types";
import { getIPFSClient } from "@/services/ipfs";
import logo from "./assets/logo.svg";
import Image from "next/image";

enum TPoolType {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  ENDED = "ended",
}

export default async function Home() {
  const ipfsClient = getIPFSClient();

  const getPools = async (type: TPoolType) => {
    let pools: TPoolData[] = [];

    let graphqlQuery;
    let responseObject;

    if (type === TPoolType.UPCOMING) {
      graphqlQuery = getUpcomingMicroGrantsQuery;
      responseObject = "upcomingMicroGrants";
    } else if (type === TPoolType.ACTIVE) {
      graphqlQuery = getActiveMicroGrantsQuery;
      responseObject = "activeMicroGrants";
    } else if (type === TPoolType.ENDED) {
      graphqlQuery = getEndedMicroGrantsQuery;
      responseObject = "endedMicroGrants";
    } else {
      return pools;
    }

    try {
      const response: any = await request(
        graphqlEndpoint,
        graphqlQuery,
        {
          first: 10,
          offset: 0
        }
      );
      pools = response[responseObject];
      for (const pool of pools) {
        let metadata: TPoolMetadata;
        try {
          metadata = await ipfsClient.fetchJson(pool.pool.metadataPointer);
          pool.pool.metadata = metadata;
          if (metadata.base64Image) {
            let poolBanner = await ipfsClient.fetchJson(metadata.base64Image);
            pool.pool.poolBanner = poolBanner.data;
          }
          if (!metadata.name) {
            metadata.name = `Pool ${pool.poolId}`;
          }
        } catch {
          console.log("IPFS", "Unable to fetch metadata");
        }
      }
    } catch (e) {
      console.log(e);
    }
    return pools;
  }

  const upcomingPools = await getPools(TPoolType.UPCOMING);

  const activePools = await getPools(TPoolType.ACTIVE);
  
  const endedPools = await getPools(TPoolType.ENDED);

  return (
    <main>
      <div className="mx-auto max-w-2xl py-4 sm:py-32">
        <Image
          src="https://tailwindui.com/img/beams-basic.png"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          width={100}
          height={100}
        />
        <div className="text-center">
          <Image
            className="mx-auto mb-3"
            src={logo}
            alt="Sea Grants"
            width={128}
          />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="text-sky-400">Sea</span>
            <span className="text-sky-600">Grants</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Micro-grant programs, common in web3 communities like Gitcoin, Celo,
            and ENS to engage members and empower project contributions aligned
            with their mission, often present challenges in accessibility.
          </p>
        </div>
      </div>
      <PoolList
        pools={upcomingPools}
        title={"Upcoming Pools"}
        flyoutOptions={{
          useFlyout: true,
          startIndex: 2,
          label: `Show all upcoming pools (${upcomingPools.length})`,
        }}
      />
      <PoolList
        pools={activePools}
        title={"Active Pools"}
        flyoutOptions={{
          useFlyout: true,
          startIndex: 2,
          label: `Show all active pools (${
            activePools.length > 2 ? activePools.length - 2 : activePools.length
          })`,
        }}
      />
      <PoolList
        pools={endedPools}
        title={"Ended Pools"}
        flyoutOptions={{
          useFlyout: true,
          startIndex: 0,
          label: `Show all ended pools (${endedPools.length})`,
        }}
      />
    </main>
  );
}
