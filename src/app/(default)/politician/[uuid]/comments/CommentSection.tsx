'use client';

import { User, Politician, Comment } from '@prisma/client';
import { useEffect, useState } from 'react';
import { CommentWithNestedReplies } from './types';
import Toast from '@/app/components/Toast';
import DisplayComment from '@/app/(default)/politician/[uuid]/comments/DisplayComment';
import AddCommentEditor from '@/app/(default)/politician/[uuid]/comments/AddCommentEditor';
import Skeleton from 'react-loading-skeleton';

interface CommentsProps {
  currentUser: User | null;
  politician: Politician;
}

export default function CommentSection({
  currentUser,
  politician,
}: CommentsProps) {
  const [comments, setComments] = useState<CommentWithNestedReplies[]>([]);
  const [isFetchingComments, setIsFetchingComments] = useState<boolean>(true);
  const [showAddCommentEditor, setShowAddCommentEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Function used for fetching the top-level comments for the given politician */
  const fetchTopLevelComments = async () => {
    setIsFetchingComments(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/comments?polUuid=${politician.uuid}&parentId=null`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || 'Kommentare konnten nicht abgerufen werden'
        );
      }
    } catch (error) {
      console.error('Comments could not be retrieved: ', error);
      setError('Es gab ein Problem beim Abrufen der Kommentare.');
    } finally {
      setIsFetchingComments(false);
    }
  };

  /** Callback function given to AddCommentEditor that is called when a newComment has been added */
  const handleAddComment = (newComment: Comment) => {
    try {
      const newCommentUpdatedFormat: CommentWithNestedReplies = {
        ...newComment,
        user: currentUser!,
        replies: [],
      };
      setComments([newCommentUpdatedFormat, ...comments]);
      setShowAddCommentEditor(false);
    } catch (error) {
      console.error('Error occured while adding comment: ', error);
      setError('Es gab ein Problem beim Hinzufügen des Kommentars.');
    }
  };

  useEffect(() => {
    fetchTopLevelComments();
  }, []);

  return (
    <>
      {/* Display error if occuring */}
      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      {isFetchingComments ? (
        <>
          {/* Display Skeleton while loading the comments */}
          <Skeleton count={5} className={'h-14 mt-2'} />
        </>
      ) : (
        <>
          {!showAddCommentEditor ? (
            <>
              {/* Button for enabing AddComment-Editor */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
                onClick={() =>
                  currentUser
                    ? setShowAddCommentEditor(true)
                    : setError(
                        'Du musst angemeldet sein um einen Kommentar hinzufügen zu können!'
                      )
                }
              >
                Neuen Kommentar hinzufügen
              </button>
            </>
          ) : (
            <>
              {/* AddComment-Editor*/}
              <AddCommentEditor
                currentUser={currentUser}
                politician={politician}
                parent={null}
                onCloseEditor={() => setShowAddCommentEditor(false)}
                onAddComment={handleAddComment}
              />
            </>
          )}

          {/* Display comments (or 'No comments found') */}
          {comments.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">
              <p>
                Es wurden noch keine Kommentare für {politician.first_name}{' '}
                {politician.last_name} geschrieben.
              </p>
              <p>Sei der Erste und verfasse einen Kommentar!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <DisplayComment
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                politician={politician!}
              />
            ))
          )}
        </>
      )}
    </>
  );
}
