import { SidejobData } from '@/_lib/providers/abgw/types';

export function SideJob({ sidejob }: { sidejob: SidejobData }) {
  if (sidejob.sidejob_organization.label.endsWith(',')) {
    sidejob.sidejob_organization.label =
      sidejob.sidejob_organization.label.substring(
        0,
        sidejob.sidejob_organization.label.length - 1
      );
  }

  return (
    <div
      className={
        'w-full border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded mt-2 p-2 shadow'
      }
    >
      <div className={'flex justify-between'}>
        <div>
          <h3 className={'font-semibold dark:text-gray-100'}>
            {sidejob.sidejob_organization.label}
            {(sidejob.field_topics?.length ?? 0) > 0 && (
              <span
                className={
                  'text-gray-500 dark:text-gray-400 font-normal ml-2 mr-1'
                }
              >
                &bull; {sidejob.field_topics?.map((t) => t.label).join(', ')}
              </span>
            )}
          </h3>
          <h4 className={'text-gray-500 dark:text-gray-400'}>
            {sidejob.label}
          </h4>
        </div>
        <div className={'my-auto'}>
          {sidejob.label.toLowerCase().includes('bis') && (
            <span
              className={
                'bg-red-100 dark:bg-red-800 dark:text-white px-2 py-0.5 rounded-xl font-normal mt-auto h-full'
              }
            >
              Nicht Aktiv
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
