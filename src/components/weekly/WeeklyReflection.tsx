import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRICE_BAND_LABELS } from '@/types/database';
import { useWeeklyReflection } from '@/hooks/useWeeklyReflection';
import { format, parseISO } from 'date-fns';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function WeeklyReflection() {
  const { dots, balancedDays, avgProtein, mostCommonSource, predominantPriceBand, hasEnoughData, loading, loggedDays } =
    useWeeklyReflection();

  if (loading) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Streak text — always visible if any logs */}
      {loggedDays > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {balancedDays === 0
            ? 'Balance was varied this week'
            : balancedDays >= 5
              ? 'Balance was steady this week'
              : `${balancedDays} of ${loggedDays} logged days were balanced`}
        </p>
      )}

      {/* Consistency dots — always visible */}
      {dots.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5 pb-4">
            <div className="flex justify-center gap-3">
              {dots.map((dot, i) => (
                <div key={dot.date} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-medium">{DAY_LABELS[i]}</span>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      dot.balanced
                        ? 'bg-[hsl(var(--success))]'
                        : 'border-2 border-border bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Based on days you logged
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary card — only if >= 2 logged days */}
      {hasEnoughData && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Row
              label="Balance"
              value={
                balancedDays === 0
                  ? 'Mixed'
                  : balancedDays >= loggedDays * 0.7
                    ? 'Steady'
                    : 'Varied'
              }
            />
            <Row label="Protein" value={`~${avgProtein}g avg`} />
            {mostCommonSource && <Row label="Frequent source" value={mostCommonSource} />}
            {predominantPriceBand && (
              <Row label="Typical spend" value={PRICE_BAND_LABELS[predominantPriceBand]} />
            )}
            <p className="text-[11px] text-muted-foreground pt-1">
              Based on days you logged
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
