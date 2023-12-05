"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { TApplicationData, TApplicationMetadata } from "@/app/types";
import { getApplicationData } from "@/utils/request";

// Define types for the context
type TApplications = Record<
  string,
  Record<
    string,
    Record<
      string,
      {
        application: TApplicationData;
        metadata: TApplicationMetadata;
        bannerImage: string;
      }
    >
  >
>;

interface ApplicationDetailContextProps {
  applications: TApplications;
  getApplication: (
    chainId: string,
    poolId: string,
    applicationId: string,
  ) => Promise<{
    application: TApplicationData;
    metadata: TApplicationMetadata;
    bannerImage: string;
  }>;
  refetchApplication: (
    chainId: string,
    poolId: string,
    applicationId: string,
  ) => Promise<{
    application: TApplicationData;
    metadata: TApplicationMetadata;
    bannerImage: string;
  }>;
}

// Create the context
const ApplicationDetailContext = createContext<
  ApplicationDetailContextProps | undefined
>(undefined);

// Create a provider component
export const ApplicationDetailContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [applications, setApplications] = useState<TApplications>({});

  const getApplication = useCallback(
    async (chainId: string, poolId: string, applicationId: string) => {
      // Check if application data is already in the state
      if (applications[chainId]?.[poolId]?.[applicationId]) {
        return applications[chainId][poolId][applicationId];
      }

      console.log("=====> fetch application: ", chainId, poolId, applicationId);

      try {
        // Fetch application data
        const data = await getApplicationData(chainId, poolId, applicationId);

        // Update the state
        setApplications((prev) => ({
          ...prev,
          [chainId]: {
            ...prev[chainId],
            [poolId]: {
              ...prev[chainId]?.[poolId],
              [applicationId]: data,
            },
          },
        }));

        return data;
      } catch (error) {
        throw new Error("Error fetching application data");
      }
    },
    [applications],
  );

  const refetchApplication = useCallback(
    async (chainId: string, poolId: string, applicationId: string) => {
      // Fetch and update application data without caching
      try {
        const data = await getApplicationData(chainId, poolId, applicationId);

        // Update the state without caching
        setApplications((prev) => ({
          ...prev,
          [chainId]: {
            ...prev[chainId],
            [poolId]: {
              ...prev[chainId]?.[poolId],
              [applicationId]: data,
            },
          },
        }));

        return data;
      } catch (error) {
        throw new Error("Error refetching application data");
      }
    },
    [],
  );

  return (
    <ApplicationDetailContext.Provider
      value={{ applications, getApplication, refetchApplication }}
    >
      {props.children}
    </ApplicationDetailContext.Provider>
  );
};

// Create a custom hook for using the context
export const useApplicationDetailContext = () => {
  const context = useContext(ApplicationDetailContext);
  if (!context) {
    throw new Error(
      "useApplicationDetailContext must be used within an ApplicationDetailContextProvider",
    );
  }
  return context;
};

// Create a custom hook for directly accessing application data
export const useApplication = (
  chainId: string,
  poolId: string,
  applicationId: string,
) => {
  const { getApplication } = useApplicationDetailContext();

  const [application, setApplication] = useState<{
    application: TApplicationData | undefined;
    metadata: TApplicationMetadata | undefined;
    bannerImage: string;
  }>({
    application: undefined,
    metadata: undefined,
    bannerImage: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const applicationData = await getApplication(
        chainId,
        poolId,
        applicationId,
      );
      setApplication(applicationData);
      setIsLoading(false);
    };

    fetch();
  }, []);

  return { ...application, isLoading };
};
