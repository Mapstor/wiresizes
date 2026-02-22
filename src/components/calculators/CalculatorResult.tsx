import { Check, AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatAwg } from '@/lib/utils/formatters';

interface CalculatorResultProps {
  awg: string;
  ampacity: number;
  voltageDropPercent: number;
  groundWire: string;
  material: 'copper' | 'aluminum';
  isCompliant: boolean;
  warnings?: string[];
  necReference?: string;
}

export function CalculatorResult({
  awg,
  ampacity,
  voltageDropPercent,
  groundWire,
  material,
  isCompliant,
  warnings = [],
  necReference,
}: CalculatorResultProps) {
  const status = isCompliant 
    ? 'success' 
    : voltageDropPercent <= 5 
    ? 'warning' 
    : 'error';

  const statusConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: Check,
      iconColor: 'text-green-600',
      title: 'Recommended Wire Size',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      title: 'Wire Size (With Caution)',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: X,
      iconColor: 'text-red-600',
      title: 'Wire Size (Not Recommended)',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl p-6 ${config.bg} border ${config.border}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
        <span className="font-medium text-neutral-700">{config.title}</span>
      </div>

      {/* Main Result */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-4xl font-bold font-mono text-neutral-900">
          {formatAwg(awg)}
        </span>
        <Badge variant={material === 'copper' ? 'warning' : 'default'}>
          {material === 'copper' ? 'Copper' : 'Aluminum'}
        </Badge>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-neutral-500">Ampacity</div>
          <div className="font-mono font-semibold">{ampacity}A</div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Voltage Drop</div>
          <div className={`font-mono font-semibold ${
            voltageDropPercent <= 3 ? 'text-green-600' :
            voltageDropPercent <= 5 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {voltageDropPercent.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">Ground Wire</div>
          <div className="font-mono font-semibold">{formatAwg(groundWire)}</div>
        </div>
        {necReference && (
          <div>
            <div className="text-sm text-neutral-500">NEC Reference</div>
            <div className="text-sm font-medium">{necReference}</div>
          </div>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="text-sm font-medium text-amber-700 mb-2">Notes:</div>
          <ul className="text-sm text-amber-600 space-y-1">
            {warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}