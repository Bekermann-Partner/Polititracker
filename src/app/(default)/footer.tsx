import Link from 'next/link';

export function Footer() {
  return (
    <>
      <footer className="card variant-outlined !bg-transparent border-t dark:border-t-gray-600">
        <div className="max-w-6xl mx-auto space-y-16 px-6 py-10 2xl:px-0">
          <div className="flex items-center rounded-md px-6 card variant-soft">
            <span className="text-title dark:text-white">
              &copy; Polititracker {new Date().getUTCFullYear()}
            </span>

            <Link
              href={'/user-agreement'}
              className="flex items-center gap-1 ml-8 mr-auto hover:text-indigo-600 transition-colors dark:text-gray-100 dark:hover:text-indigo-300"
            >
              Nutzungsvereinbarung
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 3h7m0 0v7m0-7L10 14M5 5v14h14"
                />
              </svg>
            </Link>

            <span
              className={
                'text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 font-mono px-2 py-1 rounded-xl'
              }
            >
              #{process.env.BUILD_VERSION} | {process.env.BUILD_DATE}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
