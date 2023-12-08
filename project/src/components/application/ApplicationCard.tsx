import { TNewApplicationResponse, TPoolData } from "@/app/types";
import {
  classNames,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import Link from "next/link";
import { useParams } from "next/navigation";
import Banner from "../shared/Banner";

export default function ApplicationCard(props: {
  pool: TPoolData;
  application: TNewApplicationResponse;
}) {
  const params = useParams();
  const application = props.application;
  const navLink = `/${params.chainId}/${
    params.poolId
  }/${application.recipientId.toLocaleLowerCase()}`;

  const pool = props.pool.pool;

  const amount = humanReadableAmount(
    application.requestedAmount === "0"
      ? props.pool.maxRequestedAmount
      : application.requestedAmount,
    pool.tokenMetadata.decimals || 18,
  );

  const token = pool.tokenMetadata.symbol ?? "ETH";
  const time = new Date(application.blockTimestamp).getTime() / 1000;

  return (
    <Link href={navLink}>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50">
        <Banner
          image={application.applicationBanner}
          alt={application.metadata!.name}
        />
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="text-sm font-medium leading-6 text-gray-900 py-3">
          {application.metadata!.name}
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Submitted On</dt>
          <dd className="text-gray-700">
            <time dateTime={application.blockTimestamp}>
              {prettyTimestamp(time)}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {amount} {token}
            </div>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Status</dt>
          <dd className="flex items-start gap-x-2">
            <div
              className={classNames(
                statusColorsScheme[application.status],
                "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset",
              )}
            >
              {application.status.toString()}
            </div>
          </dd>
        </div>
      </dl>
    </Link>
  );
}
