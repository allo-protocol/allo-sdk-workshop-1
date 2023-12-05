import { AbiComponent, AbiItem, ContractAbi, EPoolStatus } from "@/app/types";
import {
  TransactionReceipt,
  decodeAbiParameters,
  decodeEventLog,
  formatUnits,
  keccak256,
  parseAbiParameters,
  stringToBytes,
} from "viem";
import { graphqlEndpoint } from "./query";
import request from "graphql-request";
import { getIPFSClient } from "@/services/ipfs";
import { parse } from "path";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const statusColorsScheme = {
  Accepted: "text-green-700 bg-green-50 ring-green-600-20",
  Active: "text-green-700 bg-green-50 ring-green-600-20",

  Upcoming: "text-blue-700 bg-blue-50 ring-blue-600-20",
  Paid: "text-blue-700 bg-blue-50 ring-blue-600-20",

  Pending: "text-yellow-600 bg-yellow-50 ring-yellow-600-20",
  Rejected: "text-red-700 bg-red-50 ring-red-600/10",

  Ended: "text-gray-600 bg-gray-50 ring-gray-500-10",
  Undefined: "text-gray-600 bg-gray-50 ring-gray-500-10",
};

export function stringToColor(text: string) {
  let str = text;
  let hash = 0;
  for (let i = 0; i < str.length / 2; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = Math.floor(200 + ((Math.abs(Math.sin(hash + 0)) * 56) % 56));
  const g = Math.floor(200 + ((Math.abs(Math.sin(hash + 1)) * 56) % 56));
  const b = Math.floor(200 + ((Math.abs(Math.sin(hash + 2)) * 56) % 56));

  // modulo function on str.length to choose between aa, bb, cc, dd
  const append = ["88", "aa", "66", "99"][str.length % 4];
  return `#${toTwoDigits(r)}${toTwoDigits(g)}${toTwoDigits(b)}${append}`;
}

function toTwoDigits(value: number) {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function humanReadableAmount(amount: string, decimals?: number) {
  const amountInUnits = Number(formatUnits(BigInt(amount), decimals || 18));

  for (let i = 5; i <= 15; i++) {
    const formattedValue = amountInUnits.toFixed(i);
    if (Number(formattedValue) !== 0) {
      return formattedValue.replace(/\.?0+$/, ""); // Remove trailing zeros
    }
  }
  return 0;
}

export function isPoolActive(
  allocationStartTime: number,
  allocationEndTime: number,
) {
  const now = Date.now() / 1000;
  return now >= allocationStartTime && now <= allocationEndTime;
}

export const prettyTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  return `${date.toLocaleDateString()}`;
};

export const ethereumAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
export const ethereumHashRegExp = /^(0x)?[0-9a-fA-F]{64}$/;

export const getPoolStatus = (
  startDate: number,
  endDate: number,
): EPoolStatus => {
  const now = new Date().getTime() / 1000;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (now < start) {
    return EPoolStatus.UPCOMING;
  } else if (now > end) {
    return EPoolStatus.ENDED;
  } else {
    return EPoolStatus.ACTIVE;
  }
};

export const pollUntilMetadataIsAvailable = async (
  pointer: string,
): Promise<boolean> => {
  const ipfsClient = getIPFSClient();
  let counter = 0;

  const fetchMetadata: any = async () => {
    const metadata = await ipfsClient.fetchJson(pointer);

    console.log("metadata", metadata);
    console.log("counter", counter);
    if (metadata) {
      console.log("metadata true");
      return true;
    } else {
      console.log("metadata false");
      counter++;
      if (counter > 20) return false;
      // Corrected: Return the result of the recursive call
      return await new Promise((resolve) => setTimeout(resolve, 2000)).then(
        fetchMetadata,
      );
    }
  };
  return await fetchMetadata();
};

export const pollUntilDataIsIndexed = async (
  QUERY_ENDPOINT: any,
  data: any,
  propToCheck: string,
): Promise<boolean> => {
  let counter = 0;
  const fetchData: any = async () => {
    const response: any = request(graphqlEndpoint, QUERY_ENDPOINT, data);

    if (response && response[propToCheck] !== null) {
      // Data is found, return true
      return true;
    } else {
      counter++;

      if (counter > 20) return false;

      // If the data is not indexed, schedule the next fetch after 2 seconds
      return await new Promise((resolve) => setTimeout(resolve, 2000)).then(
        fetchData,
      );
    }
  };

  // Initial fetch
  return await fetchData();
};

export const convertBytesToShortString = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const convertAddressToShortString = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const copy = (data: string) => {
  navigator.clipboard.writeText(data);
};

export const formatDateDifference = (dateString: string): string => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);
  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (secondsDifference < 60) {
    return "now";
  } else if (minutesDifference < 60) {
    return `${minutesDifference}m ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference}h ago`;
  } else {
    return `${daysDifference}d ago`;
  }
};

export const NATIVE =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase();

export const getStrategyTypeFromStrategyName = (
  strategyName: string,
): string => {
  if (strategyName === "allov2.MicroGrantsStrategy") return "Manual";
  if (strategyName === "allov2.MicroGrantsGovStrategy") return "Governance";
  if (strategyName === "allov2.MicroGrantsHatsStrategy") return "Hats";

  return "N/A";
};

export const extractLogByEventName = (logs: any[], eventName: string) => {
  return logs.find((log) => log.eventName === eventName);
};

export const getEventValues = (
  receipt: TransactionReceipt,
  abi: ContractAbi,
  eventName: string,
): any => {
  const { logs } = receipt;
  const event = abi.filter(
    (item) => item.type === "event" && item.name === eventName,
  )[0];

  console.log("event", event);

  const eventTopic = getEventTopic(event);

  const log = logs.find(
    (log) => log.topics[0]?.toLowerCase() === eventTopic.toLowerCase(),
  );

  const { topics, data } = log as { topics: string[]; data: string };

  const d = decodeEventLog({
    abi: [event as any],
    data: data as `0x${string}`,
    topics: topics as any,
  });

  return d.args;
};

function getEventTopic(event: AbiItem): string {
  const inputTypesString = getInputTypeString(event);
  const eventString = `${event.name}(${inputTypesString})`;
  const eventTopic = keccak256(stringToBytes(eventString));

  return eventTopic;
}

function getInputTypeString(event: AbiItem): string {
  const inputTypes = event.inputs ? flattenInputTypes(event.inputs) : [];
  return inputTypes.join(",");
}

function flattenInputTypes(
  inputs: Array<{
    name: string;
    type: string;
    components?: Array<AbiComponent>;
  }>,
): string[] {
  const result: string[] = [];

  for (const input of inputs) {
    if (input.components) {
      const componentsString = flattenInputTypes(input.components).join(",");

      result.push(`(${componentsString})`);
    } else {
      result.push(input.type);
    }
  }

  return result;
}
