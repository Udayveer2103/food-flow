import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentPatterns } from '@/hooks/useRecentPatterns';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecentPatterns() {
  const { insights, hasEnoughData, loading } = useRecentPatterns();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 6s
  useEffect(() => {
    if (insights.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % insights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [insights.length]);

  if (loading || !hasEnoughData || insights.length === 0) {
    if (!loading && !hasEnoughData) {
      return (
        <Card className="border-0 shadow-sm animate-fade-in">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Patterns will appear as you log more days.
            </p>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  const current = insights[activeIndex];

  return (
    <Card className="border-0 shadow-sm animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Eye className="h-3.5 w-3.5" />
          Recent Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        <div
          key={current.id + activeIndex}
          className="rounded-xl bg-muted/20 px-3.5 py-2.5 animate-fade-in"
        >
          <p className="text-sm text-foreground leading-relaxed">{current.text}</p>
        </div>

        {/* Dot indicators */}
        {insights.length > 1 && (
          <div className="flex justify-center gap-1.5">
            {insights.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  i === activeIndex
                    ? 'w-4 bg-primary/60'
                    : 'w-1.5 bg-muted-foreground/25'
                )}
                aria-label={`Pattern ${i + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
