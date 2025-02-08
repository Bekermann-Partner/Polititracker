'use client';

import React, { useEffect, useState } from 'react';

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
}

interface CompanyInfoDBProps {
  companyId: number;
}

export default function CompanyInfoDB({ companyId }: CompanyInfoDBProps) {
  const [profile, setProfile] = useState<CompanyProfileDB | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
    return <p>Loading company profile...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!profile) {
    return <p>No profile available.</p>;
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        maxWidth: '800px',
        margin: '20px auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img
          src={profile.image}
          alt={profile.companyName}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'contain',
            marginRight: '20px',
          }}
        />
        <div>
          <h3 style={{ margin: 0 }}>
            {profile.companyName} ({profile.symbol})
          </h3>
          <p style={{ margin: 0 }}>
            Price: {profile.price} {profile.currency}
          </p>
          <p style={{ margin: 0 }}>Exchange: {profile.exchangeShortName}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '14px', lineHeight: 1.5 }}>
        <p>
          <strong>CEO:</strong> {profile.ceo}
        </p>
        <p>
          <strong>Industry:</strong> {profile.industry}
        </p>
        <p>
          <strong>Sector:</strong> {profile.sector}
        </p>
        <p>
          <strong>Founded (IPO Date):</strong>{' '}
          {profile.ipoDate
            ? profile.ipoDate instanceof Date
              ? profile.ipoDate.toLocaleDateString()
              : String(profile.ipoDate)
            : 'N/A'}
        </p>
        <p>
          <strong>Market Cap:</strong>{' '}
          {profile.mktCap ? profile.mktCap.toLocaleString() : 'N/A'} {profile.currency}
        </p>
        <p>
          <strong>Employees:</strong> {profile.fullTimeEmployees}
        </p>
        <p>
          <strong>Headquarters:</strong> {profile.address}, {profile.city}, {profile.state} {profile.zip}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone}
        </p>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '14px', lineHeight: 1.5 }}>
        <p>
          <strong>Description:</strong> {profile.description}
        </p>
      </div>

      {profile.website && (
        <div>
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '16px' }}
          >
            Visit Website
          </a>
        </div>
      )}
    </div>
  );
}
