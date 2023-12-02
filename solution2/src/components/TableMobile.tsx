import { TTableData } from "@/types/types";

const TableMobile = ({
  data,
  currentRows,
}: {
  data: TTableData;
  currentRows: (string | JSX.Element | undefined)[][];
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      {/* <thead className="mx-2">
        <tr key={"header-row"}>
          {data.headers?.map((header, index) => (
            <th
              key={"headers-" + index}
              scope="col"
              className="text-left text-sm font-semibold text-gray-900"
            >
              <div className="group inline-flex">{header}</div>
            </th>
          ))}
        </tr>
      </thead> */}
      <tbody className="">
        {currentRows.map((row, index) => (
          <tr key={"rows-" + index}>
            <div className="m-2 p-1 border rounded-md flex-col min-w-fit col-span-full shadow-md">
              {row.map((col, colIndex) => {
                if (!data.headers || data.headers[colIndex] === "") return null;
                  return (
                    <td
                      key={"rows-" + index + "-col-" + colIndex}
                      className="flex flex-col py-1 pr-3 text-sm font-medium text-gray-900 pl-1"
                    >
                      <div className="flex flex-row">
                        <div className="flex flex-col">
                          <div className="text-xs font-bold text-gray-500">
                            {data.headers[colIndex]}
                          </div>
                          <div className="text-sm text-gray-900">
                            {col}
                          </div>
                        </div>
                      </div>
                    </td>
                  );})}
            </div>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableMobile;
