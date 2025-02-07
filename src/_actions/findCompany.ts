'use server';

import db from '@/_lib/db';
import Fuse from 'fuse.js';

export interface Company {
  id: number;
  name: string;
  image: string;
}

export async function findCompany(query: string): Promise<Company[]> {
  console.log(`Searching for company by: ${query}`);
  const companies = await db.company.findMany();
  const companySearch = companies.map((c) => ({
    name: c.name,
    orig: c,
  }));
  const fuse = new Fuse(companySearch, {
    keys: ['name'],
    isCaseSensitive: false,
    shouldSort: true,
    includeScore: true,
    threshold: 0.3,
  });
  return fuse.search(query, { limit: 5 }).map((result) => result.item.orig);
}
