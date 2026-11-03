// A sentence in text parts (src/lib/calculations/format.ts): text as is, values through <Val>, sizes through <Size>.
// Its plain text is partsText of the same parts, so the screen and the print payload read the same.
import type { TextPart } from '@/lib/calculations/format';
import { Val } from './Val';
import { Size } from './Size';

export function ValText({ parts }: { parts: TextPart[] }) {
  return (
    <>
      {parts.map((part, k) => {
        if (typeof part === 'string') return part;
        if ('size' in part) return <Size key={k} s={part.size} />;
        return <Val key={k} v={part.v} unit={part.unit} src={part.src} format={part.format} />;
      })}
    </>
  );
}
