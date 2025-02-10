'use client';

import React, { useState } from 'react';
import CompanyGraph from './companyGraph';
import { CompanySearchBar } from '@/app/(default)/companyGraph/companySearchBar';
import CompanyInfoDB from '@/app/(default)/companyGraph/companyInfoDB';
import { Company } from '@/app/(default)/companyGraph/companySearchBar';

export default function GraphPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <section className="mt-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl dark:text-white font-semibold">
          Unternehmensgraph: Verbindungen zu Politikern
        </h2>

        {!selectedCompany && (
          <div className="mb-20 text-center" style={{ marginBottom: '380px' }}>
            <CompanySearchBar
              onSelect={(company) => setSelectedCompany(company)}
            />
          </div>
        )}

        {selectedCompany && (
          <div className="mb-10">
            <CompanySearchBar
              onSelect={(company) => setSelectedCompany(company)}
            />
            <div className="mt-10">
              <CompanyInfoDB companyId={selectedCompany.id} />
            </div>
            <div className="mt-10">
              <CompanyGraph selectedCompany={selectedCompany} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
