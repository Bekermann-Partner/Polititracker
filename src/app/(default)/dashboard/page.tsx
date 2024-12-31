import { User, Politician, Party } from '@prisma/client';
import { getUser } from '@/_actions/getUser';
import { getFollowedPoliticians } from '@/_actions/getFollowedPoliticians';
import PoliticianCard from '@/app/components/PoliticianCard';

export default async function DashboardPage() {
    const user: User | null = await getUser();

    if (!user) {
        return (
            <section className="pt-24">
                <div className="mx-auto max-w-6xl">
                    <div className="text-2xl font-bold mb-6">
                        Please sign in to access your followed politicians.
                    </div>
                </div>
            </section>
        );
    }

    try {
        const politicians: (Politician & { party: Party })[] = await getFollowedPoliticians(user);

        return (
            <section className="pt-24">
                <div className="mx-auto max-w-6xl">
                    {politicians.length > 0 ? (
                        <div>
                            <h1 className="text-2xl font-bold mb-6">
                                Your Followed Politicians
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {politicians.map((politician) => (
                                    <PoliticianCard
                                        key={politician.uuid}
                                        politician={politician}
                                        party={politician.party}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>You are not following any politicians.</div>
                    )}
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error fetching followed politicians:', error);

        return (
            <section className="pt-24">
                <div className="mx-auto max-w-6xl">
                    <div className="text-2xl font-bold mb-6">
                        An error occurred while fetching your followed
                        politicians -_-
                    </div>
                </div>
            </section>
        );
    }
}
