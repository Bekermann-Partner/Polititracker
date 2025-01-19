import {Party, Politician, User} from '@prisma/client';
import {getFollowedPoliticians} from "@/_actions/getFollowedPoliticians";
import PoliticianCard from "@/app/components/PoliticianCard";

export async function FollowedPoliticians({user}: { user: User }) {
    try {
        const politicians: (Politician & { party: Party })[] =
            await getFollowedPoliticians(user);

        return (
            <>
                <section className="pt-10">
                    <div className="mx-auto max-w-6xl">
                        {politicians.length > 0 ? (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">
                                    Politiker, denen du folgst:
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
                            <div>Du folgst noch keinen Politikern</div>
                        )}
                    </div>
                </section>
            </>
        );
    } catch (error) {
        console.error('Error fetching followed politicians:', error);

        return (
            <section className="pt-24">
                <div className="mx-auto max-w-6xl">
                    <div className="text-2xl font-bold mb-6">
                        Deine gefolgten Politiker konnten nicht abgerufen werden
                        -_-
                    </div>
                </div>
            </section>
        );
    }
}