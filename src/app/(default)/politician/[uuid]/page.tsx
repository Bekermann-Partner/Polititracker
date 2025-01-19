import db from "@/_lib/db";
import {LoadingSideJobs, SideJobs} from "@/app/(default)/politician/[uuid]/SideJobs";
import React from "react";
import {LoadingPoliticianDetails, PoliticianDetails} from "@/app/(default)/politician/[uuid]/PoliticianDetails";
import CommentSectionWrapper from "@/app/(default)/politician/[uuid]/comments/CommentSectionWrapper";

async function fetchPolitician(uuid: string) {
    return db.politician.findFirst({
        where: {
            uuid,
        },
        include: {
            party: true,
        },
    });
}

export default async function PoliticianView({params}: { params: Promise<{ uuid: string }> }) {
    const polId = (await params).uuid;
    const politician = fetchPolitician(polId);

    return (
        <section className={"pt-24"}>
            <div className="mx-auto max-w-6xl">
                <React.Suspense fallback={<LoadingPoliticianDetails/>}>
                    <PoliticianDetails politicianPromise={politician}/>
                </React.Suspense>

                <h1 className={"mt-8 text-2xl font-semibold dark:text-gray-200"}>Nebentätigkeiten:</h1>
                <React.Suspense fallback={<LoadingSideJobs/>}>
                    <SideJobs politicianPromise={politician}/>
                </React.Suspense>

                <h1 className={"mt-8 text-2xl font-semibold dark:text-gray-200"}>Kommentare:</h1>
                <CommentSectionWrapper politicianPromise={politician}/>
            </div>
        </section>
    )
}