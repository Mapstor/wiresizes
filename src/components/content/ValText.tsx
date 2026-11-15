// A sentence in text parts (src/lib/calculations/format.ts): text as is, values through <Val>, sizes through <Size>.
// Its plain text is partsText of the same parts, so the screen and the print payload read the same.
import type { TextPart } from '@/lib/calculations/format';
import { Num } from './Num';
import { Val } from './Val';
import { Size } from './Size';

export function ValText({ parts }: { parts: TextPart[] }) {
  return (
    <>
      {parts.map((part, k) => {
        if (typeof part === 'string') return part;
        if ('size' in part) return <Size key={k} s={part.size} />;
        if ('n' in part) return <Num key={k} v={part.n} src={part.src} format={part.format} />;
        return <Val key={k} v={part.v} unit={part.unit} src={part.src} format={part.format} />;
      })}
    </>
  );
}
