import { Card, CardContent } from '@/components/ui/card';
import { useFoodRhythm, DayCell } from '@/hooks/useFoodRhythm';
import { FoodType } from '@/types/database';
import { EatingState } from '@/hooks/useDailyState';
import { cn } from '@/lib/utils';

// Muted, calm base tones per source
// Muted base tones with increased hue separation
const SOURCE_COLORS: Partial<Record<FoodType, { h: number; s: number; l: number }>> = {
  mess_meal:     { h: 25, s: 35, l: 68 },   // warm clay
  home_food:     { h: 140, s: 14, l: 65 },   // cool sage-grey
  outside_food:  { h: 15, s: 28, l: 58 },    // deep cocoa-brown
  milk:          { h: 45, s: 22, l: 72 },
  protein_shake: { h: 200, s: 18, l: 68 },
  fruit:         { h: 55, s: 28, l: 70 },
};

// State intensity — lightness delta only, no hue shift
const STATE_LIGHTNESS_DELTA: Record<EatingState, number> = {
  light: 13,    // +13% lightness
  neutral: 0,   // base
  heavy: -13,   // −13% lightness
};

function getDayColor(day: DayCell): string | undefined {
  if (!day.logged || !day.dominantSource) return undefined;
  const color = SOURCE_COLORS[day.dominantSource];
  if (!color) return undefined;
  const delta = day.state ? STATE_LIGHTNESS_DELTA[day.state] : 0;
  const l = Math.min(90, Math.max(30, color.l + delta));
  return `hsl(${color.h} ${color.s}% ${l}%)`;
}

function DayBlock({ day }: { day: DayCell }) {
  const bg = getDayColor(day);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="h-8 w-full rounded-lg transition-all duration-200"
        style={bg ? { backgroundColor: bg } : undefined}
        {...(!bg && { className: 'h-8 w-full rounded-lg transition-all duration-200 bg-muted/15' })}
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
