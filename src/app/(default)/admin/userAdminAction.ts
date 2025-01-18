'use server'

import {getUser} from "@/_actions/getUser";
import db from "@/_lib/db";

export async function makeUserAdminAction(userId: number) {
    const user = await getUser();
    if (!user?.isAdmin || user?.id === userId) {
        throw new Error("Permission denied!");
    }

    const userToUpdate = await db.user.findFirst({
        where: {
            id: userId,
        }
    });

    if (!userToUpdate) {
        throw new Error("User doesn't exist!");
    }

    await db.user.update({
        where: {
            id: userId,
        },
        data: {
            isAdmin: !userToUpdate.isAdmin
        }
    });
}

export async function deleteUserAction(userId: number) {
    const user = await getUser();
    if (!user?.isAdmin || user?.id === userId) {
        throw new Error("Permission denied!");
    }

    const userToDelete = await db.user.findFirst({
        where: {
            id: userId,
        }
    });

    if (!userToDelete) {
        throw new Error("User doesn't exist!");
    }

    await db.user.delete({
        where: {
            id: userId,
        },
    });
}