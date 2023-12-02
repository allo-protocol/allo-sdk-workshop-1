import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getNetworks } from "@/utils/networks";
import {
  convertAddressToShortString,
  convertBytesToShortString,
  copy,
} from "@/utils/utils";
import { TbCopy, TbExternalLink } from "react-icons/tb";

export const Hash = (props: { hash: string; chainId: number }) => {
  const explorerLink =
    getNetworks()[props.chainId].explorer + "tx/" + props.hash;

  return (
    <div className="flex items-center">
      <div className="text-sm font-medium text-gray-900 font-mono">
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

export const Address = (props: { address: string; chainId: number }) => {
  const explorerLink =
    getNetworks()[props.chainId].explorer + "address/" + props.address;

  return (
    <div className="flex items-center">
      <div className="text-sm font-medium text-gray-900 font-mono">
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
    getNetworks()[props.chainId].explorer + "address/" + props.address;

  return (
    <div className="flex items-center">
      <div className="text-sm font-medium text-gray-900 font-mono">
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
