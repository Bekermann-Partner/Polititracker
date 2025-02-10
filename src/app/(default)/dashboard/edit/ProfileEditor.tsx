'use client';

import Toast from '@/app/components/Toast';
import { User } from '@prisma/client';
import { useState } from 'react';
import { editUser } from '@/app/(default)/dashboard/edit/editUserAction';
import { GCS_AVATAR_URL_BASE } from '@/app/config';

export default function ProfileEditor({ user }: { user: User }) {
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [email, setEmail] = useState<string>(user.email);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    `${GCS_AVATAR_URL_BASE}/${user.profile_image}`
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setError(null);
    e.preventDefault();

    // check if any value was changed
    if (
      firstName === user.firstName &&
      lastName === user.lastName &&
      email === user.email &&
      uploadedImage === null &&
      newPassword.trim() === ''
    ) {
      setError(
        'Die eingegebenen Daten stimmen mit den alten Daten überein. Keine Änderung notwendig.'
      );
      return;
    }

    // some validations in case a new password is provided
    if (newPassword.trim() !== '') {
      if (oldPassword.trim() === newPassword.trim()) {
        setError(
          'Neues Passwort kann nicht mit dem alten Passwort übereinstimmen.'
        );
        return;
      }
      if (newPassword.trim() !== confirmPassword.trim()) {
        setError(
          'Das neue Passwort und dessen Bestätigung stimmen nicht überein.'
        );
        return;
      }
    }

    const formData = new FormData(e.currentTarget);

    setLoading(true);
    const res = await editUser(formData);
    setLoading(false);
    if (!res) {
      // Failed to get user with these credentials
      setError('Failed to get user with these credentials!');
      return;
    }

    if (res instanceof Error) {
      // Validation failed
      console.error('Failed validation!', res);
      return;
    }
  }

  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        {error && (
          <Toast message={error} type="error" onClose={() => setError(null)} />
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* User Profile */}
          <div className="border rounded-lg shadow-md p-4 duration-200 dark:bg-gray-900 dark:border-gray-700">
            <h2 className="font-bold dark:text-white">
              Nutzerprofil
              <hr className="mt-1 dark:border-gray-500" />
            </h2>

            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                {/* Display current image */}
                <img
                  src={previewImage}
                  alt="Profilbild"
                  width={150}
                  height={150}
                  className="rounded-full object-cover aspect-square mt-4 mb-4"
                />

                {/* Bild hochladen */}
                <label
                  htmlFor="profileImage"
                  className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer"
                >
                  Neues Bild hochladen
                </label>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div className="ml-8 flex-1">
                {/* firstName*/}
                <div className="mt-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                  >
                    Vorname
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* lastName */}
                <div className="mt-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nachname
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border rounded-lg shadow-md p-4 duration-200 dark:bg-gray-900 dark:border-gray-700">
            <h2 className="font-bold dark:text-white">
              Kontakt
              <hr className="mt-1 dark:border-gray-500" />
            </h2>

            <div className="mt-2">
              {/* hidden input for transfer of original email (needed to find user)*/}
              <input type="hidden" name="oldEmail" value={user.email} />

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                E-Mail
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="border rounded-lg shadow-md p-4 duration-200 dark:bg-gray-900 dark:border-gray-700">
            <h2 className="font-bold dark:text-white">
              Passwort
              <hr className="mt-1 dark:border-gray-500" />
            </h2>

            {/* old password */}
            <div className="mt-2">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Altes Passwort
              </label>
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
              />
            </div>

            {/* new password */}
            <div className="mt-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Neues Passwort
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
              />
            </div>

            {/* confirm new password */}
            <div className="mt-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Neues Passwort bestätigen
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Absenden-Button */}
          <div>
            {loading ? (
              <button
                type="submit"
                disabled
                className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Änderungen werden übernommen...
              </button>
            ) : (
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Änderungen Speichern
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
