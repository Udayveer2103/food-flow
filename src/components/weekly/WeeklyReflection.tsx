import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRICE_BAND_LABELS } from '@/types/database';
import { useWeeklyReflection } from '@/hooks/useWeeklyReflection';
import { useWeeklyState } from '@/hooks/useWeeklyState';
import { format, parseISO } from 'date-fns';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function WeeklyReflection() {
  const { dots, balancedDays, avgProtein, mostCommonSource, predominantPriceBand, hasEnoughData, loading, loggedDays } =
    useWeeklyReflection();
  const weeklyState = useWeeklyState();

  if (loading) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Streak text — always visible if any logs */}
       {loggedDays > 0 && (
         <p className="text-xs text-muted-foreground/75 text-center">
           {balancedDays === 0
             ? 'Balance was mixed this week'
             : balancedDays >= 5
               ? 'Balance was steady this week'
               : 'Balance varied across logged days'}
         </p>
       )}

       {/* Consistency dots — always visible */}
       {dots.length > 0 && (
         <Card className="border-0 shadow-xs">
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              {dots.map((dot, i) => (
                <div key={dot.date} className="flex flex-col items-center gap-2">
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
          </CardContent>
        </Card>
      )}

       {/* Summary card — only if >= 2 logged days */}
       {hasEnoughData && (
         <Card className="border-0 shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-2">
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
            {mostCommonSource && <Row label="Top source" value={mostCommonSource} />}
            {predominantPriceBand && (
              <Row label="Typical spend" value={PRICE_BAND_LABELS[predominantPriceBand]} />
            )}
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
