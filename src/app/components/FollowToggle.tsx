'use client';

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import Toast from '@/app/components/Toast';

interface FollowToggleProps {
    user: User | null;
    polId: string;
}

export default function FollowToggle({ user, polId }: FollowToggleProps) {
    const [isFollowed, setIsFollowed] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // get follow status from API
    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (user) {
                const response = await fetch(`/api/follow?userId=${user.id}&polId=${polId}`);
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

        const response = await fetch(`/api/follow?userId=${user.id}&polId=${polId}`, {
            method: 'POST',
        });

        const data = await response.json();
        if (data.isFollowed !== undefined) {
            setIsFollowed(data.isFollowed);
        }
    };

    return (
        <>
            {error && (
                <Toast message={error} type="error" onClose={() => setError(null)} />
            )}

            <button
                onClick={toggleFollowed}
                aria-label={
                    isFollowed ? 'Unfollow politician' : 'Follow politician'
                }
                className="focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFollowed ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="text-gray-500 w-8 h-8 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3v18l7-5 7 5V3H5z"
                    />
                </svg>
            </button>
        </>
    );
}
