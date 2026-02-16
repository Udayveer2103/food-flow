import { Card, CardContent } from '@/components/ui/card';
import { useFoodRhythm, DayCell } from '@/hooks/useFoodRhythm';
import { FoodType } from '@/types/database';
import { cn } from '@/lib/utils';

const SOURCE_TINTS: Partial<Record<FoodType, string>> = {
  mess_meal: 'bg-chart-1/20',
  home_food: 'bg-chart-2/20',
  outside_food: 'bg-chart-3/20',
  milk: 'bg-chart-4/20',
  protein_shake: 'bg-chart-5/20',
  fruit: 'bg-warning/20',
};

function DayBlock({ day }: { day: DayCell }) {
  const tint = day.logged && day.dominantSource
    ? SOURCE_TINTS[day.dominantSource] ?? 'bg-muted/30'
    : 'bg-muted/15';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          'h-8 w-full rounded-lg transition-colors',
          tint,
        )}
      />
      <span className="text-[10px] text-muted-foreground/70">{day.label}</span>
    </div>
  );
}

export default function FoodRhythmCard() {
  const { title, description, days, hasData, loading } = useFoodRhythm();

  if (loading || !hasData) return null;

  return (
    <Card className="border-0 shadow-xs">
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground/75 mb-2">
            Your Food Rhythm
          </p>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="grid grid-cols-7 gap-2 pt-1">
          {days.map((day) => (
            <DayBlock key={day.label} day={day} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
