import {Party, Politician} from "@prisma/client";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import FollowToggle from "@/app/components/FollowToggle";
import {getUser} from "@/_actions/getUser";
import {SkeletonThemeWrapper} from "@/app/components/SkeletonThemeWrapper";

export async function PoliticianDetails({politicianPromise}: {
    politicianPromise: Promise<Politician & { party?: Party } | null>
}) {
    const politician = await politicianPromise;

    const user = await getUser();

    let age = -1;

    if (politician?.birth_year && politician.birth_year !== -1) {
        const date = new Date().getUTCFullYear();
        age = date - politician.birth_year;
    }

    return (
        <div className={"flex flex-row"}>
            <div className={"h-32 w-32 rounded-xl overflow-hidden"}>
                <Image
                    src={`/pol_profile_img/${politician?.profile_image}`}
                    alt={"a"}
                    width={150}
                    height={150}
                    className={"h-full w-auto object-cover"}
                />
            </div>
            <div className={"w-full ml-6"}>
                <div className="flex justify-between">
                    <div>
                        <h1 className={"text-3xl text-gray-950 font-semibold dark:text-white"}>
                            {politician?.field_title} {politician?.first_name} {politician?.last_name}
                        </h1>
                        <h2 className={"text-xl text-gray-600 dark:text-gray-300"}>{politician?.occupation}</h2>
                    </div>

                    <FollowToggle user={user} polId={politician?.uuid ?? ""}/>
                </div>

                <div className={"border-b mt-2 mb-2 border-b-gray-300 dark:border-b-gray-600"}></div>

                <h2 className={"text-gray-600 dark:text-gray-400"}>
                    {politician?.party?.long}{" "}
                    {politician?.party?.long !== politician?.party?.short
                        ? `(${politician?.party?.short})`
                        : ""}
                </h2>

                {age !== -1 && (
                    <h2 className={"text-gray-600 dark:text-gray-400"}>
                        {age} Jahre alt (geb. {politician?.birth_year})
                    </h2>
                )}
            </div>
        </div>
    );
}

export function LoadingPoliticianDetails() {
    return (
        <div className={"flex flex-row"}>
            <SkeletonThemeWrapper>
                <div className={"h-32 w-32 rounded-xl overflow-hidden"}>
                    <Skeleton width={150} height={150} className={"h-full w-auto object-cover dark:bg-gray-600"}/>
                </div>
                <div className={"w-full ml-6"}>
                    <div className="flex justify-between">
                        <div>
                            <Skeleton width={300} height={36}/>
                            <Skeleton width={400} height={28}/>
                        </div>
                    </div>

                    <div className={"border-b mt-2 mb-2 border-b-gray-300 dark:border-b-gray-600"}></div>

                    <h2 className={"text-gray-600"}>
                        <Skeleton count={2} width={200}/>
                    </h2>
                </div>
            </SkeletonThemeWrapper>
        </div>
    )
}