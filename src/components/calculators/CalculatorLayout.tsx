'use client';

import { ReactNode } from 'react';
import { Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { COPY_LINK_LABEL, useShareLink } from '@/lib/hooks/useShareLink';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Builds the link Share copies; tools without a Share button leave it out. */
  shareUrl?: () => string;
  onPrint?: () => void;
  /** Share and Print are disabled while the inputs are invalid. */
  actionsDisabled?: boolean;
}

export function CalculatorLayout({
  title,
  description,
  children,
  shareUrl,
  onPrint,
  actionsDisabled = false,
}: CalculatorLayoutProps) {
  const { status, share, fieldRef, fieldUrl } = useShareLink(shareUrl, actionsDisabled);

  return (
    <Card padding="none" className="overflow-visible">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {shareUrl && (
            <span role="status" className="text-sm font-medium text-neutral-600">
              {status}
            </span>
          )}
          {shareUrl && (
            <Tooltip content="Share Results">
              <Button
                variant="ghost"
                size="sm"
                onClick={share}
                disabled={actionsDisabled}
                aria-label="Share this result"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}
          {onPrint && (
            <Tooltip content="Print Results">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrint}
                disabled={actionsDisabled}
                aria-label="Print this result"
              >
                <Printer className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}
        </div>
        {fieldUrl !== null && (
          <div className="basis-full min-w-0">
            <Input ref={fieldRef} label={COPY_LINK_LABEL} type="text" value={fieldUrl} readOnly />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}
