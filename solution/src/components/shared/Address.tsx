import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getChain } from "@/services/wagmi";
import {
  convertAddressToShortString,
  convertBytesToShortString,
  copy,
} from "@/utils/common";
import { TbCopy, TbExternalLink } from "react-icons/tb";

export const Hash = (props: { hash: string; chainId: number }) => {
  const explorerLink =
    getChain(props.chainId).blockExplorers.default.url + "/tx/" + props.hash;

  return (
    <div className="flex items-center">
      <div className="text-xs font-medium text-gray-900 font-mono">
        {convertBytesToShortString(props.hash)}
      </div>
      <div
        onClick={() => copy(props.hash)}
        className="flex-shrink-0 h-5 w-5 mt-1.5 ml-1 cursor-pointer"
      >
        <TbCopy />
      </div>
      <div>
        <a target="_blank" href={explorerLink}>
          <TbExternalLink />
        </a>
      </div>
    </div>
  );
};

export const AlloProfileFull = (props: { id: string; chainId: number }) => {

  return (
    <div className="flex items-center">
      <div className="text-xs font-medium text-gray-900 font-mono">
        {props.id}
      </div>
      <div
        onClick={() => copy(props.id)}
        className="flex-shrink-0 h-5 w-5 mt-1.5 ml-1 cursor-pointer"
      >
        <TbCopy />
      </div>
      <div>
        <a target="_blank" href={getAddressExplorerLink(props.chainId, props.id)}>
          <TbExternalLink />
        </a>
      </div>
    </div>
  );
};

export const AlloProfile = (props: { id: string; chainId: number }) => {

  return (
    <div className="flex items-center">
      <div className="text-xs font-medium text-gray-900 font-mono">
        {convertAddressToShortString(props.id)}
      </div>
      <div
        onClick={() => copy(props.id)}
        className="flex-shrink-0 h-5 w-5 mt-1.5 ml-1 cursor-pointer"
      >
        <TbCopy />
      </div>
      <div>
        <a target="_blank" href={getAddressExplorerLink(props.chainId, props.id)}>
          <TbExternalLink />
        </a>
      </div>
    </div>
  );
};

export const AlloProfileResponsive = (props: {
  id: string;
  chainId: number;
}) => {
  const isMobile = useMediaQuery(1240);

  if (isMobile) return <AlloProfile id={props.id} chainId={props.chainId} />;

  return <AlloProfileFull id={props.id} chainId={props.chainId} />;
};

export const Address = (props: { address: string; chainId: number }) => {
  const explorerLink =
    getChain(props.chainId).blockExplorers.default.url +
    "/address/" +
    props.address;

  return (
    <div className="flex items-center">
      <div className="text-xs font-medium text-gray-900 font-mono">
        {convertAddressToShortString(props.address)}
      </div>
      <div
        onClick={() => copy(props.address)}
        className="flex-shrink-0 h-5 w-5 mt-1.5 ml-1 cursor-pointer"
      >
        <TbCopy />
      </div>
      <div>
        <a target="_blank" href={explorerLink}>
          <TbExternalLink />
        </a>
      </div>
    </div>
  );
};

export const AddressFull = (props: { address: string; chainId: number }) => {
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const explorerLink =
    getChain(props.chainId).blockExplorers.default.url +
    "/address/" +
    props.address;

  return (
    <div className="flex items-center">
      <div className="text-xs font-medium text-gray-900 font-mono">
        {props.address}
      </div>
      <div
        onClick={() => copyAddress(props.address)}
        className="flex-shrink-0 h-5 w-5 mt-1.5 ml-1 cursor-pointer"
      >
        <TbCopy />
      </div>
      <div>
        <a target="_blank" href={explorerLink}>
          <TbExternalLink />
        </a>
      </div>
    </div>
  );
};

export const AddressResponsive = (props: {
  address: string;
  chainId: number;
}) => {
  const isMobile = useMediaQuery(768);

  if (isMobile)
    return <Address address={props.address} chainId={props.chainId} />;

  return <AddressFull address={props.address} chainId={props.chainId} />;
};

export const truncatedString = (str: string) => {
  return <div className="truncate font-mono w-32">{str}</div>;
};

export const truncatedStringWithoutStyle = (str: string) => {
  return <span className="truncate">{str}</span>;
};

export const getAddressExplorerLink = (chainId: number, hash: string) => {
  return getChain(chainId).blockExplorers.default.url + "/address/" + hash;
}

export const getTxnExplorerLink = (chainId: number, hash: string) => {
  return getChain(chainId).blockExplorers.default.url + "/tx/" + hash;
}

export function trucateString(inputStr: string): string {
  if (inputStr.length <= 10) {
      return inputStr;
  } else {
      const result: string = `${inputStr.slice(0, 6)}...${inputStr.slice(-4)}`;
      return result;
  }
}