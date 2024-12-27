import {Header} from "@/app/(default)/header";
import {Footer} from "@/app/(default)/footer";

export default function LandingPage() {
    return (
        <>
            <Header/>
            <main className="overflow-hidden">
                <section className="relative">
                    <div className="relative pt-24 lg:pt-28">
                        <div className="mx-auto px-6 max-w-7xl md:px-12">
                            <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                                <h1 className="mt-8 text-wrap text-4xl md:text-5xl font-semibold text-title xl:text-5xl xl:[line-height:1.125]">Erfahre mehr über die Verbindungen zwischen Politikern und Unternehmen!</h1>
                                <p className="text-wrap mx-auto mt-8 max-w-2xl text-lg hidden sm:block text-body">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod</p>
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
                                <h2 className="text-3xl text-gray-950 dark:text-white font-semibold">Finde deine Lieblingspolitiker</h2>

                                <div className={"relative mt-4"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                                         className={"h-6 mt-3.5 ml-3.5 absolute stroke-gray-50 opacity-80"}>
                                        <path
                                            d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"/>
                                    </svg>
                                    <input className={"h-12 w-full border rounded-xl pl-14"} type={"text"}
                                           placeholder={"Marie Agnes Strack Zimmermann"}/>
                                </div>
                            </div>
                            <div className="mt-8 relative w-fit h-fit sm:mx-auto sm:px-0 -mx-6 px-6 overflow-x-auto">
                                <div className="mb-3 flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318683999245307904/Z.png?ex=676337ad&is=6761e62d&hm=14d66eaf48e8139ae928bded959af174efd9153091dff2abf92f5621f91cd612&)"}}></div>
                                    <div className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden" style={{backgroundPosition: "center", backgroundSize: "cover", backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684072561741834/Z.png?ex=676337be&is=6761e63e&hm=345d9b97766f4c62f9ba5ec04479b923b47fbc9475f1afa7674f505e6be73aec&)"}}></div>
                                    <div className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden" style={{backgroundPosition: "center", backgroundSize: "cover", backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684116828295188/9k.png?ex=676337c9&is=6761e649&hm=cfef18e1950284837bde5a79c4f43553ca31aa1146cf8b3a4a125cbe439aa8aa&)"}}></div>
                                </div>
                                <div className="flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318686245483708456/Z.png?ex=676339c4&is=6761e844&hm=44692947e0042dccee29c4022463ec5f86b4d6d3950f586ca97c43854ba10946&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684150500298853/9k.png?ex=676337d1&is=6761e651&hm=6d8b01b67770ea2942bdc5bb4a5c5a5e14ce26748a10ca6e1e2dc76960cf8062&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684198705430538/Z.png?ex=676337dc&is=6761e65c&hm=9c11ba2815279287c9b2ec0fea82df374a87b03983462b391a6aabfd6c5da9f6&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684376061575188/2Q.png?ex=67633807&is=6761e687&hm=8be8f1366ee5cb4fbef4a19f3da7ca6a5786befdce745777d0dcbcf606e154ad&)"
                                        }}></div>

                                </div>
                                <div className="my-3 flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684451735212143/2Q.png?ex=67633819&is=6761e699&hm=2b7458915bd8d868915319adde4e4fb63ae041dd772847fe391ba6234fc411a0&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684540524298371/Z.png?ex=6763382e&is=6761e6ae&hm=7a1b402f1fb2d18fabe7d931623b75102e2b2c7046c0bbd2ea80ce6c60078e4f&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318684952044503100/baerbock_annalena_gross.png?ex=67633890&is=6761e710&hm=c1cdee915eb01e0c677ef9ff87a50d68c584e136d8b750ad9f25b5cb18af8846&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685149776580758/2Q.png?ex=676338bf&is=6761e73f&hm=96fca4b85a16afd67cb6797bd12a1a3351ed1052f92b94d826f1b0e7537c669d&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685394451300372/2Q.png?ex=676338fa&is=6761e77a&hm=aa8f595940c8998d750491b852b4406f942ff05b7348dbe2604cd78773209db0&)"
                                        }}></div>
                                </div>
                                <div className="flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685440538312745/chrupalla_tino_gross.png?ex=67633905&is=6761e785&hm=10408b9c87563779608a391583a4865e581fd4473ad1a02a3eaef5e02b5f5b7c&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685483609493574/amthor_philipp_gross.png?ex=6763390f&is=6761e78f&hm=ad60d6e1295b1a18db534c3e59361150692c46a18904f7c6e4655db94c6f50f5&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685591809949696/wissing_volker.png?ex=67633929&is=6761e7a9&hm=679f2341f641b18d23aa109d363ceea7984fd71da0926ca545b9fc160e68c039&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685924418125964/9k.png?ex=67633978&is=6761e7f8&hm=4405a4e7d6bbf57ed05fec3482f5c8cb8997f506ef8763d32f00970ba8676929&)"
                                        }}></div>
                                </div>
                                <div className="mt-3 flex w-fit mx-auto gap-3">
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318685987152592916/9k.png?ex=67633987&is=6761e807&hm=d156161b2809d5dce6de2ff68f7c5d7294d88724e4952e6ebcf98d1cc24b804a&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318686534874169394/Z.png?ex=67633a09&is=6761e889&hm=c89acb92d4b1c838f6a19a63457dd5c65f25e18542c827e28f3c31be5a3e4750&)"
                                        }}></div>
                                    <div
                                        className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
                                        style={{
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundImage: "url(https://cdn.discordapp.com/attachments/1240360841585365015/1318686723252813865/9k.png?ex=67633a36&is=6761e8b6&hm=2cc64c0e5f2a66a656072bafaf8f3a69f3d6cc75630bfd45f4801634b47e99ac&)"
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
            <Footer/>
        </>
    )
}