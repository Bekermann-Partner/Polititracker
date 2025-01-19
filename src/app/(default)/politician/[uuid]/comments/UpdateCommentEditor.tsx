'use client';

import { User, Comment } from '@prisma/client';
import { useState } from 'react';
import Toast from '@/app/components/Toast';

interface UpdateCommentEditorProps {
  comment: Comment;
  currentUser: User;
  onCloseEditor: () => void; // Callback, to add newComment to list
  onUpdateComment: (newComment: Comment) => void; // Callback, to add newComment to list
}

export default function UpdateCommentEditor({
  comment,
  currentUser,
  onCloseEditor,
  onUpdateComment,
}: UpdateCommentEditorProps) {
  const originalCommentText = comment.text;

  const [newCommentText, setNewCommentText] = useState<string>(comment.text);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (comment.userId !== currentUser.id) {
    console.error(
      `No permission to edit comment: comment.userId (${comment.userId}) doesn't match currentUser.id (${currentUser.id})`
    );
    return;
  }

  /**
   * Handles the process of updating an existing comment by sending a HTTP PUT request
   * to update the comment in the backend.
   *
   * @throws Will set an error message if:
   *   - The user is not authenticated.
   *   - The updated comment text is empty or identical to the original.
   *   - The server returns an error or the request fails.
   *
   * @returns {Promise<void>} This function does not return a value, but updates the UI
   *          with the new comment via the `onUpdateComment` callback on success.
   */
  const handleUpdateComment = async () => {
    if (!currentUser) {
      // would only be reachable if user signs off during edit (but we would redirect them anyway)
      setError(
        `Du musst eingeloggt sein um diesen Kommentar bearbeiten zu können.`
      );
      return;
    }
    if (!newCommentText.trim()) {
      setError('Kommentare dürfen nicht leer sein.');
      return;
    }
    if (newCommentText.trim() === originalCommentText) {
      setError('Aktualisierter Kommentar entspricht der alten Version.');
      return;
    }

    setIsUpdatingComment(true);
    setError(null);
    try {
      const response = await fetch(`/api/comments?commentId=${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newCommentText,
        }),
      });

      if (response.ok) {
        const newComment: Comment = await response.json();
        setNewCommentText('');

        // Use callback function to display updated Comment
        onUpdateComment(newComment);
      } else {
        const errorData = await response.json();
        setError(
          `Der Kommentar konnte nicht aktualisiert werden. ${
            errorData.error || ''
          }`
        );
      }
    } catch (error) {
      console.error(`Error occured while updating comment: ${error}`);
      setError(
        `Es gab ein Problem beim Aktualisieren des Kommentars: ${error}`
      );
    } finally {
      setIsUpdatingComment(false);
    }
  };

  return (
    <>
      {/* Display error if occuring */}
      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      {/* Comment-Editor */}
      <div className="border border-gray-300 rounded bg-gray-50 shadow-sm p-4 mb-4">
        <div className="flex">
          {currentUser && (
            <strong>
              {currentUser.firstName} {currentUser.lastName}
            </strong>
          )}

          <button
            className="text-red-500 hover:text-red-700 focus:outline-none ml-auto"
            onClick={onCloseEditor}
          >
            Abbrechen
          </button>
        </div>

        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="w-full border rounded p-2 mt-2"
          placeholder="Passe deinen Kommentar an..."
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleUpdateComment}
          disabled={isUpdatingComment}
        >
          {parent ? 'Antwort ' : 'Kommentar '}
          {isUpdatingComment ? 'wird hinzugefügt...' : 'hinzufügen'}
        </button>
      </div>
    </>
  );
}
