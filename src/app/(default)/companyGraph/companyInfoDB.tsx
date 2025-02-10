'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ETheme, getTheme } from '@/_lib/providers/themeProvider';

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
  const [isDark, setIsDark] = useState<boolean>(false);

  // Set the initial dark mode state based on your theme provider.
  useEffect(() => {
    const theme = getTheme();
    setIsDark(theme === ETheme.DARK);
  }, []);

  // Listen for theme changes via a custom event, similar to your Apex hook.
  useEffect(() => {
    const handleThemeChange = (e: CustomEventInit<string>) => {
      if (!e.detail) return;
      // In your Apex code, a detail of 'light' means switching to dark mode.
      if (e.detail === 'light') {
        setIsDark(true);
      } else if (e.detail === 'dark') {
        setIsDark(false);
      }
    };

    window.addEventListener(
      'theme-mode-change',
      handleThemeChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'theme-mode-change',
        handleThemeChange as EventListener
      );
    };
  }, []);

  // Update styles based on the isDark state.
  const themeStyles = useMemo(() => {
    return isDark
      ? {
          containerBackground: 'transparent',
          containerBorder: '1px solid #fff',
          textColor: '#fff',
          linkColor: '#9cf',
        }
      : {
          containerBackground: 'transparent',
          containerBorder: '1px solid #000',
          textColor: '#000',
          linkColor: '#0070f3',
        };
  }, [isDark]);

  // Fetch the company profile.
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
  const logoSrc = `/logos/${profile.name.replace(/\s+/g, '_')}_image.png`;

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
          <strong>Founded:</strong>{' '}
          {profile.founded
            ? profile.founded instanceof Date
              ? profile.founded.toLocaleDateString()
              : String(profile.founded)
            : 'N/A'}
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
            style={{
              color: themeStyles.linkColor,
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Visit Website
          </a>
        </div>
      )}
    </div>
  );
}
