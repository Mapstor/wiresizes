import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Zap } from 'lucide-react';

interface VoltageInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const COMMON_VOLTAGES = [
  { value: 12, label: '12V DC' },
  { value: 24, label: '24V DC' },
  { value: 48, label: '48V DC' },
  { value: 120, label: '120V' },
  { value: 208, label: '208V' },
  { value: 240, label: '240V' },
  { value: 277, label: '277V' },
  { value: 347, label: '347V' },
  { value: 480, label: '480V' },
  { value: 600, label: '600V' },
];

export function VoltageInput({ 
  label = "Voltage", 
  value, 
  onChange, 
  min = 1, 
  max = 1000, 
  className 
}: VoltageInputProps) {
  const [inputMode, setInputMode] = useState<'select' | 'custom'>('select');
  const [customValue, setCustomValue] = useState(value.toString());

  useEffect(() => {
    // Check if current value is in common voltages
    const isCommon = COMMON_VOLTAGES.some(v => v.value === value);
    setInputMode(isCommon ? 'select' : 'custom');
    setCustomValue(value.toString());
  }, [value]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setInputMode('custom');
    } else {
      const numValue = Number(selectedValue);
      onChange(numValue);
      setInputMode('select');
    }
  };

  const handleCustomChange = (inputValue: string) => {
    setCustomValue(inputValue);
    const numValue = Number(inputValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleCustomBlur = () => {
    const numValue = Number(customValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      // Reset to current valid value if invalid
      setCustomValue(value.toString());
    }
  };

  return (
    <div className={clsx("space-y-1", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          {label}
        </label>
      )}
      
      <div className="space-y-2">
        {/* Mode Toggle - Quick Select */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInputMode('select')}
            className={clsx(
              "px-3 py-2 text-sm rounded-md border transition-colors",
              inputMode === 'select'
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            Common Values
          </button>
          <button
            type="button"
            onClick={() => setInputMode('custom')}
            className={clsx(
              "px-3 py-2 text-sm rounded-md border transition-colors",
              inputMode === 'custom'
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            Custom Value
          </button>
        </div>

        {/* Input Field */}
        {inputMode === 'select' ? (
          <select
            value={value.toString()}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          >
            {COMMON_VOLTAGES.map((voltage) => (
              <option key={voltage.value} value={voltage.value}>
                {voltage.label}
              </option>
            ))}
            <option value="custom">Custom voltage...</option>
          </select>
        ) : (
          <div className="relative">
            <input
              type="number"
              min={min}
              max={max}
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              onBlur={handleCustomBlur}
              placeholder="Enter voltage"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none">
              V
            </div>
          </div>
        )}
      </div>

      {/* Common voltages quick buttons when in custom mode */}
      {inputMode === 'custom' && (
        <div className="flex flex-wrap gap-1 pt-2">
          {COMMON_VOLTAGES.slice(0, 6).map((voltage) => (
            <button
              key={voltage.value}
              type="button"
              onClick={() => {
                onChange(voltage.value);
                setCustomValue(voltage.value.toString());
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
            >
              {voltage.value}V
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-500">
        {inputMode === 'select' 
          ? "Select a common voltage or choose 'Custom voltage' for other values"
          : `Enter any voltage from ${min}V to ${max}V`
        }
      </p>
    </div>
  );
}