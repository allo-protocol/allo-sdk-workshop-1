import { Loading } from "@/components/Loading";
import Transactions from "@/components/Transactions";
import {
  IAlloTransactionLogResponse,
  TAlloTransactionLog,
} from "@/types/types";
import { graphqlEndpoint, getAlloTransactions } from "@/utils/query";
import { request } from "graphql-request";
import { Suspense } from "react";

const getAlloTransactionLog = async () => {
  const response: IAlloTransactionLogResponse = await request(
    graphqlEndpoint,
    getAlloTransactions
  );

  return response.alloTransactions;
};

export default async function Home() {
  const alloTransactionLog: TAlloTransactionLog[] =
    await getAlloTransactionLog();

  return (
    <div className="bg-white">
      <Suspense fallback={<Loading />}>
        <Transactions alloTransactions={alloTransactionLog} />
      </Suspense>
    </div>
  );
}
