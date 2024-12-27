'use server'

import {Politician} from "@prisma/client";
import db from "@/_lib/db";

export async function findPolitician(query: string): Promise<Politician[]> {
    console.log(`Searching for politician by: ${query}`)

    return db.politician.findMany({});
}