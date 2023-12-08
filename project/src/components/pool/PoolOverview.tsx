"use client";

import { TNewApplicationResponse, TPoolData, TPoolMetadata } from "@/app/types";
import { useContext, useEffect, useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import { classNames, getStrategyTypeFromStrategyName } from "@/utils/common";
import PoolDetail from "./PoolDetail";
import ApplicationList from "../application/ApplicationList";
import { PoolContext } from "@/context/PoolContext";
import PoolManagement from "./PoolManagement";
import Banner from "../shared/Banner";
// import AllocatedList from "../shared/AllocatedsList";

export default function PoolOverview(props: {
  chainId: string;
  poolId: string;
  pool: TPoolData;
  metadata: TPoolMetadata;
  poolBanner: string | undefined;
  applications: TNewApplicationResponse[];
}) {
  const { isPoolManager } = useContext(PoolContext);

  const [tabs, setTabs] = useState([
    { name: "Pool Details", current: true },
    { name: "Applications", current: false },
    // { name: "Reviews", current: false },
  ]);

  const breadcrumbs = [
    { id: 1, name: "Home", href: "/" },
    {
      id: 2,
      name: `Pool ${props.poolId}`,
      href: `/${props.chainId}/${props.poolId}`,
    },
  ];

  // select the current tab by name
  const onTabClick = (tabName: string) => {
    setTabs((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        current: tab.name === tabName,
      })),
    );
  };

  useEffect(() => {
    if (isPoolManager && getStrategyTypeFromStrategyName(props.pool.pool.strategyName) === "Manual") {
      setTabs([
        { name: "Pool Details", current: true },
        { name: "Applications", current: false },
        // { name: "Reviews", current: false },
        { name: "Manage Pool", current: false },
      ]);
    }
  }, [isPoolManager]);

  const currentTab = tabs.find((tab) => tab.current)?.name;

  return (
    <div className="bg-white">
      <div className="pt-6 w-full">
        <Breadcrumb breadcrumbs={breadcrumbs} />

        {/* Banner */}
        <div className="mx-auto mt-6 max-h-[20rem] sm:px-6 lg:grid lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <Banner image={props.poolBanner} alt={props.metadata.name} />
          </div>
        </div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={currentTab}
          >
            {tabs.map((tab) => (
              <option key={tab.name} onClick={() => onTabClick(tab.name)}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block px-8 pt-10">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <span
                  onClick={() => onTabClick(tab.name)}
                  key={tab.name}
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b-2 py-4 px-0.5 text-sm font-medium cursor-pointer",
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Pool info */}
        {currentTab === "Pool Details" && (
          <PoolDetail
            poolBanner={props.poolBanner}
            chainId={props.chainId}
            poolId={props.poolId}
            pool={props.pool}
            metadata={props.metadata}
          />
        )}
        {currentTab == "Applications" && (
          <ApplicationList
            pool={props.pool}
            applications={props.applications}
          />
        )}
        {/* {currentTab == "Reviews" && (
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-10">
            <div className="lg:col-span-2 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Application Reviews
              </h1>
              <AllocatedList
                allocateds={props.pool.allocateds}
                showApplication={true}
              />
            </div>
          </div>
        )} */}
        {currentTab == "Manage Pool" && <PoolManagement />}
      </div>
    </div>
  );
}
