import db from '@/_lib/db';
import {
  LoadingSideJobs,
  SideJobs,
} from '@/app/(default)/politician/[uuid]/SideJobs';
import React from 'react';
import {
  LoadingPoliticianDetails,
  PoliticianDetails,
} from '@/app/(default)/politician/[uuid]/PoliticianDetails';
import CommentSectionWrapper from '@/app/(default)/politician/[uuid]/comments/CommentSectionWrapper';
import PoliticianGraph from './PoliticianGraph';

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

export default async function PoliticianView({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const polId = (await params).uuid;
  const politician = await fetchPolitician(polId);

  const politicianNumericId = politician?.ext_abgeordnetenwatch_id;
  if (!politicianNumericId) {
    return <div>Politician not found or missing rating info.</div>;
  }

  return (
    <section className="pt-24">
      <div className="mx-auto max-w-6xl">
        <React.Suspense fallback={<LoadingPoliticianDetails />}>
          <PoliticianDetails politicianPromise={Promise.resolve(politician)} />
        </React.Suspense>

        <h1 className="mt-8 text-2xl font-semibold">Nebentätigkeiten:</h1>
        <React.Suspense fallback={<LoadingSideJobs />}>
          <SideJobs politicianPromise={Promise.resolve(politician)} />
        </React.Suspense>

        <h1 className="mt-8 text-2xl font-semibold">Kommentare:</h1>
        <CommentSectionWrapper
          politicianPromise={Promise.resolve(politician)}
        />

        {/*Graph inserted here*/}
        <React.Suspense fallback={<div>Loading Graph...</div>}>
          <PoliticianGraph politicianId={politicianNumericId} />
        </React.Suspense>
      </div>
    </section>
  );
}
