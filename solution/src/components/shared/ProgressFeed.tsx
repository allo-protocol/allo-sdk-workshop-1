import { EProgressStatus, TProgressStep } from "@/app/types";
import { CheckIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ProgressFeed(props: { steps: TProgressStep[] }) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {props.steps.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== props.steps.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  {event.status === EProgressStatus.IS_SUCCESS && (
                    <span
                      className={
                        "bg-green-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      }
                    >
                      <CheckIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                  {event.status === EProgressStatus.IS_ERROR && (
                    <span
                      className={
                        "bg-red-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      }
                    >
                      <XMarkIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                  {event.status === EProgressStatus.IN_PROGRESS && (
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-violet-500 rounded-full">
                      <span className="h-2.5 w-2.5 bg-violet-500 rounded-full animate-pulse" />
                    </span>
                  )}
                  {event.status === EProgressStatus.NOT_STARTED && (
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 rounded-full border-grey-400"></span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.content}{" "}
                      <a
                        href={event.href}
                        className="font-medium text-gray-900"
                      >
                        {event.target}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
