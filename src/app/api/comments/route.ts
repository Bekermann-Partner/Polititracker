import { NextRequest, NextResponse } from 'next/server';
import db from '@/_lib/db';

/**
 * Handles GET requests to retrieve comments and all their replies based on the provided query parameters.
 *
 * Query Parameters:
 * - `polUuid` (optional): The UUID of the politician whose comments are being fetched.
 * - `userId` (optional): The ID of the user whose comments are being fetched.
 * - `parentId` (optional): The ID of the parent comment to fetch replies to a specific comment.
 *   Use "null" explicitly to fetch top-level comments (comments without a parent).
 *
 * If invalid or missing parameters are provided, the response will contain an error message.
 *
 * Response:
 * - 200 OK with a list of comments if successful.
 * - 400 Bad Request if any parameters are invalid.
 * - 500 Internal Server Error if an error occurs while fetching comments.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const polUuid = searchParams.get('polUuid');
  const userIdString = searchParams.get('userId');
  const parentIdString = searchParams.get('parentId');

  // try parsing params
  const userId = userIdString ? parseInt(userIdString, 10) : NaN;
  const parentId =
    parentIdString && parentIdString !== 'null'
      ? parseInt(parentIdString, 10)
      : null;

  // validate parsing of params
  const parseErrors = [];
  if (userIdString && isNaN(userId)) {
    parseErrors.push('Invalid userId: must be a valid Integer');
  }
  if (parentIdString && parentIdString !== 'null' && isNaN(parentId!)) {
    parseErrors.push('Invalid parentId: must be a valid Integer or "null"');
  }

  // Return errors if there are invalid parameters
  if (parseErrors.length > 0) {
    return NextResponse.json({ error: parseErrors }, { status: 400 });
  }

  try {
    const comments = await db.comment.findMany({
      where: {
        // filter by all given params
        ...(polUuid && { polUuid }),
        ...(userIdString && { userId }),
        ...(parentIdString && { parentId }),
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        {
          replies: {
            _count: 'desc',
          },
        },
        {
          updatedAt: 'desc',
        },
      ],
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error occured while fetching comments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to create a new comment.
 *
 * Request Body:
 * - `userId`: The ID of the user creating the comment (required).
 * - `polUuid`: The UUID of the politician the comment relates to (required).
 * - `text`: The content of the comment (required).
 * - `parentId` (optional): The ID of the parent comment if this is a reply. Defaults to null if not provided.
 *
 * Response:
 * - 201 Created with the new comment object if successful.
 * - 400 Bad Request if any required fields are missing.
 * - 500 Internal Server Error if an error occurs while creating the comment.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, polUuid, text, parentId } = body;

  if (!text || !userId || !polUuid) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const newComment = await db.comment.create({
      data: {
        userId,
        polUuid,
        text,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error occured while trying to add new comment:', error);
    return NextResponse.json(
      { error: 'Comment could not be created' },
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to update an existing comment.
 *
 * Query Parameters:
 * - `commentId`: The ID of the comment to update (required).
 *
 * Request Body:
 * - `text`: The updated text for the comment (required).
 *
 * Response:
 * - 200 OK with the updated comment object if successful.
 * - 400 Bad Request if the `commentId` is invalid or `text` is missing.
 * - 500 Internal Server Error if an error occurs while updating the comment.
 */
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentIdString = searchParams.get('commentId');

  if (!commentIdString || isNaN(parseInt(commentIdString, 10))) {
    return NextResponse.json(
      { error: 'Invalid or missing commentId' },
      { status: 400 }
    );
  }

  const commentId = parseInt(commentIdString, 10);
  const body = await req.json();

  const { text } = body;
  if (!text) {
    return NextResponse.json(
      { error: 'Text field is required' },
      { status: 400 }
    );
  }

  try {
    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: {
        text,
        updatedAt: new Date(), // update 'updatedAt'
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error('Error occurred while updating comment:', error);
    return NextResponse.json(
      { error: 'Comment could not be updated' },
      { status: 500 }
    );
  }
}

/*
 * TODO: Do we even want to allow users to delete their comments?
 * This would mess with answers to that comment, but we could add a 'deleted' comment
 * which retains all of the replies and simply says that this comment was deleted
 */

/**
 * Handles DELETE requests to remove a comment.
 *
 * Query Parameters:
 * - `commentId`: The ID of the comment to delete (required).
 *
 * Response:
 * - 200 OK with a success message if the comment is deleted successfully.
 * - 400 Bad Request if the `commentId` is invalid or missing.
 * - 500 Internal Server Error if an error occurs while deleting the comment.
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentIdString = searchParams.get('commentId');

  if (!commentIdString || isNaN(parseInt(commentIdString, 10))) {
    return NextResponse.json(
      { error: 'Invalid or missing commentId' },
      { status: 400 }
    );
  }

  const commentId = parseInt(commentIdString, 10);

  try {
    await db.comment.delete({
      where: { id: commentId },
    });
    // TODO: update 'parent‘ and ‘replies‘ for other comments?

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error occurred while deleting comment:', error);
    return NextResponse.json(
      { error: 'Comment could not be deleted' },
      { status: 500 }
    );
  }
}
