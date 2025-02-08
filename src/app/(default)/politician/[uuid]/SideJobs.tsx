import { Politician } from '@prisma/client';
import { SideJob } from '@/app/(default)/politician/[uuid]/SideJob';
import abgeordnetenWatchApiProvider from '@/_lib/providers/abgw/abgeordnetenWatchApiProvider';
import Skeleton from 'react-loading-skeleton';
import { SkeletonThemeWrapper } from '@/app/components/SkeletonThemeWrapper';

export async function SideJobs({
  politicianPromise,
}: {
  politicianPromise: Promise<Politician | null>;
}) {
  const politician = await politicianPromise;

  const mandates = await abgeordnetenWatchApiProvider.getCandidacyMandates(
    politician!.ext_abgeordnetenwatch_id
  );
  const sideJobs = await abgeordnetenWatchApiProvider.getSideJobsFromMandates(
    mandates.map((mandate) => mandate.id)
  );

  return (
    <>
      {sideJobs.length == 0 && (
        <div className={'dark:text-gray-300'}>
          Es wurden keine Nebentätigkeiten für {politician?.first_name}{' '}
          {politician?.last_name} gefunden.
        </div>
      )}

      {sideJobs.map((sidejob) => {
        return <SideJob key={sidejob.id} sidejob={sidejob} />;
      })}
    </>
  );
}

export function LoadingSideJobs() {
  return (
    <SkeletonThemeWrapper>
      <Skeleton count={5} className={'h-14 mt-2'} />
    </SkeletonThemeWrapper>
  );
}
