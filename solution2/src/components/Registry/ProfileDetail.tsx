"use client";

import { convertChainIdToNetworkName } from "@/utils/utils";
import { AddressResponsive, truncatedString } from "../Address";
import { TProfileDetail } from "./types";
import { MetadataProtocol } from "@/types/types";
import { TbExternalLink } from "react-icons/tb";
import JsonView from "@uiw/react-json-view";
import Link from "next/link";
import Pool from "../Pool/Pool";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ProfileDetail = ({
  profile,
  metadata,
}: {
  profile: TProfileDetail;
  metadata: string;
}) => {
  let metadataObj;
  try {
    metadataObj = JSON.parse(metadata ?? "");
  } catch (error) {
    metadataObj = {
      error: "Error parsing metadata",
    };
  }
  const isMobile = useMediaQuery(768);
  const py = isMobile ? "py-2" : "py-6";

  return (
    <div className="pb-10">
      <div className="flex flex-row items-center justify-between px-4 sm:px-0 my-10">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            {profile.name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 font-mono">
            {isMobile ? truncatedString(profile.profileId) : profile.profileId}
          </p>
        </div>
        <div>
          <Link href={`/profile/`}>
            <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Back
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Network
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {convertChainIdToNetworkName(profile.chainId)}
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Nonce
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {profile.nonce}
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Anchor
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <AddressResponsive
                address={profile.anchor}
                chainId={profile.chainId}
              />
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Creator
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <AddressResponsive
                address={profile.creator}
                chainId={profile.chainId}
              />
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Owner
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <AddressResponsive
                address={profile.owner}
                chainId={profile.chainId}
              />
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Members
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
              <ul role="list" className="">
                {profile.role.roleAccounts.map((account, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-4 text-sm leading-6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <div className="flex">
                        <span className="font-medium">
                          <AddressResponsive
                            address={account.accountId}
                            chainId={profile.chainId}
                          />
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Created at
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {new Date(profile.createdAt).toLocaleString()}
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Updated at
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {new Date(profile.updatedAt).toLocaleString()}
            </dd>
          </div>
          <div className={`px-4 ${py} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0`}>
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Metadata ({MetadataProtocol[profile.metadataProtocol]}){" "}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex flex-row items-center">
                {isMobile
                  ? truncatedString(profile.metadataPointer)
                  : profile.metadataPointer}
                <a
                  className="ml-2"
                  // data-tip="view on explorer"
                  target="_blank"
                  href={"https://ipfs.io/ipfs/" + profile.metadataPointer}
                >
                  <TbExternalLink />
                </a>
              </div>
            </dd>
          </div>
        </dl>
        <div className="pb-6">
          <JsonView
            value={metadataObj}
            shortenTextAfterLength={120}
            collapsed={2}
          />
        </div>
      </div>
      {profile.pools.length > 0 && (
        <>
          <div className="text-sm font-medium leading-6 text-gray-900">
            Pools
          </div>
          <Pool data={profile.pools} />
        </>
      )}
    </div>
  );
};

export default ProfileDetail;
