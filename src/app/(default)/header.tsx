import Link from "next/link";

export function Header() {
    return (
        <>
            <header id="header" className="group">
                <nav
                    className="fixed overflow-hidden z-20 w-full border-b bg-white/50 dark:bg-gray-950/50 backdrop-blur-2xl">
                    <div className="px-6 m-auto max-w-6xl 2xl:px-0">
                        <div className="flex flex-wrap items-center justify-between py-2 sm:py-4">
                            <div className="w-full items-center flex justify-between lg:w-auto">
                                <h1 className={"text-xl font-bold"}>Platzhalter</h1>
                                <div className="flex lg:hidden">
                                    <button id="menu-btn" aria-label="open menu"
                                            className="btn variant-ghost sz-md icon-only relative z-20 -mr-2.5 block cursor-pointer lg:hidden">
                                        <svg
                                            className="text-title m-auto size-6 transition-[transform,opacity] duration-300 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.75 9h16.5m-16.5 6.75h16.5"></path>
                                        </svg>
                                        <svg
                                            className="text-title absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 transition-[transform,opacity] duration-300 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M6 18 18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div
                                className="w-full group-data-[state=active]:h-fit h-0 lg:w-fit flex-wrap justify-end items-center space-y-8 lg:space-y-0 lg:flex lg:h-fit md:flex-nowrap">
                                <div className="mt-6 dark:text-body md:-ml-4 lg:pr-4 lg:mt-0">
                                    <ul className="space-y-6 tracking-wide text-base lg:text-sm lg:flex lg:space-y-0">
                                        <li className={"hover:text-indigo-600 transition-colors"}>
                                            <a href="#" className="hover:link md:px-4 block">
                                                <span>Politiker</span>
                                            </a>
                                        </li>
                                        <li className={"hover:text-indigo-600 transition-colors"}>
                                            <a href="#" className="hover:link md:px-4 block">
                                                <span>Dashboard</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div
                                    className="w-full space-y-2 gap-2 pt-6 pb-4 lg:pb-0 border-t items-center flex flex-col lg:flex-row lg:space-y-0 lg:w-fit lg:border-l lg:border-t-0 lg:pt-0 lg:pl-2">
                                    <Link href={"/auth/sign-in"}
                                          className={"bg-black hover:bg-gray-800 transition-colors text-white rounded px-3 py-1.5 ml-5"}>
                                        Anmelden
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}