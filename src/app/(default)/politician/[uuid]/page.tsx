import db from "@/_lib/db";
import Image from "next/image";
import abgeordnetenWatchApiProvider from "@/_lib/providers/abgw/abgeordnetenWatchApiProvider";
import {SideJob} from "@/app/(default)/politician/[uuid]/SideJob";

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

    const mandates = await abgeordnetenWatchApiProvider.getCandidacyMandates(politician!.ext_abgeordnetenwatch_id);
    const sideJobs = await abgeordnetenWatchApiProvider.getSideJobsFromMandates(mandates.map(mandate => mandate.id));


    let age = -1;

    if (politician?.birth_year) {
        const date = new Date().getUTCFullYear();
        age = date - politician.birth_year;
    }

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

                        {age !== -1 &&
                            <h2 className={"text-gray-600"}>{age} Jahre alt (geb. {politician?.birth_year})</h2>
                        }
                    </div>
                </div>

                <h1 className={"mt-8 text-2xl font-semibold"}>Nebentätigkeiten:</h1>
                {sideJobs.map(sidejob => {
                    return (<SideJob key={sidejob.id} sidejob={sidejob}/>)
                })}

                <h1 className={"mt-8 text-2xl font-semibold"}>Kommentare:</h1>
            </div>
        </section>
    )
}