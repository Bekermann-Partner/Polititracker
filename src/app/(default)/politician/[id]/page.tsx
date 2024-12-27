import db from "@/_lib/db";

export default async function PoliticianView({params}: {params: Promise<{id: number}>}) {
    const polId = (await params).id;

    const politician = await db.politician.findFirst({
        where: {
            id: Number(polId),
        }
    })

    console.log(politician)

    const url = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

    return (
        <section className={"pt-24"}>
            <div className="mx-auto max-w-6xl">
                <div className={"flex flex-row"}>
                    <div className={"h-32 w-32 rounded-xl mr-4 overflow-hidden bg-center bg-cover"} style={{backgroundImage: `url(${url})`}}>
                    </div>
                    <div className={"w-full"}>
                        <div className={"flex flex-row justify-between"}>
                            <h1 className={"text-3xl text-gray-950 font-semibold"}>{politician?.first_name} {politician?.last_name}</h1>
                            <h1 className={"text-2xl text-gray-300 mt-auto"}>#{polId}</h1>
                        </div>
                        <div className={"border-b mt-2 mb-2 border-b-gray-300"}></div>
                    </div>
                </div>

            </div>
        </section>
)
}