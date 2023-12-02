import { TAllocatedData } from "@/app/types";
import {
  classNames,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Address, AddressResponsive } from "./Address";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

// blockTimestamp: "2023-11-21T11:25:36+01:00";
// chainId: "5";
// contractAddress: "0x1a92384e01a8cb445d0508a03ef5306d35cdee47";
// contractName: "MicroGrantsStrategy";
// recipientId: "0x136d473d0c3965d7630f346152101e741074825f";
// sender: "0xe7eb5d2b5b188777df902e89c54570e7ef4f59ce";

export default function AllocatedList(props: {
  allocateds: TAllocatedData[];
  showApplication?: boolean;
}) {
  const shouldShowApplication = props.showApplication ?? true;

  return (
    <div className="mt-4">
      {!props.showApplication && (
        <h3 className={`text-sm font-medium text-gray-900 border-t pt-10`}>
          Application Reviews
        </h3>
      )}
      {/* Allocations */}
      {props.allocateds.length > 0 ? (
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Allocator
                    </th>
                    {shouldShowApplication && (
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Application
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {props.allocateds.map((allocation: TAllocatedData) => (
                    <tr key={allocation.recipientId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <dd className="mt-1 text-sm leading-6 text-gray-700 text-center sm:mt-0">
                          <div
                            style={{ maxWidth: "100px" }}
                            className={classNames(
                              statusColorsScheme[
                                allocation.status
                                  ? (allocation.status as keyof typeof statusColorsScheme)
                                  : "Undefined"
                              ],
                              "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset",
                            )}
                          >
                            {allocation.status
                              ? allocation.status.toString()
                              : "Undefined"}
                          </div>
                        </dd>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {prettyTimestamp(
                          new Date(allocation.blockTimestamp).getTime() / 1000,
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {!shouldShowApplication ? (
                          <AddressResponsive
                            address={allocation.sender}
                            chainId={Number(allocation.chainId)}
                          />
                        ) : (
                          <Address
                            address={allocation.sender}
                            chainId={Number(allocation.chainId)}
                          />
                        )}
                      </td>
                      {shouldShowApplication && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <AddressResponsive
                            address={allocation.recipientId}
                            chainId={Number(allocation.chainId)}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8 w-full text-center pt-2">
          <InboxIcon className="mb-4 w-8 h-8 mx-auto" />
          <p>No Allocation History</p>
        </div>
      )}
    </div>
  );
}
