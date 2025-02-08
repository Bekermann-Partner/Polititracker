'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import Toast from '@/app/components/Toast';

import './heart.css';

interface FollowToggleProps {
  user: User | null;
  polId: string;
}

export default function FollowToggle({ user, polId }: FollowToggleProps) {
  const heartRef = React.useRef<HTMLDivElement | null>(null);

  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // get follow status from API
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (user) {
        const response = await fetch(
          `/api/follow?userId=${user.id}&polId=${polId}`
        );
        const data = await response.json();
        if (data.isFollowed !== undefined) {
          setIsFollowed(data.isFollowed);
        }
      }
    };

    if (user) {
      fetchFollowStatus();
    }
  }, [user, polId]);

  const toggleFollowed = async () => {
    if (!user) {
      setError('You must be logged into an account to follow a politician!');
      return;
    }

    const response = await fetch(
      `/api/follow?userId=${user.id}&polId=${polId}`,
      {
        method: 'POST',
      }
    );

    const data = await response.json();
    if (data.isFollowed !== undefined) {
      setIsFollowed(data.isFollowed);
    }
  };

  function handleHeartClickAnimation(e: React.MouseEvent<HTMLDivElement>) {
    if (user == null) return;

    e.preventDefault();
    heartRef.current?.classList.remove('is-default-active');
    heartRef.current?.classList.toggle('is-active');
  }

  return (
    <>
      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      <button
        onClick={toggleFollowed}
        aria-label={isFollowed ? 'Unfollow politician' : 'Follow politician'}
        className="focus:outline-none relative w-[100px]"
      >
        <div
          className={'heart' + (isFollowed ? ' is-default-active' : '')}
          ref={heartRef}
          onClick={handleHeartClickAnimation}
        ></div>
      </button>
    </>
  );
}
