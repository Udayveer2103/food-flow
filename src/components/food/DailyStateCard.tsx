import { Card, CardContent } from '@/components/ui/card';
import { useDailyState, EatingState } from '@/hooks/useDailyState';
import { cn } from '@/lib/utils';

const OPTIONS: { value: EatingState; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'heavy', label: 'Heavy' },
];

export default function DailyStateCard() {
  const { state, loading, saving, setState } = useDailyState();

  if (loading) return null;

  return (
    <Card className="border-0 shadow-xs animate-fade-in">
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">Today's State</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">Optional reflection</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2.5">How did eating feel today?</p>
          <div className="flex rounded-xl bg-muted/30 p-1 gap-1">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setState(opt.value)}
                disabled={saving}
                className={cn(
                  'flex-1 rounded-lg py-2 text-xs font-medium transition-all duration-150',
                  state === opt.value
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
