import db from "@/_lib/db";

export default async function PoliticianView({params}: {params: Promise<{id: number}>}) {
    const polId = (await params).id;

    const politician = await db.politician.findFirst({
        where: {
            id: Number(polId),
        }
    })

    return (
        <pre>{JSON.stringify(politician, null, 4)}</pre>
    )
}