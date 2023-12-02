"use client";

import Table from "../Table";
import { TTableData } from "@/types/types";
import { Address } from "../Address";
import {
  convertChainIdToNetworkName,
  formatAmount,
  truncatePoolName,
} from "@/utils/utils";
import Link from "next/link";
import { TPoolDetail } from "./types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Pool = ({
  data,
  header,
  description,
}: {
  data: TPoolDetail[];
  header?: string;
  description?: string;
}) => {
  const tableData: TTableData = {
    headers: [
      "ID",
      "Address",
      "Token",
      "Amount",
      "Profile Name",
      "Profile Owner",
      "Updated At",
      "Network",
    ],
    rows: Object.values(data).map((pool: TPoolDetail) => {
      return [
        // eslint-disable-next-line react/jsx-key
        <Link
          className="text-green-800 hover:bg-green-200 p-2 rounded-md"
          href={`/pool/${pool.chainId}/${pool.poolId}`}
        >
          {pool.poolId}
        </Link>,
        ,
        // eslint-disable-next-line react/jsx-key
        <Address address={pool.strategy} chainId={Number(pool.chainId)} />,
        // eslint-disable-next-line react/jsx-key
        <Address address={pool.token} chainId={Number(pool.chainId)} />,
        formatAmount(pool.amount, pool.tokenMetadata?.decimals ?? 18),
        truncatePoolName(pool.profile?.name ?? ""),
        // eslint-disable-next-line react/jsx-key
        <Address address={pool.profile?.owner ?? ""} chainId={Number(pool.chainId)} />,
        (new Date(pool.updatedAt)).toLocaleString(),
        convertChainIdToNetworkName(Number(pool.chainId)),
      ];
    }),
  };

  const isMobile = useMediaQuery(768);

  return (
    <Table
      data={tableData}
      header={header}
      description={description}
      showPagination={true}
      rowsPerPage={isMobile ? 5 : 10}
    />
  );
};

export default Pool;
