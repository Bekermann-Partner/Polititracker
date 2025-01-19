'use client';

import { User } from '@prisma/client';
import React from 'react';
import {
  deleteUserAction,
  makeUserAdminAction,
} from '@/app/(default)/admin/userAdminAction';
import Toast from '@/app/components/Toast';

export function UserList({ defaultUsers }: { defaultUsers: User[] }) {
  const [users, setUsers] = React.useState<User[]>(defaultUsers);
  const [error, setError] = React.useState<string | null>(null);

  async function makeUserAdmin(userId: number) {
    try {
      await makeUserAdminAction(userId);
    } catch {
      setError("Failed to change this users' administration state");
      return;
    }

    setUsers(
      users.map((u) => ({
        ...u,
        isAdmin: u.id === userId ? !u.isAdmin : u.isAdmin,
      }))
    );
  }

  async function deleteUser(userId: number) {
    try {
      await deleteUserAction(userId);
    } catch {
      setError('Failed to delete this user');
      return;
    }

    setUsers(users.filter((u) => u.id !== userId));
  }

  return (
    <>
      {error && (
        <Toast
          message={'Error: ' + error}
          type={'error'}
          onClose={() => setError(null)}
        />
      )}

      <table className={'w-full'}>
        <thead className={'bg-gray-50'}>
          <tr>
            <th className={'py-3'}>ID</th>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Admin</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody className={'text-center'}>
          {users.map((user) => (
            <tr key={user.id} className={'hover:bg-gray-100'}>
              <td className={'py-3'}>{user.id}</td>
              <td>{user.firstName + ' ' + user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Ja' : 'Nein'}</td>
              <td>
                <button
                  className={
                    'bg-indigo-800 hover:bg-indigo-700 transition-colors text-white rounded px-3 py-1.5 ml-5'
                  }
                  onClick={() => makeUserAdmin(user.id)}
                >
                  Admin
                </button>
                <button
                  className={
                    'bg-red-800 hover:bg-red-700 transition-colors text-white rounded px-3 py-1.5 ml-5'
                  }
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
