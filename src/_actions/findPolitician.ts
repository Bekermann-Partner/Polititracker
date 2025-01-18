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

    const politicianSearch = politicians.map(p => ({
        full_name: p.first_name + " " + p.last_name,
        party: p.party.short,
        orig: p
    }));

    const fuse = new Fuse(politicianSearch, {
        keys: ['full_name', 'party'],
        isCaseSensitive: false,
        shouldSort: true,
        includeScore: true,
        threshold: 0.3
    });

    return fuse.search(query, {limit: 5}).map(result => result.item.orig);
}