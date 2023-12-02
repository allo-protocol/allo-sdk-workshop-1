import { gql } from "graphql-request";

/** Endpont for graphql queries
 *  todo: make this configurable and move to .env
 */
export const graphqlEndpoint = process.env.GRAPHQL_URL || "";

/** Returns all the pools */
export const getPoolDataQuery = gql`
  {
    pools(orderBy: UPDATED_AT_DESC) {
      poolId
      chainId
      updatedAt
      strategy
      token
      amount
      profile {
        name
        owner
        metadataPointer
      }
    }
  }
`;

/** Returns pool information for a given network and pool ID */
export const getPoolDetailDataQuery = gql`
  query GetPoolDetails($chainId: String!, $poolId: String!) {
    pool(chainId: $chainId, poolId: $poolId) {
      poolId
      chainId
      createdAt
      updatedAt
      token
      amount
      strategy
      metadataProtocol
      metadataPointer
      tokenMetadata
      profile {
        profileId
        name
        owner
        anchor
        creator
      }
    }
  }
`;

/** Returns all of the profiles */
export const getProfileDataQuery = gql`
  {
    profiles(orderBy: UPDATED_AT_DESC) {
      profileId
      anchor
      name
      chainId
      creator
      createdAt
      updatedAt
    }
  }
`;

/** Function that finds all active role_account records for a given role */
export const getActiveProfileDataQuery = gql`
  query GetAllActiveProfiles {
    profiles(orderBy: UPDATED_AT_DESC) {
      profileId
      anchor
      name
      chainId
      creator
      createdAt
      updatedAt
      metadataPointer
      metadataProtocol
      nonce
      owner
      role {
        activeAccounts {
          accountId
        }
      }
    }
  }
`;

/** Returns the profile information for a given network and profile ID */
export const getProfileDetailDataQuery = gql`
  query getProfileDetails($chainId: String!, $profileId: String!) {
    profile(chainId: $chainId, profileId: $profileId) {
      pools {
        poolId
        chainId
        token
        amount
        strategy
        metadataProtocol
        metadataPointer
        tokenMetadata
        profile {
          profileId
          name
          owner
          anchor
          creator
        }
      }
      profileId
      anchor
      name
      chainId
      creator
      createdAt
      updatedAt
      metadataPointer
      metadataProtocol
      nonce
      owner
      role {
        roleAccounts {
          accountId
        }
      }
    }
  }
`;

/** Return Allo information for a given network */
export const getAlloStatsQuery = gql`
  query AlloStats($chainId: String!) {
    allo(chainId: $chainId) {
      registry
      feePercentage
      baseFee
      treasury
      cloneableStrategies
      updatedAt
    }
  }
`;

/** Return all Allo transactions */
export const getAlloTransactions = gql`
  query GetAlloTransactions {
    alloTransactions {
      hash
      fromAddress
      toAddress
      functionName
      functionArgs
      status
      blockHash
      blockNumber
      blockTimestamp
      chainId
    }
  }
`;

/** Return all Allo transactions by network */
export const getAlloTransactionsByChain = gql`
  query GetAlloTransactionsByChain($chainId: String!) {
    alloTransactions {
      hash
      fromAddress
      toAddress
      functionName
      functionArgs
      status
      blockHash
      blockNumber
      blockTimestamp
      chainId
    }
  }
`;

/** Function that finds all Allo transactions sent from a particular address (and network) */
export const getAlloTransactionsFromAddress = gql`
  query GetAlloTransactionsByAddress($chainId: String!, $address: String!) {
    alloTransactionsFrom(chainId: $chainId, fromAddress: $address) {
      hash
      fromAddress
      toAddress
      functionName
      functionArgs
      blockHash
      blockNumber
      blockTimestamp
    }
  }
`;

/** Function that finds all Allo transactions sent to a particular address (and network) */
export const getAlloTransactionsToAddress = gql`
  query GetAlloTransactionsByAddress($chainId: String!, $address: String!) {
    {
      alloTransactionsTo(
        chainId: $chainId
        toAddress: $address
      ) {
        hash
        fromAddress
        toAddress
        functionName
        functionArgs
        blockHash
        blockNumber
        blockTimestamp
      }
    }
  }
`;

/** Function that finds all Allo transactions sent to or from a particular address (and network) */
/** NOTE: The orderBy enum only has one so far */
export const getAlloTransactionsInvolved = gql`
  query GetAlloTransactionsInvolving($chainId: String!, $address: String!, $orderBy: [OrderBy!]!) {
    alloTransactionsInvolving(
      chainId: $chainId
      address: $address
      orderBy: [OrderBy.BLOCK_TIMESTAMP_DESC]
    ) {
      hash
      fromAddress
      toAddress
      functionName
      functionArgs
      blockHash
      blockNumber
      blockTimestamp
    }
  }
`;
