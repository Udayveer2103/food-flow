import { Card, CardContent } from '@/components/ui/card';
import { DayStatus } from '@/hooks/useFoodLogs';
import { cn } from '@/lib/utils';

interface Props {
  status: DayStatus;
}

export default function EndOfDayStatus({ status }: Props) {
  if (!status) return null;

  return (
    <Card className="border-0 shadow-sm animate-fade-in">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={cn(
            'h-3 w-3 rounded-full',
            status === 'balanced' ? 'bg-success' : 'bg-warning'
          )}
        />
        <div>
          <p className="text-sm font-medium text-foreground">
            {status === 'balanced' ? 'Balanced' : 'Slightly Off'}
          </p>
          <p className="text-xs text-muted-foreground">
            {status === 'balanced'
              ? 'Calories and protein were within range today.'
              : 'Some variation today — nothing unusual.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
