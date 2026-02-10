import { DistributionItem } from '@/hooks/useWeeklyTrends';

interface TrendBarProps {
  items: DistributionItem[];
}

export default function TrendBar({ items }: TrendBarProps) {
  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
            {item.label}
          </span>
          <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max((item.count / maxCount) * 100, 4)}%`,
                backgroundColor: item.color,
                opacity: 0.75,
              }}
            />
          </div>
        </div>
      ))}
      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color, opacity: 0.75 }}
            />
            <span className="text-[11px] text-muted-foreground">
              {item.label} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
