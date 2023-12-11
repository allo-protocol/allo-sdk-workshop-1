import { TActivity } from "@/app/types";
import { classNames } from "@/utils/common";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

export default function Activity(props: { activity: TActivity[] }) {
  return (
    <>
      <h2 className="text-sm font-semibold leading-6 text-gray-900">
        Activity
      </h2>
      <ul role="list" className="mt-6 space-y-6">
        {props.activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === props.activity.length - 1
                  ? "h-6"
                  : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center"
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>

            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
              {activityItem.status === "Completed" && (
                <CheckCircleIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
              )}
              {activityItem.status === "Approved" && (
                <ArrowUpCircleIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              )}
              {activityItem.status === "Rejected" && (
                <ArrowDownCircleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              )}
              {activityItem.status === "none" && (
                <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
              )}
            </div>
            <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              {activityItem.prefixText}
              <span className="font-medium text-gray-900">
                {activityItem.href ? (
                  <a target="_blank" href={activityItem.href}>{activityItem.textBold}</a>
                ) : (
                  activityItem.textBold
                )}
              </span>{" "}
              {activityItem.suffixText}
            </p>
            <time
              dateTime={activityItem.dateTime}
              className="flex-none py-0.5 text-xs leading-5 text-gray-500"
            >
              {activityItem.date}
            </time>
          </li>
        ))}
      </ul>
    </>
  );
}
