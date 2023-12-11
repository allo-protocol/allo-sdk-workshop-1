import { EPoolStatus, TPoolData, TPoolMetadata } from "@/app/types";
import {
  classNames,
  getPoolStatus,
  getStrategyTypeFromStrategyName,
  humanReadableAmount,
  statusColorsScheme,
} from "@/utils/common";
import { MarkdownView } from "../shared/Markdown";
import Link from "next/link";
import { useContext } from "react";
import { PoolContext } from "@/context/PoolContext";
import { AlloProfile } from "../shared/Address";

export const PoolDetail = (props: {
  chainId: string;
  poolId: string;
  pool: TPoolData;
  metadata: TPoolMetadata;
  poolBanner: string | undefined;
}) => {
  const { isLoaded, isRecipient } = useContext(PoolContext);
  const getStatusPill = (status: EPoolStatus) => {
    return (
      <div
        className={classNames(
          statusColorsScheme[status],
          "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset",
        )}
      >
        {" "}
        {status}
      </div>
    );
  };

  const status: EPoolStatus = getPoolStatus(
    props.pool.allocationStartTime,
    props.pool.allocationEndTime,
  );

  const tokenMetadata = props.pool.pool.tokenMetadata;
  const overviews = [
    {
      description: "Strategy Type",
      name: getStrategyTypeFromStrategyName(props.pool.pool.strategyName),
    },
    {
      description: "Website",
      name: (
        <a href={props.metadata.website} target="_blank">
          {props.metadata.website}
        </a>
      ),
    },
    {
      description: "Profile Id",
      name: (
        <AlloProfile
          id={props.metadata.profileId}
          chainId={Number(props.pool.chainId)}
        />
      ),
    },
    {
      description: "Pool Amount",
      name: `${humanReadableAmount(
        props.pool.pool.amount,
        tokenMetadata.decimals,
      )} ${tokenMetadata.symbol ?? "ETH"}`,
    },
    {
      description: "Max Allocation",
      name: `${humanReadableAmount(
        props.pool.maxRequestedAmount,
        tokenMetadata.decimals,
      )} ${tokenMetadata.symbol ?? "ETH"}`,
    },
    {
      description: "Start Date",
      name: new Date(props.pool.allocationStartTime * 1000).toLocaleString(),
    },
    {
      description: "End Date",
      name: new Date(props.pool.allocationEndTime * 1000).toLocaleString(),
    },
    {
      description: "Threshold",
      name: `${props.pool.approvalThreshold} Approval(s)`,
    },
    {
      description: "Applications",
      name: props.pool.microGrantRecipients.length || 0,
      color: "text-green-700",
    },
    {
      description: "Profile Required",
      name: props.pool.useRegistryAnchor ? "Yes" : "No",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl pb-16 pt-10 md:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-10">
      <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {props.metadata.name}
        </h1>
      </div>

      {/* Overview */}
      <div className="mt-4 lg:row-span-3 lg:mt-0">
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Status
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 text-center sm:mt-0">
                {getStatusPill(status)}
              </dd>
            </div>

            {overviews.map((overview, index) => (
              <div
                key={index}
                className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0"
              >
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  {overview.description}
                </dt>
                <dd
                  className={classNames(
                    overview.color ? overview.color : "",
                    "mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0",
                  )}
                >
                  {overview.name}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Link
          href={
            status == "Active" ? `/${props.chainId}/${props.poolId}/new` : ""
          }
        >
          <button
            disabled={status !== "Active" || !isLoaded || isRecipient}
            type="submit"
            className={`mt-10 flex w-full items-center justify-center rounded-md border border-transparent disabled:cursor-not-allowed ${
              status === "Active" && !isRecipient
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-100 text-white hover:bg-indigo-200"
            } px-8 py-3 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            Apply
          </button>
        </Link>
      </div>

      <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
        {/* Description and details */}
        <div>
          <h3 className="sr-only">Description</h3>
          <div>
            <MarkdownView text={props.metadata.description} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolDetail;
