import db from "@/_lib/db";
import Image from "next/image";
import {Property} from "csstype";
import BackgroundColor = Property.BackgroundColor;

export default async function PoliticianView({params}: { params: Promise<{ uuid: string }> }) {
    const polId = (await params).uuid;

    const politician = await db.politician.findFirst({
        where: {
            uuid: polId,
        },
        include: {
            party: true,
        }
    })

    console.log(politician)

    return (
        <section className={"pt-24"}>
            <div className="mx-auto max-w-6xl">
                <div className={"flex flex-row"}>
                    <div className={"h-32 w-32 rounded-xl overflow-hidden"}>
                        <Image src={`/pol_profile_img/${politician?.profile_image}`} alt={"a"} width={150}
                               height={150} className={"h-full w-auto object-cover"}/>
                    </div>
                    <div className={"w-full ml-6"}>
                        <h1 className={"text-3xl text-gray-950 font-semibold"}>{politician?.field_title} {politician?.first_name} {politician?.last_name}</h1>
                        <h2 className={"text-xl text-gray-600"}>{politician?.occupation}</h2>
                        <div className={"border-b mt-2 mb-2 border-b-gray-300"}></div>

                        <div className={"flex flex-row justify-between"}>
                            <h2 className={"text-gray-600"}>{politician?.party?.long} {politician?.party.long !== politician?.party.short ? `(${politician?.party.short})` : ''}</h2>
                            <h6 className={"text-lg text-gray-300 mt-auto"}>#{polId}</h6>
                        </div>
                    </div>
                </div>

                <pre>{JSON.stringify(politician, null, 2)}</pre>
            </div>
        </section>
    )
}