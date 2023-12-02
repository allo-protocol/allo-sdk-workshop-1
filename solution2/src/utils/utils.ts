import { getNetworks } from "./networks";
import { ethers } from "ethers";

const networks = getNetworks();

export const convertChainIdToNetworkName = (chainId: number) => {
  return `${networks[chainId]?.name} (${chainId})`;
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatAmount(amount: number, decimals: number) {
  return ethers.formatUnits(amount, decimals);
}

export function truncatePoolName(name: string) {
  return name.length > 10 ? `${name.slice(0, 10)}...` : name;
}

export function truncateTimestamp(timestamp: string) {
  return timestamp.slice(0, 10);
}

export const convertBytesToShortString = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};


export const convertAddressToShortString = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const copy = (data: string) => {
  navigator.clipboard.writeText(data);
};