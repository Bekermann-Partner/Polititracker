'use client';

import React, { useState } from 'react';
import CompanyGraph from './companyGraph';
import { CompanySearchBar } from '@/app/(default)/companyGraph/companySearchBar';
import { Company } from '@/app/(default)/companyGraph/companySearchBar';

export default function GraphPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <div style={{ paddingTop: '80px' }}>
      <h2 style={{ textAlign: 'center' }}>
        Company Graph: Connections to Politicians
      </h2>

      {!selectedCompany && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <CompanySearchBar
            onSelect={(company) => setSelectedCompany(company)}
          />
        </div>
      )}

      {selectedCompany && (
        <div>
          <CompanyGraph selectedCompany={selectedCompany} />
        </div>
      )}
    </div>
  );
}
