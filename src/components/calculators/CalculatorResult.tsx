import { Check, AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatEntered, formatFixed } from '@/lib/calculations/format';
import { conductor, formatSize } from '@/lib/verified/awg';
import { targetTitle } from '@/lib/calculations/voltage-drop';

interface CalculatorResultProps {
  awg: string;
  ampacity: number;
  voltageDropPercent: number;
  groundWire: string;
  material: 'copper' | 'aluminum';
  isCompliant: boolean;
  warnings?: string[];
  necReference?: string;
  /** Whether the voltage drop meets the reader's target; replaces isCompliant for the title. */
  meetsTarget?: boolean;
  /** Voltage drop in volts, shown beside the percent. */
  voltageDropVolts?: number;
  /** Label for the ampacity value, e.g. "60 °C ampacity". */
  ampacityLabel?: string;
  /** Shown in place of the ground wire size, e.g. when no Table 310.16 size is large enough. */
  groundWireMessage?: string;
  /** Plain-language steps behind the result. */
  steps?: string[];
  /** Error message: renders an error state instead of a result. */
  error?: string;
}

const GROUND_WIRE_LABELS = {
  copper: 'Ground wire (copper)',
  aluminum: 'Ground wire (aluminum or copper-clad aluminum)',
};

export function CalculatorResult({
  awg,
  ampacity,
  voltageDropPercent,
  groundWire,
  material,
  isCompliant,
  warnings = [],
  necReference,
  meetsTarget,
  voltageDropVolts,
  ampacityLabel = 'Ampacity',
  groundWireMessage,
  steps = [],
  error,
}: CalculatorResultProps) {
  const materialLabel = material === 'copper' ? 'Copper' : 'Aluminum';

  if (error || !conductor(awg)) {
    return (
      <div className="rounded-xl p-6 bg-red-50 border border-red-200" role="alert">
        <div className="flex items-center gap-2 mb-2">
          <X className="w-5 h-5 text-red-600" />
          <Badge variant={material === 'copper' ? 'warning' : 'default'}>{materialLabel}</Badge>
        </div>
        <p className="text-sm text-red-700">{error ?? 'No result for these inputs.'}</p>
      </div>
    );
  }

  const meets = meetsTarget ?? isCompliant;
  const config = meets
    ? { bg: 'bg-green-50', border: 'border-green-200', icon: Check, iconColor: 'text-green-600', vdColor: 'text-green-600' }
    : { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600', vdColor: 'text-amber-600' };
  const Icon = config.icon;
  const groundWireKnown = !groundWireMessage && conductor(groundWire) !== null;

  return (
    <div className={`rounded-xl p-6 ${config.bg} border ${config.border}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
        <span className="font-medium text-neutral-700">{targetTitle(meets)}</span>
      </div>

      {/* Main Result */}
      <div className="flex flex-wrap items-baseline gap-3 mb-4">
        <span className="text-3xl sm:text-4xl font-bold font-mono text-neutral-900">
          {formatSize(awg)}
        </span>
        <Badge variant={material === 'copper' ? 'warning' : 'default'}>
          {materialLabel}
        </Badge>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-neutral-500">{ampacityLabel}</div>
          <div className="font-mono font-semibold">{formatEntered(ampacity)} A</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Voltage Drop</div>
          <div className={`font-mono font-semibold ${config.vdColor}`}>
            {formatFixed(voltageDropPercent, 2)} %
            {voltageDropVolts !== undefined && ` (${formatFixed(voltageDropVolts, 2)} V)`}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-sm text-neutral-500">{GROUND_WIRE_LABELS[material]}</div>
          <div className={groundWireKnown ? 'font-mono font-semibold' : 'text-sm font-medium text-neutral-800'}>
            {groundWireKnown ? formatSize(groundWire) : (groundWireMessage ?? '–')}
          </div>
        </div>
        {necReference && (
          <div>
            <div className="text-sm text-neutral-500">NEC Reference</div>
            <div className="text-sm font-medium">{necReference}</div>
          </div>
        )}
      </div>

      {/* Notes */}
      {warnings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="text-sm font-medium text-amber-700 mb-2">Notes:</div>
          <ul className="text-sm text-amber-700 space-y-1">
            {warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="text-sm font-medium text-neutral-700 mb-2">Steps:</div>
          <ol className="text-sm text-neutral-700 space-y-1 list-decimal pl-5">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
