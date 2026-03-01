import { Card, CardContent } from '@/components/ui/card';
import { useFoodRhythm, DayCell } from '@/hooks/useFoodRhythm';
import { FoodType } from '@/types/database';
import { EatingState } from '@/hooks/useDailyState';
import { cn } from '@/lib/utils';

// Muted, calm base tones per source
const SOURCE_BASE: Partial<Record<FoodType, string>> = {
  mess_meal: 'bg-[hsl(35_30%_78%)]',      // warm beige
  home_food: 'bg-[hsl(90_12%_72%)]',       // olive-grey
  outside_food: 'bg-[hsl(30_25%_72%)]',    // sand/brown
  milk: 'bg-[hsl(45_20%_80%)]',
  protein_shake: 'bg-[hsl(200_15%_75%)]',
  fruit: 'bg-[hsl(50_25%_78%)]',
};

// State intensity modifiers (opacity-based lightness shift)
const STATE_OPACITY: Record<EatingState, string> = {
  light: 'opacity-60',
  neutral: 'opacity-80',
  heavy: 'opacity-100',
};

function DayBlock({ day }: { day: DayCell }) {
  const base = day.logged && day.dominantSource
    ? SOURCE_BASE[day.dominantSource] ?? 'bg-muted/30'
    : 'bg-muted/15';

  const intensity = day.state ? STATE_OPACITY[day.state] : 'opacity-75';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          'h-8 w-full rounded-lg transition-all duration-200',
          base,
          day.logged && intensity,
        )}
      />
      <span className="text-[10px] text-muted-foreground/70">{day.label}</span>
    </div>
  );
}

export default function FoodRhythmCard() {
  const { title, description, days, hasData, loading, correlation } = useFoodRhythm();

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
        {correlation && (
          <p className="text-xs text-muted-foreground/65 pt-1">{correlation}</p>
        )}
      </CardContent>
    </Card>
  );
}
