"use client";

import { Address, Hash, truncatedString } from "./Address";
import Table from "./Table";
import { TAlloTransactionLog, TTableData } from "@/types/types";
import { convertChainIdToNetworkName } from "@/utils/utils";
import Status from "./Status";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Transactions = ({
  alloTransactions,
}: {
  alloTransactions: TAlloTransactionLog[];
}) => {
  const dataAlloTransaction: TTableData = {
    headers: [
      "",
      "Hash",
      "From",
      "To",
      "Function",
      "Block",
      "Timestamp",
      "Network",
    ],
    rows: Object.values(alloTransactions).map((alloTransaction) => {
      const statusBoolean = alloTransaction.status === "1" ? true : false;
      const date = new Date(alloTransaction.blockTimestamp);
      const transformedTimestamp = date.toLocaleString(); //date.getTime().toString();

      return [
        // eslint-disable-next-line react/jsx-key
        <Status status={statusBoolean} />,
        // eslint-disable-next-line react/jsx-key
        <Hash
          hash={alloTransaction.hash}
          chainId={Number(alloTransaction.chainId)}
        />,
        // eslint-disable-next-line react/jsx-key
        <Address
          address={alloTransaction.fromAddress}
          chainId={Number(alloTransaction.chainId)}
        />,
        // eslint-disable-next-line react/jsx-key
        <Address
          address={alloTransaction.toAddress}
          chainId={Number(alloTransaction.chainId)}
        />,
        truncatedString(alloTransaction.functionName),
        alloTransaction.blockNumber,
        transformedTimestamp,
        convertChainIdToNetworkName(Number(alloTransaction.chainId)),
      ];
    }),
  };

  const isMobile = useMediaQuery(768);

  return (
    <Table
      data={dataAlloTransaction}
      header={"Allo Transaction Log"}
      showPagination={true}
      description={""}
      rowsPerPage={isMobile ? 5 : 20}
    />
  );
};

export default Transactions;
