export function Footer() {
  return (
    <>
      <footer className="card variant-outlined !bg-transparent border-t dark:border-t-gray-600">
        <div className="max-w-6xl mx-auto space-y-16 px-6 py-10 2xl:px-0">
          <div className="flex items-center justify-between rounded-md px-6 card variant-soft">
            <span className="text-title dark:text-white">
              &copy; Polititracker {new Date().getUTCFullYear()}
            </span>
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
