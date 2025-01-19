'use client';

import { User, Politician, Comment } from '@prisma/client';
import { useState } from 'react';
import Toast from '@/app/components/Toast';

interface AddCommentEditorProps {
  currentUser: User | null;
  politician: Politician;
  parent: Comment | null;
  onCloseEditor: () => void; // Callback, to add newComment to list
  onAddComment: (newComment: Comment) => void; // Callback, to add newComment to list
}

export default function AddCommentEditor({
  currentUser,
  politician,
  parent,
  onCloseEditor,
  onAddComment,
}: AddCommentEditorProps) {
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the process of adding a new comment by sending a HTTP POST request
   * to add the comment in the backend.
   *
   * @throws Will set an error message if:
   *   - The user is not authenticated.
   *   - The comment text is empty
   *   - The server returns an error or the request fails.
   *
   * @returns {Promise<void>} This function does not return a value, but updates the UI
   *          with the new comment via the `onAddComment` callback on success.
   */
  const handleAddComment = async () => {
    if (!currentUser) {
      // would only be reachable if user signs off during edit (but we would redirect them anyway)
      setError(
        `Du musst eingeloggt sein um ${
          parent ? 'eine Antwort' : 'einen Kommentar'
        } verfassen zu können.`
      );
      return;
    }
    if (!newCommentText.trim()) {
      setError(
        `${parent ? 'Antworten' : 'Kommentare'} dürfen nicht leer sein.`
      );
      return;
    }

    setIsAddingComment(true);
    setError(null);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          polUuid: politician.uuid,
          text: newCommentText,
          parentId: parent ? parent.id : null,
        }),
      });

      if (response.ok) {
        const newComment: Comment = await response.json();
        setNewCommentText('');

        // Use callback function to add newComment to comment list
        onAddComment(newComment);
      } else {
        const errorData = await response.json();
        setError(
          `${
            parent ? 'Die Antwort' : 'Der Kommentar'
          } konnte nicht hinzugefügt werden. ${errorData.error || ''}`
        );
      }
    } catch (error) {
      console.error(
        `Error occured while adding ${parent ? 'reply' : 'comment'}: ${error}`
      );
      setError(
        `Es gab ein Problem beim Hinzufügen ${
          parent ? 'der Antwort' : 'des Kommentars'
        }: ${error}`
      );
    } finally {
      setIsAddingComment(false);
    }
  };

  return (
    <>
      {/* Display error if occuring */}
      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      {/* AddComment-Editor*/}
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
          placeholder={
            parent
              ? 'Verfasse deine Antwort...'
              : `Verfasse einen Kommentar zu ${politician.first_name} ${politician.last_name}...`
          }
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleAddComment}
          disabled={isAddingComment}
        >
          {parent ? 'Antwort ' : 'Kommentar '}
          {isAddingComment ? 'wird hinzugefügt...' : 'hinzufügen'}
        </button>
      </div>
    </>
  );
}
