"use client";

import { Fragment } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "../../app/assets/logo.svg";
import { useParams } from "next/navigation";
import { NewApplicationIcon, NewPoolIcon } from "./Icons";
import { useAccount, useNetwork } from "wagmi";
import Link from "next/link";

export default function Navbar() {
  const params = useParams();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const chainId = params["chainId"];
  const poolId = params["poolId"];

  const creations = [
    {
      name: "New Application",
      description: "Register / Update your application",
      href: `/${chainId}/${poolId}/new`,
      icon: NewApplicationIcon,
      show: chainId && poolId,
    },
    {
      name: "New Pool",
      description: "Create your own pool",
      href: `/${chainId || chain?.id}/new`,
      icon: NewPoolIcon,
      show: isConnected,
    },
  ];

  return (
    <Disclosure
      as="nav"
      className="bg-transparent backdrop-filter bg-white bg-opacity-30 w-full z"
    >
      {({ open }: { open: boolean }) => (
        <nav>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div
                  className="flex flex-shrink-0 items-center cursor-pointer"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  <Image
                    className="h-10 w-auto"
                    src={logo}
                    alt="Allo"
                    height={32}
                    width={32}
                  />
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl py-4 px-2">
                    <span className="text-sky-400">Sea</span>
                    <span className="text-sky-600">Grants</span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center">
                {isConnected && (
                  <div className="top-16 w-auto max-w-sm">
                    <Popover className="relative">
                      {({ open }) => (
                        <>
                          <Popover.Button
                            className={`
                                ${open ? "text-black" : "text-black/90"}
                                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                          >
                            Create
                            <ChevronDownIcon
                              className={`${
                                open ? "text-black-300" : "text-black-300/70"
                              }
                                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-black-300/80`}
                              aria-hidden="true"
                            />
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm transform px-4 sm:px-0 lg:max-w-1xl">
                              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="relative grid gap-8 bg-white p-7">
                                  {creations
                                    .filter((item) => item.show)
                                    .map((item) => (
                                      <Link
                                        key={item.name}
                                        href={item.href}
                                        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-black-500/50"
                                      >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                          <item.icon aria-hidden="true" />
                                        </div>
                                        <div className="ml-4">
                                          <p className="text-sm font-medium text-gray-900">
                                            {item.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {item.description}
                                          </p>
                                        </div>
                                      </Link>
                                    ))}
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </div>
                )}

                <div className="flex-shrink-0">
                  <ConnectButton
                    label="Connect"
                    accountStatus="address"
                    chainStatus="icon"
                    showBalance={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </Disclosure>
  );
}
