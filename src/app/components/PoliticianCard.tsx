import Image from 'next/image';
import Link from 'next/link';
import { Politician, Party } from '@prisma/client';

type PoliticianCardProps = {
  politician: Politician;
  party: Party;
};

export default function PoliticianCard({
  politician,
  party,
}: PoliticianCardProps) {
  return (
    <Link href={`/politician/${politician.uuid}`}>
      <div className="border rounded-lg shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200">
        <Image
          src={`/pol_profile_img/${politician.profile_image}`}
          alt={`picture_${politician.first_name}_${politician.last_name}`}
          width={150}
          height={150}
          className="h-36 w-36 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-bold text-indigo-600 hover:text-indigo-500">{`${politician.first_name} ${politician.last_name}`}</h2>
          {party && (
            <p className="text-sm text-gray-500">{`Partei: ${party.short}`}</p>
          )}
          {politician.occupation && (
            <p className="text-sm text-gray-500">{`Tätigkeit: ${politician.occupation}`}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
