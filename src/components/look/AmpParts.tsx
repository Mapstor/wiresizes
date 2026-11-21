// Pieces the amp-rating guides share (WSZ-042): the two-metal phrase, a drop in volts and percent, a length, a
// receptacle name, and three ruled tables (Table 310.16 around the answer, lengths to a 3 % drop, receptacles by the
// wires that land on them). Server components; every number carries its source.
import { clsx } from 'clsx';
import { DataTable, RSTICKY_TD, RSTICKY_TH, RTD, RTH } from '@/components/content/DataTable';
import { Size } from '@/components/content/Size';
import { Val } from '@/components/content/Val';
import type { DropRun } from '@/lib/calculations/voltage-drop';
import type { LadderRow } from '@/lib/subpanel-guide';
import type { LengthRow } from '@/lib/amp-guides';
import type { NemaConfig } from '@/lib/verified/nema-receptacle-configs';
import type { SizeKey } from '@/lib/verified/awg';
import { VOLTAGE_DROP_NOTE } from '@/lib/verified/nec-continuous-load-2023';

const AMP = 'nec-310-16';
const VD = 'calc:voltage-drop';
const NEMA = 'nema-receptacle-configs';

// phones: three-column tables give way on padding and header width so they fit 390 px
const TIGHT_TH = 'max-sm:!min-w-0 max-sm:!px-2';
const TIGHT_TD = 'max-sm:!px-2';
const WORDS_TD = '!whitespace-normal !font-display !text-left';

export function Pair({ cu, al }: { cu: SizeKey; al: SizeKey }) {
  return (
    <>
      <Size s={cu} /> copper or <Size s={al} /> aluminum
    </>
  );
}

/** A drop at the full rating: volts, then percent. */
export function DropText({ run }: { run: DropRun }) {
  return (
    <>
      <Val v={run.vdVolts} unit="V" src={VD} format={{ fixed: 2 }} /> (<Val v={run.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />)
    </>
  );
}

export function Pct({ run }: { run: DropRun }) {
  return <Val v={run.vdPct} unit="%" src={VD} format={{ fixed: 2 }} />;
}

export function Ft({ v }: { v: number }) {
  return <Val v={v} unit="ft" src={VD} format={{ fixed: 0 }} />;
}

export function Cfg({ c }: { c: string }) {
  return <span className="whitespace-nowrap">{c}</span>;
}

/** One metal's Table 310.16 ampacity at the two columns. */
export function LadderTable({ id, rows, metal, low, high }: { id: string; rows: LadderRow[]; metal: 'Copper' | 'Aluminum'; low: number; high: number }) {
  return (
    <DataTable id={id} variant="ruled" src={AMP} caption={`${metal}: Table 310.16 ampacity, A`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          <th scope="col" className={RTH}>
            <Val v={low} unit="°C" src={AMP} />
          </th>
          <th scope="col" className={RTH}>
            <Val v={high} unit="°C" src={AMP} />
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            <td className={RTD}>
              <Val v={r.a60} unit="A" src={AMP} />
            </td>
            <td className={RTD}>
              <Val v={r.a75} unit="A" src={AMP} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** One metal's lengths to the note's 3 %: at 240 V only, or at 120 V and 240 V. */
export function LengthTable({ id, rows, metal, both, lowVolts, highVolts }: { id: string; rows: LengthRow[]; metal: 'Copper' | 'Aluminum'; both: boolean; lowVolts: number; highVolts: number }) {
  return (
    <DataTable id={id} variant="ruled" src={VD} caption={`${metal}: one-way length to a ${VOLTAGE_DROP_NOTE.feederPct} % drop, ft`}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH)}>
            Size
          </th>
          {both && (
            <th scope="col" className={RTH}>
              <Val v={lowVolts} unit="V" src={VD} />
            </th>
          )}
          <th scope="col" className={RTH}>
            {both ? <Val v={highVolts} unit="V" src={VD} /> : 'Length'}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.size}>
            <th scope="row" className={RSTICKY_TD}>
              <Size s={r.size} />
            </th>
            {both && (
              <td className={RTD}>
                <Ft v={r.ft120} />
              </td>
            )}
            <td className={RTD}>
              <Ft v={r.ft240} />
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

/** What lands on a receptacle, from its NEMA ratings: a device rated 125 V or 125/250 V has a neutral pole. */
export function receptacleWires(c: NemaConfig): string {
  const neutral = c.volts.startsWith('125');
  const hots = c.poles - (neutral ? 1 : 0);
  if (hots < 1 || hots > 2 || c.wires !== c.poles + (c.grounding ? 1 : 0)) throw new Error(`receptacle wires: ${c.config} no longer reads as hots, neutral and ground`);
  return `${c.wires}: ${hots === 1 ? 'one hot' : 'two hots'}${neutral ? ', a neutral' : ''}${c.grounding ? ' and a ground' : ', no ground'}`;
}

export function ReceptacleTable({ id, configs, caption }: { id: string; configs: NemaConfig[]; caption: string }) {
  return (
    <DataTable id={id} variant="ruled" src={NEMA} caption={caption}>
      <thead>
        <tr>
          <th scope="col" className={clsx(RTH, RSTICKY_TH, TIGHT_TH)}>
            Receptacle
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH)}>
            Volts
          </th>
          <th scope="col" className={clsx(RTH, TIGHT_TH, '!text-left')}>
            Wires
          </th>
        </tr>
      </thead>
      <tbody>
        {configs.map((c) => (
          <tr key={c.config}>
            <th scope="row" className={clsx(RSTICKY_TD, TIGHT_TD)}>
              {c.config}
            </th>
            <td className={clsx(RTD, TIGHT_TD)}>{c.volts} V</td>
            <td className={clsx(RTD, TIGHT_TD, WORDS_TD)}>{receptacleWires(c)}</td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
