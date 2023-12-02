"use client";
import logo from "@/assets/logo.svg";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center">
                  <Image
                    priority
                    src={logo}
                    alt="AlloScan"
                    height={25}
                    width={25}
                  />
                  <Link href="/">
                    <p className="text-2xl font-semibold text-gray-900 ml-2">
                      AlloScan
                    </p>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:ml-6 lg:flex items-center">
                {/* Links on the left */}
                <div className="hidden lg:ml-6 lg:flex">
                  <Link
                    href="/profile"
                    className="inline-flex items-center border-b-2 border-transparent active:border-green-800 px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-800 hover:text-gray-700"
                  >
                    Profiles
                  </Link>
                  <span className="mx-3"></span>
                  <Link
                    href="/pool"
                    className="inline-flex items-center border-b-2 border-transparent active:bottom-0 active:border-green-800 px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-800 hover:text-gray-700"
                  >
                    Pools
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center ml-auto">
                {/* Contracts link on the right */}
                <Link
                  href="/contracts"
                  className="inline-flex items-center border-b-2 border-transparent active:border-green-800 px-1 pt-1 text-sm font-medium text-gray-500 hover:border-green-800 hover:text-gray-700"
                >
                  Contracts
                </Link>
              </div>
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
              >
                Home
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/contracts"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                Contracts
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/profile"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                Profiles
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/pool"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                Pools
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
