import React from 'react';

const UserAgreementPage = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-6xl py-10 text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-4xl font-extrabold mb-6 text-center">
          Nutzungsvereinbarung
        </h1>
        <div className="prose max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold border-b border-gray-400 pb-2">
            Einführung
          </h2>
          <p className="mb-4">
            Willkommen auf unserer Website. Durch den Zugriff auf oder die
            Nutzung unserer Website erklären Sie sich mit den in dieser
            Nutzungsvereinbarung festgelegten Bedingungen einverstanden. Wenn
            Sie diesen Bedingungen nicht zustimmen, nutzen Sie bitte nicht
            unsere Website.
          </p>

          <h2 className="text-2xl font-semibold border-b border-gray-400 pb-2">
            Nutzung der Website
          </h2>
          <p className="mb-4">
            Sie erklären sich damit einverstanden, unsere Website nur für
            rechtmäßige Zwecke und in einer Weise zu nutzen, die die Rechte
            anderer nicht verletzt, einschränkt oder deren Nutzung nicht
            beeinträchtigt.
          </p>

          <h2 className="text-2xl font-semibold border-b border-gray-400 pb-2">
            Geistiges Eigentum
          </h2>
          <p className="mb-4">
            Alle Inhalte auf dieser Website sind Eigentum unseres Unternehmens
            oder seiner Inhaltslieferanten und durch internationale
            Urheberrechtsgesetze geschützt.
          </p>

          <h2 className="text-2xl font-semibold border-b border-gray-400 pb-2">
            Datenschutz
          </h2>
          <p className="mb-4">
            Wir nehmen Ihre Privatsphäre ernst. Bitte lesen Sie unsere
            Datenschutzrichtlinie, um zu verstehen, wie wir Ihre persönlichen
            Daten erfassen, verwenden und schützen.
          </p>

          <h2 className="text-2xl font-semibold border-b border-gray-400 pb-2">
            Haftungsbeschränkung
          </h2>
          <p className="mb-4">
            Unsere Website und deren Inhalte werden ohne jegliche
            Gewährleistungen bereitgestellt. Wir haften nicht für Schäden, die
            sich aus der Nutzung unserer Website ergeben.
          </p>

          <h2 className="text-2xl font-semibold border-b border-gray-400 pb-2">
            Änderungen der Nutzungsvereinbarung
          </h2>
          <p className="mb-4">
            Wir behalten uns das Recht vor, diese Nutzungsvereinbarung jederzeit
            zu ändern. Änderungen werden sofort nach ihrer Veröffentlichung
            wirksam.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserAgreementPage;
