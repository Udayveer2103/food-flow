import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailySnapshot } from '@/hooks/useFoodLogs';
import { cn } from '@/lib/utils';

interface Props {
  snapshot: DailySnapshot;
}

const STATUS_STYLES = {
  calorie: {
    low: 'text-calorie-low',
    ok: 'text-calorie-ok',
    high: 'text-calorie-high',
  },
  protein: {
    low: 'text-protein-low',
    ok: 'text-protein-ok',
  },
};

const STATUS_LABEL = {
  calorie: { low: 'Low', ok: 'On track', high: 'High' },
  protein: { low: 'Low', ok: 'On track' },
};

export default function DailySnapshotCard({ snapshot }: Props) {
  const hasLogs = snapshot.logCount > 0;

  return (
    <Card className="border-0 shadow-md animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Today's Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasLogs ? (
          <p className="text-sm text-muted-foreground py-2">
            No food logged yet today.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Calories */}
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground mb-1">Calories</p>
              <p className="text-xl font-semibold text-foreground">
                {snapshot.totalCalorieMin}–{snapshot.totalCalorieMax}
              </p>
              <p className={cn('text-xs font-medium mt-1', STATUS_STYLES.calorie[snapshot.calorieStatus])}>
                {STATUS_LABEL.calorie[snapshot.calorieStatus]}
              </p>
            </div>

            {/* Protein */}
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground mb-1">Protein</p>
              <p className="text-xl font-semibold text-foreground">
                {snapshot.totalProtein}g
              </p>
              <p className={cn('text-xs font-medium mt-1', STATUS_STYLES.protein[snapshot.proteinStatus])}>
                {STATUS_LABEL.protein[snapshot.proteinStatus]}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
