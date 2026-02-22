'use client';

import { motion } from 'framer-motion';

const COMMON_SIZES = ['14', '12', '10', '8', '6', '4', '2', '1/0', '2/0', '4/0'];

interface WireSizeScaleProps {
  highlightedAwg?: string;
  material?: 'copper' | 'aluminum';
}

export function WireSizeScale({ highlightedAwg, material = 'copper' }: WireSizeScaleProps) {
  const baseColor = material === 'copper' ? 'bg-copper' : 'bg-aluminum';
  
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        AWG Wire Size Scale
      </h3>
      
      <div className="flex items-end justify-between gap-1">
        {COMMON_SIZES.map((awg, index) => {
          const isHighlighted = awg === highlightedAwg;
          const height = 20 + (index * 8);
          const width = 12 + (index * 2);
          
          return (
            <div key={awg} className="flex flex-col items-center">
              <motion.div
                className={`rounded-full ${
                  isHighlighted 
                    ? material === 'copper' ? 'bg-copper-500' : 'bg-aluminum-500'
                    : 'bg-neutral-300'
                }`}
                style={{ width, height }}
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              />
              <span className={`mt-2 text-xs font-mono ${
                isHighlighted ? 'text-primary-600 font-bold' : 'text-neutral-500'
              }`}>
                {awg}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-neutral-400">
        <span>← Smaller (higher AWG)</span>
        <span>Larger (lower AWG) →</span>
      </div>
    </div>
  );
}