import { useState, useEffect } from 'react';
import { DistributionItem } from '@/hooks/useWeeklyTrends';

interface TrendBarProps {
  items: DistributionItem[];
}

export default function TrendBar({ items }: TrendBarProps) {
  const total = items.reduce((s, i) => s + i.count, 0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (total === 0) return null;

  return (
     <div className="space-y-6">
       {/* Single stacked horizontal bar */}
       <div className="h-3 flex rounded-full overflow-hidden bg-muted/30 my-2">
        {items.map((item, idx) => {
          const pct = (item.count / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={item.label}
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: animated ? `${pct}%` : '0%',
                backgroundColor: item.color,
                opacity: 0.75,
                borderTopLeftRadius: idx === 0 ? '9999px' : 0,
                borderBottomLeftRadius: idx === 0 ? '9999px' : 0,
                borderTopRightRadius: idx === items.length - 1 || items.slice(idx + 1).every(i => i.count === 0) ? '9999px' : 0,
                borderBottomRightRadius: idx === items.length - 1 || items.slice(idx + 1).every(i => i.count === 0) ? '9999px' : 0,
              }}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {items.filter(i => i.count > 0).map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color, opacity: 0.75 }}
            />
            <span className="text-[11px] text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
