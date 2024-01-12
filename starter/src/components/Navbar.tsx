import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
      <Link
        href={"/"}
        className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
      >
        Allo Starter Kit
      </Link>
      {/* WIP Example */}
      <Link
        href={"/pool/new"}
        className="border border-white p-2 rounded-md hover:bg-gray-500 cursor-pointer mt-2"
      >
        Profile Form
      </Link>
      <div className="fixed bottom-0 left-0 flex flex-row h-48 w-full items-end justify-between bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <ConnectButton />
      </div>
    </div>
  );
}
