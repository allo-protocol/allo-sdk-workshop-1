"use client";

import { getNetworks, getNetworksBySlug } from "@/utils/networks";
import { INetwork, Slug, TNetworkData } from "@/types/types";
    import { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { NetworkContext } from "@/Context/NetworkContext";
import { classNames } from "@/utils/utils";

const SelectNetwork = (props: {}) => {
  const networks: INetwork = getNetworks();
  const { network, setNetwork } = useContext(NetworkContext);
  const flatNetworks: TNetworkData[] = Object.values(networks);

  return (
    <div className="flex flex-row-reverse">
      <Menu as="div" className="relative inline-block text-left w-52">
        <div>
          <Menu.Button className="flex items-center justify-between w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <span>{getNetworksBySlug(network).name}</span>
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {flatNetworks.map((n) => (
                <Menu.Item key={n.slug}>
                  {({ active }) => (
                    <div
                      onClick={() => setNetwork(n.slug)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm",
                      )}
                    >
                      {n.name}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SelectNetwork;
