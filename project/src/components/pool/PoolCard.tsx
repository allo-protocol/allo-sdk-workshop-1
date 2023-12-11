"use client";
import { EPoolStatus, TPoolData } from "@/app/types";
import {
  classNames,
  getPoolStatus,
  getStrategyTypeFromStrategyName,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import Link from "next/link";
import Banner from "../shared/Banner";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";

const PoolCard = ({ pool }: { pool: TPoolData }) => {
  const containerRef = useRef(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const poolDetail = pool.pool;
  const metadata = poolDetail.metadata;

  const poolStatus: EPoolStatus = getPoolStatus(
    pool.allocationStartTime,
    pool.allocationEndTime,
  );

  const tokenMetadata = poolDetail.tokenMetadata;
  const amount = humanReadableAmount(poolDetail.amount, tokenMetadata.decimals);
  const maxRequestedAmount = humanReadableAmount(
    pool.maxRequestedAmount,
    tokenMetadata.decimals,
  );

  useEffect(() => {
    if (containerRef.current) {
      const _ref = containerRef.current as unknown as {
        scrollHeight: number;
        clientHeight: number;
      };
      const isOverflowing = _ref.scrollHeight > _ref.clientHeight;
      setIsTextOverflowing(isOverflowing);
    }
  }, [metadata.description]);

  return (
    <Link href={`/${pool.chainId}/${pool.poolId}`}>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50">
        <Banner image={poolDetail.poolBanner} alt={metadata.name} minHeight="6rem"/>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-6 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">
            {" "}
            <div className="font-semibold leading-6 text-gray-900">
              {metadata!.name}
            </div>
          </dt>
          <div className="flex justify-between gap-x-4">
            <dd className="text-gray-500">
              <div
                className={classNames(
                  statusColorsScheme[poolStatus],
                  "flex rounded-md py-1 px-3 text-xs font-medium ring-1 ring-inset",
                )}
              >
                {poolStatus.toString()}
              </div>
            </dd>
          </div>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Pool Amount
          </dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 text-gray-500">
            {amount} {tokenMetadata.symbol ?? "ETH"}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Max Allocation: 
          </dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 text-gray-500">
            {maxRequestedAmount} {tokenMetadata.symbol ?? "ETH"}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Period
          </dt>

          <dd className="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">
            <time dateTime={pool.allocationStartTime.toString()}>
              {prettyTimestamp(pool.allocationStartTime)}
            </time>
            <span className="mx-1">-</span>
            <time dateTime={pool.allocationEndTime.toString()}>
              {prettyTimestamp(pool.allocationEndTime)}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Strategy Type
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">
            {getStrategyTypeFromStrategyName(pool.pool.strategyName)}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3 text-gray-500">
          <div
            ref={containerRef}
            className={`text-gray-500 line-clamp-4 ${
              isTextOverflowing && "overflow-hidden"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[gfm]}
              components={{
                img: ({ node, ...props }) => null, // Skip rendering images
              }}
            >
              {metadata.description}
            </ReactMarkdown>
          </div>
        </div>
      </dl>
    </Link>
  );
};

export default PoolCard;
