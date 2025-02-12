import db from '@/_lib/db';
import {
  LoadingSideJobs,
  SideJobs,
} from '@/app/(default)/politicians/[uuid]/SideJobs';
import React from 'react';
import {
  LoadingPoliticianDetails,
  PoliticianDetails,
} from '@/app/(default)/politicians/[uuid]/PoliticianDetails';
import CommentSectionWrapper from '@/app/(default)/politicians/[uuid]/comments/CommentSectionWrapper';
import PoliticianGraph from './PoliticianGraph';

async function fetchPolitician(uuid: string) {
  const politician = db.politician.findFirst({
    where: {
      uuid,
    },
    include: {
      party: true,
    },
  });

  if (!politician) return null;

  // increment click_count by one
  await db.politician.update({
    where: { uuid },
    data: {
      click_count: {
        increment: 1,
      },
    },
  });

  return politician;
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
    <section className={'mt-10'}>
      <div className="mx-auto max-w-6xl">
        <React.Suspense fallback={<LoadingPoliticianDetails />}>
          <PoliticianDetails politicianPromise={Promise.resolve(politician)} />
        </React.Suspense>

        <h1 className="mt-8 text-2xl dark:text-white font-semibold">
          Nebentätigkeiten:
        </h1>
        <React.Suspense fallback={<LoadingSideJobs />}>
          <SideJobs politicianPromise={Promise.resolve(politician)} />
        </React.Suspense>

        <h1 className="mt-8 text-2xl dark:text-white font-semibold">
          Kommentare:
        </h1>
        <CommentSectionWrapper
          politicianPromise={Promise.resolve(politician)}
        />

        {/*Graph inserted here*/}
        <React.Suspense
          fallback={<div className="dark:text-white ">Loading Graph...</div>}
        >
          <PoliticianGraph politicianId={politicianNumericId} />
        </React.Suspense>
      </div>
    </section>
  );
}
