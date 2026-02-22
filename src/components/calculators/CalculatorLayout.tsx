import { ReactNode } from 'react';
import { Share2, Printer, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onShare?: () => void;
  onPrint?: () => void;
  shareUrl?: string;
}

export function CalculatorLayout({
  title,
  description,
  children,
  onShare,
  onPrint,
}: CalculatorLayoutProps) {
  return (
    <Card padding="none" className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          {onShare && (
            <Tooltip content="Share Results">
              <Button variant="ghost" size="sm" onClick={onShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}
          {onPrint && (
            <Tooltip content="Print Results">
              <Button variant="ghost" size="sm" onClick={onPrint}>
                <Printer className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}