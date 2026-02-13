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
  calorie: { low: 'Lower', ok: 'Within range', high: 'Higher' },
  protein: { low: 'Lower', ok: 'Within range' },
};

export default function DailySnapshotCard({ snapshot }: Props) {
  const hasLogs = snapshot.logCount > 0;

  return (
    <Card className="border-0 shadow-sm animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">Today's Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        {!hasLogs ? (
          <p className="text-sm text-muted-foreground py-2">
            Nothing logged yet today.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Calories */}
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground mb-2">Calories</p>
              <p className="text-xl font-semibold text-foreground">
                {snapshot.totalCalorieMin}–{snapshot.totalCalorieMax}
              </p>
              <p className={cn('text-xs font-medium mt-1', STATUS_STYLES.calorie[snapshot.calorieStatus])}>
                {STATUS_LABEL.calorie[snapshot.calorieStatus]}
              </p>
            </div>

            {/* Protein */}
            <div className="rounded-xl bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground mb-2">Protein</p>
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
