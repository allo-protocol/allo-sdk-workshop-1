"use client";

import { commonConfig } from "@/config/common";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfileForm() {
  return (
    <form>
      <div className="border-b border-white/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-white">
          Create A Profile on {commonConfig.chainId} Network
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          This information will be displayed publicly so be careful what you
          share.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-white"
            >
              Wallet Address for {commonConfig.chainId}
            </label>
            <div className="mt-2">
              <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  {commonConfig.chainId}:
                </span>
                <input
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="address"
                  className="flex-1 border-0 bg-transparent py-1.5 p-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="0x1234..."
                />
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-white"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={"Jaxcoder"}
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="photo"
              className="block text-sm font-medium leading-6 text-white"
            >
              Photo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              <UserCircleIcon
                className="h-12 w-12 text-gray-500"
                aria-hidden="true"
              />
              <button
                type="button"
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
              >
                Change
              </button>
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-white"
            >
              Cover photo
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon
                  className="mx-auto h-12 w-12 text-gray-500"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm border border-red-900 font-semibold leading-6 text-white hover:bg-red-950 px-3 py-1.5 rounded-md"
          onClick={() => {
            alert("Cancel");
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save &amp; Publish
        </button>
      </div>
    </form>
  );
}
