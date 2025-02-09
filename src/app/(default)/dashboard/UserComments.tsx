import { User, Comment, Politician } from '@prisma/client';
import db from '@/_lib/db';
import { GCS_AVATAR_URL_BASE } from '@/app/config';
import Link from 'next/link';
import Image from 'next/image';

export async function UserComments({ user }: { user: User }) {
  const comments = await db.comment.findMany({
    where: { userId: user.id },
    include: {
      politician: true,
    },
  });

  // group comments by politician
  const commentsByPolitician = comments.reduce(
    (acc, comment) => {
      const polUuid = comment.politician.uuid;
      if (!acc[polUuid]) {
        acc[polUuid] = {
          politician: comment.politician,
          comments: [],
        };
      }
      acc[polUuid].comments.push(comment);
      return acc;
    },
    {} as Record<string, { politician: Politician; comments: Comment[] }>
  );

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">
          Von dir verfasste Kommentare:
        </h1>

        {/* politician-blocks with comments */}
        {Object.values(commentsByPolitician).map(({ politician, comments }) => (
          <div
            key={politician.uuid}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-md mb-6 dark:bg-gray-900"
          >
            {/* politician info */}
            <Link
              href={`/politicians/${politician.uuid}`}
              className="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-md"
            >
              <Image
                src={`/pol_profile_img/${politician.profile_image}`}
                alt={`Bild von ${politician.first_name} ${politician.last_name}`}
                width={50}
                height={50}
                className="h-12 w-12 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
                {politician.first_name} {politician.last_name}
              </h2>
            </Link>

            {/* comments for that politician */}
            <div className="mt-4 mb-2 space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="ml-6 border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2"
                >
                  {/* comment header */}
                  <div className="flex items-center">
                    <img
                      src={`${GCS_AVATAR_URL_BASE}/${user.profile_image}`}
                      alt={'Avatar'}
                      width={28}
                      height={28}
                      className="rounded-full object-cover mr-2"
                    />
                    <strong className="dark:text-gray-200">
                      {user.firstName} {user.lastName}
                    </strong>
                    <span
                      className="text-gray-500 dark:text-gray-400 ml-2"
                      title={
                        comment.createdAt !== comment.updatedAt
                          ? `Zuletzt bearbeitet am ${new Intl.DateTimeFormat(
                              'de-DE',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            ).format(new Date(comment.updatedAt))}`
                          : ''
                      }
                    >
                      {new Intl.DateTimeFormat('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(comment.createdAt))}

                      {comment.createdAt.getTime() !==
                        comment.updatedAt.getTime() && (
                        <span className="ml-1">(bearbeitet)</span>
                      )}
                    </span>
                  </div>

                  {/* comment content */}
                  <p className="mt-1 dark:text-gray-200">
                    {comment.text.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
