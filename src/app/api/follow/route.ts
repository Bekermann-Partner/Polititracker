import { NextResponse } from 'next/server';
import db from '@/_lib/db';

/**
 * GET API endpoint to check if the user is following a politician.
 *
 * This endpoint checks whether a user is following a politician based on
 * the provided userId and polId. It returns a boolean indicating the follow
 * status of the user.
 *
 * @param {Request} request - The incoming request.
 * @returns {NextResponse} - A JSON response with the follow status.
 */
export async function GET(request: Request) {
    console.log("Got Follow Request");

    // Get userId and polId from URL parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const polId = url.searchParams.get('polId');
    if (!userId || !polId) {
        return NextResponse.json(
            { error: 'Missing userId or polId' },
            { status: 400 }
        );
    }

    try {
        // Check if the user is following the politician
        const entry = await db.follow.findUnique({
            where: {
                userId_polUuid: {
                    userId: Number(userId),
                    polUuid: polId,
                },
            },
        });

        const isFollowed = entry !== null;

        return NextResponse.json({ isFollowed });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json(
                { error: 'Unknown error' },
                { status: 500 }
            );
        }
    }
}

/**
 * POST API endpoint to toggle the follow status of a user on a politician.
 *
 * This endpoint checks if the user is already following the politician. If the user
 * is already following, it deletes the follow entry (unfollows the politician). If
 * the user is not following, it creates a follow entry (follows the politician).
 *
 * @param {Request} request - The incoming request.
 * @returns {NextResponse} - A JSON response with the updated follow status.
 */
export async function POST(request: Request) {
    console.log("Got Toggle Follow Request");
    
    // Get userId and polId from URL parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const polId = url.searchParams.get('polId');
    if (!polId || !userId) {
        return NextResponse.json(
            { error: 'Missing userId or polId' },
            { status: 400 }
        );
    }

    try {
        // Check if the user is already following the politician
        const existingFollow = await db.follow.findUnique({
            where: {
                userId_polUuid: {
                    userId: Number(userId),
                    polUuid: polId,
                },
            },
        });

        if (existingFollow) {
            // If the user is already following, remove the follow entry (unfollow)
            await db.follow.delete({
                where: {
                    userId_polUuid: {
                        userId: Number(userId),
                        polUuid: polId,
                    },
                },
            });
            console.log("User with id " + userId + " is no longer following politician with id " + polId)
            return NextResponse.json({ isFollowed: false });
        } else {
            // If the user is not following, add a new follow entry (follow)
            await db.follow.create({
                data: {
                    userId: Number(userId),
                    polUuid: polId,
                },
            });
            console.log("User with id " + userId + " is now following politician with id " + polId)
            return NextResponse.json({ isFollowed: true });
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json(
                { error: 'Unknown error' },
                { status: 500 }
            );
        }
    }
}
