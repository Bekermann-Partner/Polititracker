'use server'

import db from "@/_lib/db";
import Fuse from "fuse.js";

export async function findPolitician(query: string) {
    console.log(`Searching for politician by: ${query}`)

    const politicians = await db.politician.findMany({
        include: {
            party: true
        }
    });

    const fuse = new Fuse(politicians, {
        keys: ['first_name', 'last_name'],
        isCaseSensitive: false,
        shouldSort: true,
        includeScore: true,
        threshold: 0.3
    });

    return fuse.search(query, {limit: 5}).map(result => result.item);
}