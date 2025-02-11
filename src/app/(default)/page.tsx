import { SearchBar } from '@/app/(default)/searchBar';
import db from '@/_lib/db';
import { Counter } from '@/app/components/Counter';
import { FaArrowRight } from 'react-icons/fa6';
import { ScrollToIdOnClick } from '@/app/components/ScrollToIdOnClick';
import { PoliticianGridImage } from '@/app/components/PoliticianGridImage';
import Link from 'next/link';

export default async function LandingPage() {
  const politiciansWithImages = await db.politician.findMany({
    where: {
      profile_image: {
        not: undefined,
      },
    },
  });

  const commentCount = await db.comment.count();
  const companyCount = await db.company.count();

  const randomPoliticianImages = politiciansWithImages
    .map((politician) => ({
      polUuid: politician.uuid,
      imgageSource: `/pol_profile_img/${politician.profile_image}`,
      sortValue: Math.random(),
    }))
    .sort((a, b) => a.sortValue - b.sortValue)
    .map((e) => ({ polUuid: e.polUuid, imageSource: e.imgageSource }));

  return (
    <>
      <section className="relative pt-10 bg-gray-50 dark:bg-gray-900 pb-10">
        <div className="mx-auto px-6 max-w-7xl md:px-12">
          <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
            <h1 className="mt-8 text-wrap text-4xl md:text-5xl font-semibold text-title xl:text-5xl xl:[line-height:1.125] dark:text-white">
              Erfahre mehr über die Verbindungen zwischen Politikern und
              Unternehmen!
            </h1>
            <div
              className={
                'flex flex-col md:flex-row space-y-3 md:space-y-0 justify-evenly mt-8'
              }
            >
              <Counter
                initialValue={Math.ceil(companyCount * 0.8)}
                finalValue={companyCount}
                text={' Unternehmen'}
              />

              <Counter
                initialValue={Math.ceil(politiciansWithImages.length * 0.8)}
                finalValue={politiciansWithImages.length}
                text={' Politiker'}
              />

              <Counter
                initialValue={Math.ceil(commentCount * 0.8)}
                finalValue={commentCount}
                text={' Kommentare'}
              />
            </div>

            <p className="text-wrap mx-auto mt-8 max-w-2xl text-lg hidden sm:block text-body dark:text-gray-300">
              In einer Zeit, in der Transparenz und Vertrauen in politische
              Entscheidungsprozesse wichtiger denn je sind, setzen wir mit
              Polititracker auf Aufklärung. Unsere Plattform widmet sich der
              akkuraten und unabhängigen Analyse von Verbindungen zwischen
              Politikern und Unternehmen. Ziel ist es, mögliche
              Interessenkonflikte aufzudecken und den Bürgerinnen und Bürgern
              einen klaren Einblick in wirtschaftliche Verflechtungen zu bieten.
            </p>

            <ScrollToIdOnClick id={'about'}>
              <div
                className={
                  'bg-black dark:bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1.5 w-fit mx-auto mt-3 hover:cursor-pointer hover:px-4 transition-all'
                }
              >
                <span className={'inline-block my-auto align-middle mt-[-3px]'}>
                  <FaArrowRight />
                </span>{' '}
                Mehr Lesen
              </div>
            </ScrollToIdOnClick>
          </div>
        </div>
      </section>

      <section>
        <div className="mt-10 pt-8 pb-4">
          <div className="mx-auto px-6 max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl text-gray-950 dark:text-white font-semibold">
                Finde deine Lieblingspolitiker
              </h2>

              <SearchBar
                politician={
                  politiciansWithImages[
                    Math.floor(Math.random() * politiciansWithImages.length)
                  ]
                }
              />
            </div>
            <div className="mt-14 pb-14 relative w-fit h-fit sm:mx-auto sm:px-0 -mx-6 px-6 overflow-x-auto">
              <div className="mb-3 flex w-fit mx-auto gap-3">
                {[...Array(4).keys()].map((i) => (
                  <Link
                    href={`/politicians/${randomPoliticianImages[i].polUuid}`}
                    key={i}
                  >
                    <PoliticianGridImage
                      key={i}
                      url={randomPoliticianImages[i].imageSource}
                    />
                  </Link>
                ))}
              </div>
              <div className="flex w-fit mx-auto gap-3">
                {[...Array(5).keys()]
                  .map((i) => i + 4)
                  .map((i) => (
                    <Link
                      href={`/politicians/${randomPoliticianImages[i].polUuid}`}
                      key={i}
                    >
                      <PoliticianGridImage
                        key={i}
                        url={randomPoliticianImages[i].imageSource}
                      />
                    </Link>
                  ))}
              </div>
              <div className="my-3 flex w-fit mx-auto gap-3">
                {[...Array(6).keys()]
                  .map((i) => i + 9)
                  .map((i) => (
                    <Link
                      href={`/politicians/${randomPoliticianImages[i].polUuid}`}
                      key={i}
                    >
                      <PoliticianGridImage
                        key={i}
                        url={randomPoliticianImages[i].imageSource}
                      />
                    </Link>
                  ))}
              </div>
              <div className="mt-3 flex w-fit mx-auto gap-3">
                {[...Array(5).keys()]
                  .map((i) => i + 15)
                  .map((i) => (
                    <Link
                      href={`/politicians/${randomPoliticianImages[i].polUuid}`}
                      key={i}
                    >
                      <PoliticianGridImage
                        key={i}
                        url={randomPoliticianImages[i].imageSource}
                      />
                    </Link>
                  ))}
              </div>
              <div className="mt-3 flex w-fit mx-auto gap-3">
                {[...Array(4).keys()]
                  .map((i) => i + 20)
                  .map((i) => (
                    <Link
                      href={`/politicians/${randomPoliticianImages[i].polUuid}`}
                      key={i}
                    >
                      <PoliticianGridImage
                        key={i}
                        url={randomPoliticianImages[i].imageSource}
                      />
                    </Link>
                  ))}
              </div>
            </div>
            <div className="-mx-6 top-[-290px] relative max-w-xl sm:mx-auto">
              <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 dark:opacity-10 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)]"></div>
              <div className="absolute top-0 inset-x-0 w-2/3 h-44 -z-[1] rounded-full bg-blue-200 dark:bg-white/20 mx-auto blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gray-50 dark:bg-gray-900" id={'about'}>
        <div className="relative pt-10 pb-10">
          <div className="mx-auto px-6 max-w-7xl">
            <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
              <h1 className="text-4xl md:text-5xl font-semibold text-title xl:text-2xl xl:[line-height:1.125] dark:text-white">
                Was ist <strong>Polititracker</strong>?
              </h1>

              <p className="text-wrap mx-auto mt-8 max-w-2xl text-lg hidden sm:block text-body dark:text-gray-300">
                Polititracker ist ein Analyse-Tool, das Daten aus
                unterschiedlichen Nachrichtenportalen erfasst und zusammenführt,
                um Netzwerke zwischen Politikern und deren wirtschaftlichen
                Interessen sichtbar zu machen. Dabei konzentrieren wir uns auf:
              </p>

              <ul className={'text-left mt-10 dark:text-gray-300'}>
                <li>
                  <strong>Transparenz:</strong>
                  <p>
                    Wir visualisieren Verbindungen und Beziehungen, um
                    Diskrepanzen und potenzielle Interessenskonflikte
                    offenzulegen.
                  </p>
                </li>
                <li>
                  <strong>Datenvielfalt:</strong>
                  <p>
                    Wir integrieren Informationen aus zahlreichen Nachrichtenportalen, 
                    um ein umfassendes Netzwerk politischer und 
                    wirtschaftlicher Zusammenhänge abzubilden.
                  </p>
                </li>
                <li>
                  <strong>Interaktivität:</strong>
                  <p>
                    Unsere Plattform bietet interaktive Visualisierungen, 
                    mit denen Nutzer die komplexen Datenmuster selbstständig erkunden 
                    und eigene Analysen durchführen können.
                  </p>
                </li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
