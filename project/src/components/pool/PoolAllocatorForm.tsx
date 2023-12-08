"use client";

import Error from "@/components/shared/Error";
import Modal from "../shared/Modal";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ethereumAddressRegExp } from "@/utils/common";
import { SetAllocatorData } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { PoolContext } from "@/context/PoolContext";
import {
  ArrowRightIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const schema = yup.object().shape({
  allocators: yup.array().of(
    yup.object().shape({
      address: yup
        .string()
        .required("Allocator Address is required")
        .matches(ethereumAddressRegExp, "Invalid Ethereum address"),
      action: yup.string().required("Allocator Action is required"),
    })
  ),
});

export default function PoolAllocatorForm() {
  const { steps, batchSetAllocator } = useContext(PoolContext);
  const [allocators, setAllocators] = useState([
    { address: "", action: "true" }, // Initial allocator
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    setIsOpen(false);
    setAllocators([{ address: "", action: "true" }]);
    setValue("allocators", [{ address: "", action: "true" }]);
  };

  const onHandleSubmit = async (data: any) => {
    setIsOpen(true);
    const allocatorData: SetAllocatorData[] = data.allocators.map(
      (allocator: any) => ({
        allocatorAddress: allocator.address,
        flag: allocator.action === "true" ? true : false,
      })
    );
    await batchSetAllocator(allocatorData);
    setTimeout(() => {
      handleCancel();
    }, 1000);
  };

  const addAllocator = () => {
    setAllocators((prevAllocators) => [
      ...prevAllocators,
      { address: "", action: "true" },
    ]);
  };

  const removeAllocator = (index: number) => {
    setAllocators((prevAllocators) =>
      prevAllocators.filter((_, i) => i !== index)
    );
  };

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const text = await file.text();

      const rows = text.split("\n");
      const newAllocators: { address: string; action: string }[] = [];
      rows.map((row) => {
        const [address, action] = row.split(",");
        // if address matches ethereumAddressRegExp add to newAllocators
        if (address.match(ethereumAddressRegExp)) {
          newAllocators.push({
            address,
            action: action?.replace(" ", "") === "false" ? "false" : "true",
          });
        }
      });

      updateAllocators(newAllocators);
    }
  };

  const updateAllocators = (
    newAllocators: { address: string; action: string }[]
  ) => {
    if (allocators.length === 1 && allocators[0].address === "") {
      dedupeAllocators(newAllocators);
    } else {
      dedupeAllocators([...allocators, ...newAllocators]);
    }
  };

  const dedupeAllocators = (data: { address: string; action: string }[]) => {
    const uniqueAllocators = Array.from(
      new Map(
        [...data].map((allocator) => [allocator.address, allocator])
      ).values()
    );

    setAllocators(uniqueAllocators);
    setValue("allocators", uniqueAllocators);
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="space-y-4">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Manage Allocators via CSV
          </h3>
        </div>

        <div className="mt-3 border-t border-gray-100">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <input
                type="file"
                id="csvFileUpload"
                name="csvFileUpload"
                className="hidden"
                onChange={handleCSVUpload}
              />{" "}
              <div className="mt-2 px-4 py-6 sm:grid sm:gap-4 sm:px-0">
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <button
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        type="button"
                        onClick={() => {
                          document.getElementById("csvFileUpload")!.click();
                        }}
                      >
                        <ArrowUpTrayIcon width={5} /> Upload CSV
                      </button>

                      <div className="flex gap-2">
                        <span className="flex-shrink-0 text-gray-400">
                          <div className="font-semibold mt-0.5 pl-1">
                            Allowed formats: address,(bool)
                          </div>
                          <div className="font-normal font-mono pl-1 flex">
                            <span>Add</span>
                            <ArrowRightIcon width={12} className="mx-2" />
                            <span>0x123..89</span>
                          </div>
                          <div className="font-normal font-mono pl-1 flex">
                            <span>Add</span>
                            <ArrowRightIcon width={12} className="mx-2" />
                            <span>0x123..89,true</span>
                          </div>
                          <div className="font-normal font-mono pl-1 flex">
                            <span>Remove</span>
                            <ArrowRightIcon width={12} className="mx-2" />
                            <span>0x456..78,false</span>
                          </div>
                        </span>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-6">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Manage Allocators via Form
              </h3>
            </div>
            <div className=" py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Allocator Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allocators.map((allocator, index: number) => (
                    <React.Fragment key={index}>
                      <tr key={`fragment-${index}`}>
                        <td
                          className={`w-full ${
                            !errors?.allocators?.[index]?.address && "py-1.5"
                          }`}
                        >
                          <input
                            {...register(`allocators.${index}.address`)}
                            type="text"
                            name={`allocators[${index}].address`}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="0x1234.."
                          />
                        </td>
                        <td className="px-3">
                          <select
                            {...register(`allocators.${index}.action`)}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                          >
                            <option id={`option[${index}].true`} value="true">
                              Add
                            </option>
                            <option id={`option[${index}].false`} value="false">
                              Remove
                            </option>
                          </select>
                        </td>
                        <td className="">
                          {index > 0 ? (
                            <button
                              type="button"
                              onClick={() => removeAllocator(index)}
                            >
                              <XMarkIcon width={15} />
                            </button>
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </td>
                      </tr>
                      {errors?.allocators?.[index]?.address && (
                        <tr className="">
                          <td className="w-[300px] px-3 pb-2">
                            <Error
                              message={
                                errors!.allocators[index]!.address!.message!
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button
                  className="mr-2 flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={addAllocator}
                >
                  <PlusIcon width={12} className="mr-2" /> Add Row
                </button>
                <button
                  className="flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={() => {
                    setAllocators([{ address: "", action: "true" }]);
                    setValue("allocators", [{ address: "", action: "true" }]);
                  }}
                >
                  <TrashIcon width={12} className="mr-2" />
                  Clear
                </button>
              </div>
              <div className="w-full mt-6 flex items-center justify-end gap-x-6 px-6">
                <button
                  type="button"
                  className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 text-white rounded-md px-3 py-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Save
                </button>
              </div>

              <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
