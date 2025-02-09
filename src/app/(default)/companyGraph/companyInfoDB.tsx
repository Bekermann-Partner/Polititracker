'use client';

import React, { useEffect, useState, useMemo } from 'react';

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
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const themeStyles = useMemo(() => {
    if (isDark) {
      return {
        containerBackground: 'transparent',
        containerBorder: '1px solid #fff',
        textColor: '#fff',
        linkColor: '#9cf',
      };
    } else {
      return {
        containerBackground: 'transparent',
        containerBorder: '1px solid #000',
        textColor: '#000',
        linkColor: '#0070f3',
      };
    }
  }, [isDark]);

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
    return <p style={{ textAlign: 'center' }}>Loading company profile...</p>;
  }
  if (error) {
    return <p style={{ textAlign: 'center' }}>Error: {error}</p>;
  }
  if (!profile) {
    return <p style={{ textAlign: 'center' }}>No profile available.</p>;
  }

  // Compute the image URL based on the company name.
  // Adjust the replace logic if your file names follow a different convention.
  const logoSrc = `/logos/${profile.companyName.replace(/\s+/g, '_')}_image.png`;

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '20px',
        border: themeStyles.containerBorder,
        borderRadius: '8px',
        backgroundColor: themeStyles.containerBackground,
        maxWidth: '800px',
        margin: '20px auto',
        color: themeStyles.textColor,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <img
          src={logoSrc}
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
        </div>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '14px', lineHeight: 1.5 }}>
        <p>
          <strong>CEO:</strong> {profile.ceo}
        </p>
        <p>
          <strong>Gegründet (IPO Date):</strong>{' '}
          {profile.ipoDate
            ? profile.ipoDate instanceof Date
              ? profile.ipoDate.toLocaleDateString()
              : String(profile.ipoDate)
            : 'N/A'}
        </p>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '14px', lineHeight: 1.5 }}>
        <p>
          <strong>Beschreibung:</strong> {profile.description}
        </p>
      </div>

      {profile.website && (
        <div>
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: themeStyles.linkColor,
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Besuche Website
          </a>
        </div>
      )}
    </div>
  );
}
