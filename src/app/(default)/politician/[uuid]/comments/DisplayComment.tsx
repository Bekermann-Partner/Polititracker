'use client';

import { useState } from 'react';
import { Comment, Politician, User } from '@prisma/client';
import { CommentWithNestedReplies } from '@/app/(default)/politician/[uuid]/comments/types';
import Toast from '@/app/components/Toast';
import Skeleton from 'react-loading-skeleton';
import AddCommentEditor from '@/app/(default)/politician/[uuid]/comments/AddCommentEditor';
import UpdateCommentEditor from '@/app/(default)/politician/[uuid]/comments/UpdateCommentEditor';

interface DisplayCommentProps {
  currentUser: User | null;
  politician: Politician;
  comment: CommentWithNestedReplies;
}

export default function DisplayComment({
  currentUser,
  politician,
  comment,
}: DisplayCommentProps) {
  const [currentComment, setCurrentComment] =
    useState<CommentWithNestedReplies>(comment);
  const [replies, setReplies] = useState<CommentWithNestedReplies[]>(
    comment.replies
  );
  const [showReplies, setShowReplies] = useState(false);
  const [isFetchingReplies, setIsFetchingReplies] = useState(false);
  const [showAddReplyEditor, setShowAddReplyEditor] = useState(false);
  const [showUpdateCommentEditor, setShowUpdateCommentEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all replies to this comment (including author and their replies). This function is needed because:
   * - we do not want to load ALL of the comments and replies recursively at the start (to safe ressources)
   * - addding a newReply only updates the direct parent => the newReply would be lost until page refresh after hiding replies on a parent further up in the hierarchy
   *
   * => call function after every click on 'show replies' to reload the replies
   */
  const fetchAllReplies = async () => {
    setIsFetchingReplies(true);
    try {
      const response = await fetch(
        `/api/comments?parentId=${currentComment.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setReplies(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Antworten konnten nicht abgerufen werden');
      }
    } catch (error) {
      console.error('Kommentare konnten nicht abgerufen werden: ', error);
      setError('Es gab ein Problem beim Abrufen der Kommentare');
    }
    setIsFetchingReplies(false);
  };

  const toggleReplies = async () => {
    if (!showReplies) {
      await fetchAllReplies();
    }
    setShowReplies(!showReplies);
  };

  /** Callback function given to AddCommentEditor that is called when a newReply has been added */
  const handleAddReply = (newComment: Comment) => {
    try {
      const newReplyUpdatedFormat: CommentWithNestedReplies = {
        ...newComment,
        user: currentUser!,
        replies: [],
      };
      setReplies([newReplyUpdatedFormat, ...replies]);
      setShowAddReplyEditor(false);
    } catch (error) {
      console.error('Error occured while adding reply: ', error);
      setError('Es gab ein Problem beim Hinzufügen der Antwort.');
    }
  };

  /** Callback function given to UpdateCommentEditor that is called when the Comment is updated */
  const handleUpdateComment = (updatedComment: Comment) => {
    try {
      const updatedCommentUpdatedFormat: CommentWithNestedReplies = {
        ...updatedComment,
        user: currentUser!,
        replies: replies,
      };
      setCurrentComment(updatedCommentUpdatedFormat);
      setShowUpdateCommentEditor(false);
    } catch (error) {
      console.error('Error occured while updating comment: ', error);
      setError('Es gab ein Problem beim Aktualisieren des Kommentars.');
    }
  };

  return (
    <div className="mb-4">
      {/* Display error if occuring */}
      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      {showUpdateCommentEditor ? (
        <UpdateCommentEditor
          comment={currentComment}
          currentUser={currentUser!}
          onCloseEditor={() => setShowUpdateCommentEditor(false)}
          onUpdateComment={handleUpdateComment}
        />
      ) : (
        <>
          {/* Display the Comment */}
          <div className="p-4 border rounded shadow-sm">
            <div className="flex">
              <strong>
                {currentComment.user.firstName} {currentComment.user.lastName}
              </strong>
              <span
                className="text-gray-500 ml-2"
                title={
                  currentComment.createdAt !== currentComment.updatedAt
                    ? `Zuletzt bearbeitet am ${new Intl.DateTimeFormat(
                        'de-DE',
                        {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      ).format(new Date(currentComment.updatedAt))}`
                    : ''
                }
              >
                {new Intl.DateTimeFormat('de-DE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(currentComment.createdAt))}

                {currentComment.createdAt !== currentComment.updatedAt && (
                  <span className="ml-1">(bearbeitet)</span>
                )}
              </span>

              {/* Button for enabing UpdateComment-Editor */}
              {currentUser && (
                <div className="ml-auto">
                  <button
                    className="flex items-center text-sm text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => setShowUpdateCommentEditor(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232a1.5 1.5 0 112.12 2.12L6.621 18.082a4.5 4.5 0 01-1.496 1.11l-2.294.958.958-2.294a4.5 4.5 0 011.11-1.496L15.232 5.232z"
                      />
                    </svg>
                    Bearbeiten
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2">
              {currentComment.text // TODO: kann man sicher schöner umsetzen (aktuell ein bisschen cursed, wenn man den Text markiert)
                .split('\n')
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
            </p>

            <div className="flex items-center mt-4 space-x-4">
              {/* "Show replies"-Button */}
              {replies.length > 0 && (
                <button
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  onClick={toggleReplies}
                  disabled={isFetchingReplies}
                >
                  {isFetchingReplies ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Lade Antworten...
                    </>
                  ) : showReplies ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                      Antworten ausblenden
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                      Antworten anzeigen ({replies.length})
                    </>
                  )}
                </button>
              )}

              {/* Button for enabing AddReply-Editor */}
              <button
                className="flex items-center text-sm text-gray-500 hover:text-black focus:outline-none"
                onClick={() =>
                  currentUser
                    ? setShowAddReplyEditor(true)
                    : setError(
                        'Du musst angemeldet sein um auf einen Kommentar antworten zu können!'
                      )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="h-5 w-5 mr-2"
                >
                  <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                </svg>
                Antworten
              </button>
            </div>
          </div>
        </>
      )}

      <div className="ml-6 mt-4">
        {/* AddReply-Editor*/}
        {showAddReplyEditor && (
          <AddCommentEditor
            currentUser={currentUser}
            politician={politician}
            parent={currentComment}
            onCloseEditor={() => setShowAddReplyEditor(false)}
            onAddComment={handleAddReply}
          />
        )}

        {/* Display Skeleton while (re-)loading the replies */}
        {isFetchingReplies && (
          <Skeleton count={replies.length} className={'h-14 mt-2'} />
        )}

        {/* Show Replies */}
        {showReplies && (
          <>
            {replies.length > 0 ? (
              replies.map((reply) => (
                <DisplayComment
                  key={reply.id}
                  currentUser={currentUser}
                  politician={politician}
                  comment={reply}
                />
              ))
            ) : (
              <p>Keine Antworten gefunden</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
