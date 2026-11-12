// The NEC edition each jurisdiction has adopted, grouped by edition (WSZ-005c): the counts and names come from
// data/verified/nec-adoption.json through editionGroups() (one entry per state, rule 2), and the states without a
// verified edition close the list. Used on the editions page and in the Table 310.16 page's edition panel.
import { clsx } from 'clsx';
import { Num } from './Num';
import {
  editionGroups,
  editionLabel,
  joinNames,
  NEC_ADOPTION_DOMAIN,
  NOT_VERIFIED,
  stateName,
} from '@/lib/verified/nec-adoption';

const ADOPT = NEC_ADOPTION_DOMAIN;

export function EditionSummary({ className }: { className?: string }) {
  const rows = [
    ...editionGroups().map((g) => ({ key: g.edition, term: editionLabel(g.edition), states: g.states })),
    { key: 'not-verified', term: 'Not verified', states: NOT_VERIFIED.map((n) => n.state) },
  ];
  return (
    <dl data-src={ADOPT} className={clsx('divide-y divide-gray-200 text-base', className)}>
      {rows.map((r) => (
        <div key={r.key} className="grid gap-x-4 py-2 sm:grid-cols-[11rem_1fr]">
          <dt className="font-semibold text-gray-900">
            {r.term} <span className="font-normal text-gray-600">(<Num v={r.states.length} src={ADOPT} />)</span>
          </dt>
          <dd className="leading-relaxed text-gray-800">{joinNames(r.states.map(stateName))}</dd>
        </div>
      ))}
    </dl>
  );
}
