'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border border-neutral-200 rounded-lg divide-y">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="flex justify-between items-center w-full px-6 py-4 text-left hover:bg-neutral-50"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium">{item.question}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 text-neutral-600 bg-neutral-50">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}