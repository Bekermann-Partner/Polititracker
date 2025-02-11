'use client';

import MonacoEditor from 'react-monaco-editor/lib/editor';
import 'monaco-sql-languages/esm/languages/mysql/mysql.contribution';
import React, { useEffect, useState } from 'react';
import { LanguageIdEnum, setupLanguageFeatures } from 'monaco-sql-languages';
import Toast from '@/app/components/Toast';
import { executeRequest } from '@/app/(default)/admin/advanced/executeSQLAction';

export default function Page() {
  const [value, setValue] = React.useState<string>('SELECT * FROM Politician;');
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setupLanguageFeatures(LanguageIdEnum.MYSQL, {
      completionItems: {
        enable: true,
        triggerCharacters: [' ', '.'],
      },
    });
  }, []);

  async function handleExecuteRequest() {
    setError(null);
    try {
      const res = await executeRequest(value);
      setData(res);
      // eslint-disable-next-line
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <>
      {error && (
        <Toast message={error} type="error" onClose={() => setError(null)} />
      )}

      <section className="mt-10 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className={'flex justify-between'}>
            <h1 className={'text-3xl font-bold mb-5 dark:text-white'}>
              Fortgeschrittene Anfragen
            </h1>
          </div>

          <MonacoEditor
            language={LanguageIdEnum.MYSQL}
            theme={'vs-dark'}
            height={400}
            className={'rounded'}
            value={value}
            onChange={setValue}
          />

          <div
            onClick={() => handleExecuteRequest()}
            className={
              'mt-5 flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            }
          >
            Anfrage ausführen
          </div>

          <pre
            className={
              'bg-gray-200 dark:bg-gray-800 dark:text-gray-200 mt-10 max-h-[700px] overflow-y-scroll overflow-x-hidden p-3 rounded'
            }
          >
            {data.length == 0 ? 'Keine Daten' : JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </section>
    </>
  );
}
