import db from "@/_lib/db";
import {UserList} from "@/app/(default)/admin/userList";

export default async function AdminPage() {
    const users = await db.user.findMany();

    return (
        <>
            <section className="pt-24">
                <div className="mx-auto max-w-6xl">
                    <h1 className={'text-3xl font-bold mb-5'}>Nutzerübersicht</h1>

                    <UserList defaultUsers={users}/>
                </div>
            </section>
        </>
    )
}