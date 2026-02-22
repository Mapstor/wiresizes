import { formatAwg } from '@/lib/utils/formatters';

interface DistanceTableProps {
  amps: number;
  data: Array<{ distance: number; copper: string; aluminum: string }>;
}

export function DistanceTable({ amps, data }: DistanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-neutral-200">
            <th className="px-4 py-3 text-left bg-neutral-50">Distance</th>
            <th className="px-4 py-3 text-left bg-copper-50 text-copper-700">Copper</th>
            <th className="px-4 py-3 text-left bg-aluminum-50 text-aluminum-700">Aluminum</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.map((row) => (
            <tr key={row.distance} className="hover:bg-neutral-50">
              <td className="px-4 py-3">{row.distance} ft</td>
              <td className="px-4 py-3 font-mono text-copper-600">{formatAwg(row.copper)}</td>
              <td className="px-4 py-3 font-mono text-aluminum-600">{formatAwg(row.aluminum)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}