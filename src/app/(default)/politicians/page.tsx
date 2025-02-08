import db from '@/_lib/db';
import Image from 'next/image';
import Link from 'next/link';

export default async function LandingPage() {
  const topClickedPoliticians = await db.politician.findMany({
    include: {
      party: true,
    },
    orderBy: { click_count: 'desc' },
    take: 5,
  });

  const topCommentedPoliticians = await db.politician.findMany({
    include: {
      _count: {
        select: { comments: true },
      },
      party: true,
    },
    orderBy: {
      comments: { _count: 'desc' },
    },
    take: 5,
  });

  return (
    <section className="pt-24 mb-4">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold dark:text-white">Politiker Insights</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Welche Politiker werden am häufigsten abgerufen? Welche erhalten die
            meisten Kommentiert?
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Finde es heraus!</p>
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Most Commented Politicians */}
          <section>
            <h2 className="text-2xl dark:text-white font-semibold mb-4">
              🔥 Am meisten kommentiert
            </h2>
            <div className="space-y-4">
              {topCommentedPoliticians.map((pol) => (
                <Link href={`/politicians/${pol.uuid}`} key={pol.uuid}>
                  <div className="border rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-all duration-200 dark:bg-gray-900 hover:dark:bg-gray-800 dark:border-gray-700 mb-4">
                    <Image
                      src={`/pol_profile_img/${pol.profile_image}`}
                      alt={`picture_${pol.first_name}_${pol.last_name}`}
                      width={150}
                      height={150}
                      className="h-36 w-36 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-400">{`${pol.first_name} ${pol.last_name}`}</h2>
                      {pol.party && (
                        <p className="text-sm text-gray-500">{`Partei: ${pol.party.short}`}</p>
                      )}
                      {pol.occupation && (
                        <p className="text-sm text-gray-500">{`Tätigkeit: ${pol.occupation}`}</p>
                      )}

                      <p className="mt-2 dark:text-gray-400">Kommentare: {pol._count.comments}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Most Clicked Politicians */}
          <section>
            <h2 className="text-2xl dark:text-white font-semibold mb-4">
              📊 Am meisten aufgerufen
            </h2>
            <div className="space-y-4">
              {topClickedPoliticians.map((pol) => (
                <Link href={`/politicians/${pol.uuid}`} key={pol.uuid}>
                  <div className="border rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-all duration-200 dark:bg-gray-900 hover:dark:bg-gray-800 dark:border-gray-700 mb-4">
                    <Image
                      src={`/pol_profile_img/${pol.profile_image}`}
                      alt={`picture_${pol.first_name}_${pol.last_name}`}
                      width={150}
                      height={150}
                      className="h-36 w-36 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-400">{`${pol.first_name} ${pol.last_name}`}</h2>
                      {pol.party && (
                        <p className="text-sm text-gray-500">{`Partei: ${pol.party.short}`}</p>
                      )}
                      {pol.occupation && (
                        <p className="text-sm text-gray-500">{`Tätigkeit: ${pol.occupation}`}</p>
                      )}

                      <p className="mt-2 dark:text-gray-400">Aufrufe: {pol.click_count}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
