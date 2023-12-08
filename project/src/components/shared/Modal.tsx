"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ProgressFeed from "./ProgressFeed";
import { TProgressStep } from "@/app/types";

export default function Modal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openModalText?: string;
  closeModalText?: string;
  title?: string;
  steps: TProgressStep[];
}) {
  function closeModal() {
    props.setIsOpen(false);
  }

  function openModal() {
    props.setIsOpen(true);
  }

  return (
    <>
      {props.openModalText && (
        <div className="fixed inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={openModal}
            className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
          >
            {props.openModalText}
          </button>
        </div>
      )}

      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {props.title && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      {props.title}
                    </Dialog.Title>
                  )}

                  <ProgressFeed steps={props.steps} />

                  {props.closeModalText && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="text-right rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={closeModal}
                      >
                        {props.closeModalText}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
