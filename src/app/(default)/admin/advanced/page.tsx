'use client';

import React, { useState } from 'react';
import Toast from '@/app/components/Toast';
import { executeRequest } from '@/app/(default)/admin/advanced/executeSQLAction';

export default function Page() {
  const [value, setValue] = React.useState<string>('SELECT * FROM Politician;');
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line
  const [data, setData] = useState<any>([]);

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

          <textarea
            className={
              'font-mono w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded-xl shadow-md border dark:border-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            }
            rows={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div
            onClick={() => handleExecuteRequest()}
            className={
              'mt-5 hover:cursor-pointer flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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

          <section className="mt-10 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Nutzungsanleitung</h2>
            <p className="mb-4 dark:text-gray-300">
              Auf dieser Seite kannst Du ausschließlich <strong>lesende SQL-Abfragen</strong> ausführen,
              um Informationen aus den Tabellen <em>Politician</em>, <em>Company</em>, <em>Rating</em> und <em>Party</em> abzurufen.
              Unsere Plattform – Polititracker – nutzt diese Daten, um Beziehungen zwischen Politikern und wirtschaftlichen Interessen sichtbar zu machen.
            </p>

            <h3 className="text-xl font-bold mb-2 dark:text-white">Überblick der relevanten Tabellen</h3>
            <ul className="list-disc ml-6 mb-4 dark:text-gray-300">
              <li>
                <strong>Politician</strong>: Enthält biografische Daten der Politiker (z. B. <code>first_name</code>, <code>last_name</code> etc.).
              </li>
              <li>
                <strong>Company</strong>: Enthält Informationen zu den Unternehmen (z. B. <code>id</code>, <code>name</code>, <code>symbol</code> etc.).
              </li>
              <li>
                <strong>Rating</strong>: Speichert die Bewertungen von Nachrichtenartikeln, die die Verbindung zwischen Politikern und Unternehmen dokumentieren.
              </li>
              <li>
                <strong>Party</strong>: Enthält Angaben zu den politischen Parteien (z. B. <code>short</code> und <code>long</code> Bezeichnungen).
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-2 dark:text-white">Beispiel-Queries</h3>
            <ol className="list-decimal ml-6 dark:text-gray-300">
              <li className="mb-3">
                <strong>Alle Politiker mit ihren Parteien</strong>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 font-mono text-sm">
{`SELECT
    pol.first_name AS Vorname,
    pol.last_name AS Nachname,
    party.short AS Partei
FROM polititracker.Politician AS pol
JOIN polititracker.Party AS party
    ON pol.party_id = party.id;`}
                </pre>
              </li>
              <li className="mb-3">
                <strong>Verbindungen von bestimmten Politikern und Unternehmen und die dazugehörigen Ratings und URLs</strong>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 font-mono text-sm">
{`SELECT
    pol.first_name AS Vorname,
    pol.last_name AS Nachname,
    comp.name AS Unternehmen,
    r.stars AS Rating,
    r.url AS URL
FROM polititracker.Rating AS r
JOIN polititracker.Politician AS pol
    ON r.politician_id = pol.ext_abgeordnetenwatch_id
JOIN polititracker.Company AS comp
    ON r.company_id = comp.id
WHERE pol.first_name = 'Friedrich' AND pol.last_name = 'Merz' AND comp.name = 'Blackrock'
ORDER BY r.stars DESC;`}
                </pre>
              </li>
              <li className="mb-3">
                <strong>Durchschnittliche Ratings für Unternehmen</strong>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 font-mono text-sm">
{`SELECT
    comp.name AS Unternehmen,
    AVG(r.stars) AS DurschnittlichesRating,
    COUNT(r.id) AS AnzahlRatings
FROM polititracker.Company AS comp
JOIN polititracker.Rating AS r
    ON comp.id = r.company_id
GROUP BY comp.id, comp.name
ORDER BY avg_rating DESC
-- WHERE comp.name = 'Tesla' -- Filtern nach bestimmtem Unternehmen;`}
                </pre>
              </li>
              <li>
                <strong>Welche Politiker werden am häufigsten in Verbindung mit Unternehmen erwähnt?</strong>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 font-mono text-sm">
{`SELECT
    pol.first_name AS Vorname,
    pol.last_name AS Nachname,
    COUNT(r.id) AS Anzahl Verbindungen,
    AVG(r.stars) AS Durchschnittliche Ratings
FROM polititracker.Politician AS pol
LEFT JOIN polititracker.Rating AS r
    ON pol.ext_abgeordnetenwatch_id = r.politician_id
GROUP BY pol.ext_abgeordnetenwatch_id, pol.first_name, pol.last_name
ORDER BY Anzahl_Verbindungen DESC;`}
                </pre>
              </li>
            </ol>
          </section>
        </div>
      </section>
    </>
  );
}

