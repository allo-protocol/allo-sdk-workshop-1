import Link from "next/link";

export type BreadcrumbT = {
  id: number;
  name: string;
  href: string;
};

const Breadcrumb = (props: { breadcrumbs: BreadcrumbT[] }) => {
  const breadcrumbs = props.breadcrumbs;

  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="mx-auto flex w-full items-center space-x-2 px-4 sm:px-6 lg:px-8"
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.id}>
            <div className="flex items-center">
              <Link
                href={breadcrumb.href}
                className="mr-2 text-sm font-medium text-gray-900"
              >
                {breadcrumb.name}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
