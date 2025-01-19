import { User } from '@prisma/client';
import db from '@/_lib/db';
import Image from 'next/image';

export async function UserComments({ user }: { user: User }) {
  const comments = await db.comment.findMany({
    where: { userId: user.id },
  });

  return (
    <>
      <section className="pt-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">
            Von dir verfasste Kommentare:
          </h1>

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="w-full border border-gray-200 rounded mt-4 p-2 shadow text-lg dark:bg-gray-900 dark:border-gray-700"
            >
              <div className="flex">
                <Image
                  src={`/user_avatars/${user.profile_image}`}
                  alt={'Avatar'}
                  width={28}
                  height={28}
                  className={'rounded-full object-cover aspect-square mr-2'}
                />
                <strong className={'dark:text-gray-200'}>
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
              <p className="mt-2 dark:text-gray-200">
                {comment.text // TODO: kann man sicher schöner umsetzen (aktuell ein bisschen cursed, wenn man den Text markiert)
                  .split('\n')
                  .map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
