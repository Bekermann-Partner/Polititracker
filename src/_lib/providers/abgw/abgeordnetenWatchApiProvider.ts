import {
  MandateResponse,
  MandateData,
  SidejobData,
  SidejobResponse,
} from '@/_lib/providers/abgw/types';

async function getCandidacyMandates(polId: number): Promise<MandateData[]> {
  const res: MandateResponse = await fetch(
    `https://www.abgeordnetenwatch.de/api/v2/candidacies-mandates?politician=${polId}&type=mandate`
  ).then((res) => res.json());
  if (res.meta.status != 'ok') {
    return [];
  }

  return res.data;
}

async function getSideJobsFromMandates(
  mandates: number[]
): Promise<SidejobData[]> {
  const res: SidejobResponse = await fetch(
    `https://www.abgeordnetenwatch.de/api/v2/sidejobs?mandates[in]=[${mandates.join(',')}]`
  ).then((res) => res.json());
  if (res.meta.status != 'ok') {
    return [];
  }

  return res.data;
}

const abgeordnetenWatchApiProvider = {
  getCandidacyMandates,
  getSideJobsFromMandates,
};

export default abgeordnetenWatchApiProvider;
