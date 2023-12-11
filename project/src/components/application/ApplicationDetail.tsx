"use client";

import {
  classNames,
  convertAddressToShortString,
  formatDateDifference,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import Breadcrumb from "../shared/Breadcrumb";
import NotificationToast from "../shared/NotificationToast";
import { TActivity, TApplicationData, TApplicationMetadata } from "@/app/types";
import { useContext, useState } from "react";
import { MarkdownView } from "../shared/Markdown";
import { PoolContext } from "@/context/PoolContext";
import Banner from "../shared/Banner";
import Modal from "../shared/Modal";
import { Allocation } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";
import {
  AddressResponsive,
  getAddressExplorerLink,
  getTxnExplorerLink,
} from "../shared/Address";
import Activity from "../shared/Activity";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function ApplicationDetail(props: {
  application: TApplicationData;
  metadata: TApplicationMetadata;
  bannerImage: string;
  isError?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAllocator, isPoolManager, steps, allocate } =
    useContext(PoolContext);
  const { address } = useAccount();
  const microGrantRecipient = props.application;
  const microGrant = microGrantRecipient.microGrant;
  const tokenMetadata = microGrant.pool.tokenMetadata;

  const amount = humanReadableAmount(
    microGrantRecipient.requestedAmount === "0"
      ? microGrant.maxRequestedAmount
      : microGrantRecipient.requestedAmount,
    tokenMetadata.decimals || 18,
  );

  const token = tokenMetadata.symbol ?? "ETH";

  const application = {
    name: props.metadata?.name,
    status: microGrantRecipient.status,
    amountRequested: `${amount} ${token}`,
    href: "#",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
      {
        id: 2,
        name: `Pool ${microGrant.poolId}`,
        href: `/${microGrant.chainId}/${microGrant.poolId}`,
      },
      { id: 3, name: props.metadata?.name, href: "#" },
    ],
    logo: {
      src: props.bannerImage,
      alt: props.metadata.name,
    },
    description: props.metadata.description,
    recipientId: microGrantRecipient.recipientId,
    recipientAddress: microGrantRecipient.recipientAddress,
  };

  const allocateds = microGrant.allocateds.filter(
    (allocated) =>
      allocated.recipientId === microGrantRecipient.recipientId.toLowerCase(),
  );

  const approvals = allocateds.filter(
    (allocation) => allocation.status === Status.Accepted.toString(),
  );

  const rejections = allocateds.filter(
    (allocation) => allocation.status === Status.Rejected.toString(),
  );

  const distributeds = microGrant.distributeds.filter(
    (distributed) =>
      distributed.recipientId === microGrantRecipient.recipientId.toLowerCase(),
  );

  const hasAllocated = allocateds.filter(
    (allocated) => allocated.sender.toLowerCase() === address?.toLowerCase(),
  ).length
    ? true
    : false;

  const generateActivity = () => {
    const activity: TActivity[] = [];

    const poolCreatedActivity: TActivity = {
      id: 1,
      status: "none",
      textBold: `Pool Id ${microGrant.poolId}`,
      href: getAddressExplorerLink(
        Number(microGrant.chainId),
        microGrant.pool.strategy,
      ),
      suffixText: `created`,
      date: formatDateDifference(microGrant.blockTimestamp),
      dateTime: prettyTimestamp(Number(microGrant.blockTimestamp)),
    };

    const applicationRegisteredActivity: TActivity = {
      id: 2,
      status: "none",
      textBold: convertAddressToShortString(microGrantRecipient.recipientId),
      href: `#`,
      suffixText: "Application Submitted",
      date: formatDateDifference(microGrantRecipient.blockTimestamp),
      dateTime: prettyTimestamp(Number(microGrantRecipient.blockTimestamp)),
    };

    activity.push(poolCreatedActivity, applicationRegisteredActivity);

    // allocation activity
    allocateds.forEach((allocated) => {
      const status = allocated.status === "2" ? "Approved" : "Rejected";
      const allocatedActivity: TActivity = {
        id: activity.length,
        status: status,
        textBold: convertAddressToShortString(allocated.sender),
        href: getTxnExplorerLink(
          Number(microGrant.chainId),
          allocated.transactionHash,
        ),
        suffixText: `${status} the application`,
        date: formatDateDifference(allocated.blockTimestamp),
        dateTime: prettyTimestamp(Number(allocated.blockTimestamp)),
      };
      activity.push(allocatedActivity);
    });

    // distribution activity
    distributeds.forEach((distributed) => {
      const distributedActivity: TActivity = {
        id: activity.length,
        status: "Completed",
        textBold: `${humanReadableAmount(
          distributed.amount,
          microGrant.pool.tokenMetadata.decimals || 18,
        )} ${token}`,
        href: getTxnExplorerLink(
          Number(microGrant.chainId),
          distributed.transactionHash,
        ),
        suffixText: `Distributed to ${convertAddressToShortString(
          microGrantRecipient.recipientAddress,
        )}`,
        date: formatDateDifference(distributed.blockTimestamp),
        dateTime: prettyTimestamp(Number(distributed.blockTimestamp)),
      };
      activity.push(distributedActivity);
    });

    return activity;
  };

  const overviews = [
    { description: "Amount", name: application.amountRequested },
    {
      description: "Allocation Period",
      name: `${prettyTimestamp(
        microGrant.allocationStartTime,
      )} - ${prettyTimestamp(microGrant.allocationEndTime)}`,
    },
    {
      description: "Approvals",
      name: approvals.length,
      color: "text-green-700",
    },
    {
      description: "Rejections",
      name: rejections.length,
      color: "text-red-700",
    },
  ];

  function ApplicationInfo() {
    return (
      <div className="lg:col-span-2 lg:pr-8">
        <div className="lg:col-span-2 mt-5">
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <div className="mt-6 pb-2 border-t border-b border-gray-100">
              <dl className="divide-gray-100">
                {/* Application ID */}
                <div className="px-4 pt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-xs font-medium leading-6 text-gray-900">
                    Application ID
                  </dt>
                  <dd className="mt-1 text-xs leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <AddressResponsive
                      address={application.recipientId}
                      chainId={Number(microGrant.chainId)}
                    />
                  </dd>
                </div>

                {/* Recipient Address */}
                <div className="px-4 pt-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-xs font-medium leading-6 text-gray-900">
                    Recipient Address
                  </dt>
                  <dd className="mt-1 text-xs leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <AddressResponsive
                      address={application.recipientAddress}
                      chainId={Number(microGrant.chainId)}
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ApplicationOverView() {
    return (
      <dl className="divide-y divide-gray-100">
        {/* Status */}
        <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Status
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 text-center sm:mt-0">
            <div
              className={classNames(
                statusColorsScheme[
                  application.status as keyof typeof statusColorsScheme
                ],
                "rounded-md py-1 px-2 text-sm font-medium ring-1 ring-inset",
              )}
            >
              {application.status.toString()}
            </div>
          </dd>
        </div>

        {overviews.map((overview, index) => (
          <div
            key={index}
            className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
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
    );
  }

  const onAllocate = async (bool: boolean) => {
    setIsOpen(true);
    const allocation: Allocation = {
      recipientId: microGrantRecipient.recipientId as `0x${string}`,
      status: bool ? Status.Accepted : Status.Rejected,
    };

    await allocate(allocation);

    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const isEditable = () => {
    const now = Math.floor(Date.now() / 1000);
    return (
      // todo: check if address is profile member or owner
      address?.toLowerCase() === props.application.sender.toLowerCase() &&
      Number(microGrant.allocationEndTime) > now && // upcoming or active pool
      !hasAllocated
    );
  };

  return (
    <div className="bg-white">
      {props.isError && (
        <NotificationToast
          success={false}
          title="Unable to fetch application"
        />
      )}

      <div>
        <header>
          <div className="flex flex-row">
            <Breadcrumb breadcrumbs={application.breadcrumbs} />
            <div className="ml-auto space-x-2 px-4 sm:px-6 lg:px-8">
              {/* todo: check if address is profile owner and if the application has NO reviews, pool is upcoming or active */}
              {isEditable() && (
                <Link
                  href={`/${microGrant.chainId}/${microGrant.poolId}/${application.recipientId}/edit`}
                >
                  Edit
                </Link>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="mx-auto mt-6 max-h-[20rem] sm:px-6 lg:grid lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <Banner image={application.logo.src} alt={application.logo.alt} />
            </div>
          </div>
        </header>
        {/* Application info */}
        <div>
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="-mx-4 px-4 py-8 sm:mx-0 border-r border-gray-100 lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <h2 className="text-xl font-semibold leading-6 text-gray-900">
                  {application.name}
                </h2>

                <ApplicationInfo />

                <div className="mt-5">
                  <h3 className="sr-only">Description</h3>
                  <MarkdownView text={application.description} />
                </div>
              </div>

              <div className="-mx-4 px-4 py-4 lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <div className="lg:col-start-3 mt-1">
                  <ApplicationOverView />
                  {isAllocator &&
                    application.status !== "Accepted" &&
                    !hasAllocated && (
                      <div className="mt-5 mb-5">
                        <button
                          onClick={() => onAllocate(true)}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onAllocate(false)}
                          className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                  <div className="pt-4 border-t border-gray-100">
                    <Activity activity={generateActivity()} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Progress Modal */}
          <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
        </div>
      </div>
    </div>
  );
}
