'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { SkeletonThemeWrapper } from '@/app/components/SkeletonThemeWrapper';

export interface CompanyProfileDB {
  id: number;
  name: string;
  image: string;
  symbol: string;
  companyName: string;
  price?: number;
  beta?: number;
  volAvg?: number;
  mktCap?: number;
  lastDiv?: number;
  range?: string;
  changes?: number;
  currency?: string;
  cik?: string;
  isin?: string;
  cusip?: string;
  exchange?: string;
  exchangeShortName?: string;
  industry?: string;
  website?: string;
  description?: string;
  ceo?: string;
  sector?: string;
  country?: string;
  fullTimeEmployees?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  dcfDiff?: number;
  dcf?: number;
  ipoDate?: Date | string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
  founded: Date | number;
}

interface CompanyInfoDBProps {
  companyId: number;
}

export default function CompanyInfoDB({ companyId }: CompanyInfoDBProps) {
  const [profile, setProfile] = useState<CompanyProfileDB | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch the company profile
  useEffect(() => {
    async function fetchCompanyProfile() {
      try {
        const response = await fetch(`/api/company/${companyId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch company profile: ${errorText}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No company data found');
        }
        setProfile(data);
      } catch (err: unknown) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }
        console.error('Error fetching company profile from DB:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyProfile();
  }, [companyId]);

  if (loading) {
    return <LoadingCompanyInfo />;
  }
  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }
  if (!profile) {
    return <p className="text-center">No profile available.</p>;
  }

  // Compute the logo source.
  const logoSrc = `/logos/${profile.name.replace(/\s+/g, '_')}_image.png`;

  // Format the "founded" value.
  let foundedFormatted = 'N/A';
  if (profile.founded) {
    foundedFormatted =
      typeof profile.founded === 'number'
        ? profile.founded.toString()
        : new Date(profile.founded).toLocaleDateString();
  }

  return (
    <div className="flex flex-row">
      <div className="relative h-32 w-32 rounded-xl overflow-hidden">
        <Image
          src={logoSrc}
          alt={profile.companyName}
          fill
          className="object-contain object-center"
        />
      </div>
      <div className="w-full ml-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl text-gray-950 font-semibold dark:text-white">
              {profile.companyName} ({profile.symbol})
            </h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300">
              {profile.industry}
            </h2>
          </div>
        </div>

        <div className="border-b mt-2 mb-2 border-b-gray-300 dark:border-b-gray-600"></div>

        <h2 className="text-gray-600 dark:text-gray-400">CEO: {profile.ceo}</h2>
        <h2 className="text-gray-600 dark:text-gray-400">
          Gegründet: {foundedFormatted}
        </h2>

        {profile.description && (
          <>
            <div className="border-t mt-4 mb-4 border-gray-300 dark:border-gray-00"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.description}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function LoadingCompanyInfo() {
  return (
    <div className="flex flex-row">
      <SkeletonThemeWrapper>
        <div className="relative h-32 w-32 rounded-xl overflow-hidden">
          <Skeleton
            width={150}
            height={150}
            className="h-full w-auto object-cover dark:bg-gray-800"
          />
        </div>
        <div className="w-full ml-6">
          <div className="flex justify-between">
            <div>
              <Skeleton width={300} height={36} />
              <Skeleton width={400} height={28} />
            </div>
          </div>

          <div className="border-b mt-2 mb-2 border-b-gray-300 dark:border-b-gray-700"></div>

          <h2 className="text-gray-600 dark:text-gray-400">
            <Skeleton count={2} width={200} />
          </h2>
        </div>
      </SkeletonThemeWrapper>
    </div>
  );
}
