import db from '@/_lib/db';
import { User, Politician, Party } from '@prisma/client';

/**
 * Fetches all politicians followed by a specific user, including their party details.
 *
 * @param {User} user - The user whose followed politicians are to be fetched.
 * @returns {Promise<(Politician & { party: Party })[]>} - A list of politicians with their party details.
 */
export async function getFollowedPoliticians(
  user: User
): Promise<(Politician & { party: Party })[]> {
  const followedPoliticians = await db.follow.findMany({
    where: {
      userId: user.id,
    },
    include: {
      politician: {
        include: {
          party: true, // Include the Party relation
        },
      },
    },
  });

  return followedPoliticians.map((follow) => follow.politician);
}
