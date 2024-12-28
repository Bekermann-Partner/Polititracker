import {SearchBar} from "@/app/(default)/searchBar";
import db from "@/_lib/db";

export default async function LandingPage() {
    const randomPoliticianImages = await db.politician.findMany({
        where: {
            profile_image: {
                not: undefined
            }
        }
    });

    const images = randomPoliticianImages.map(politician => `/pol_profile_img/${politician.profile_image}`)
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value);

    return (
        <>
            <main className="overflow-hidden">
                <section className="relative">
                    <div className="relative pt-24 lg:pt-28">
                        <div className="mx-auto px-6 max-w-7xl md:px-12">
                            <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                                <h1 className="mt-8 text-wrap text-4xl md:text-5xl font-semibold text-title xl:text-5xl xl:[line-height:1.125]">
                                    Erfahre mehr über die Verbindungen zwischen Politikern und Unternehmen!
                                </h1>
                                <p className="text-wrap mx-auto mt-8 max-w-2xl text-lg hidden sm:block text-body">
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                                    tempor
                                    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
                                    accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                                    sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                                    sadipscing elitr, sed diam nonumy eirmod
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={"flex justify-center gap-3 mt-10"}>
                        <img
                            src="https://cdn.discordapp.com/attachments/1240360841585365015/1318683055027650650/graph-placeholder.png?ex=676336cc&is=6761e54c&hm=d818fe82f951bbf3ea8317b6efb10c025e92b63ce94eb2665803b80a20ef6e3b&"
                            alt=""/>
                        <img
                            src="https://cdn.discordapp.com/attachments/1240360841585365015/1318683055027650650/graph-placeholder.png?ex=676336cc&is=6761e54c&hm=d818fe82f951bbf3ea8317b6efb10c025e92b63ce94eb2665803b80a20ef6e3b&"
                            alt=""/>
                    </div>
                </section>
                <section>

                </section>
                <section>
                    <div className="mt-28">
                        <div className="mx-auto px-6 max-w-6xl">
                            <div className="text-center">
                                <h2 className="text-3xl text-gray-950 dark:text-white font-semibold">Finde deine
                                    Lieblingspolitiker</h2>

                                <SearchBar/>
                            </div>
                            <div className="mt-8 relative w-fit h-fit sm:mx-auto sm:px-0 -mx-6 px-6 overflow-x-auto">
                                <div className="mb-3 flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[0]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[1]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[2]})`
                                        }}></div>
                                </div>
                                <div className="flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[3]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[4]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[5]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[6]})`
                                        }}></div>

                                </div>
                                <div className="my-3 flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[7]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[8]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[9]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[10]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[11]})`
                                        }}></div>
                                </div>
                                <div className="flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[12]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[13]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[14]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[15]})`
                                        }}></div>
                                </div>
                                <div className="mt-3 flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[16]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[17]})`
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: `url(${images[18]})`
                                        }}></div>
                                </div>
                            </div>
                            <div className="-mx-6 top-[-235px] relative max-w-xl sm:mx-auto">
                                <div
                                    className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 dark:opacity-10 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)]"></div>
                                <div
                                    className="absolute top-0 inset-x-0 w-2/3 h-44 -z-[1] rounded-full bg-blue-200 dark:bg-white/20 mx-auto blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}