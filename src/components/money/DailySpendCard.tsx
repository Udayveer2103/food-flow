import { Card, CardContent } from '@/components/ui/card';
import { TodaySpend } from '@/hooks/useMoneyLog';
import { IndianRupee } from 'lucide-react';

interface Props {
  spend: TodaySpend;
}

export default function DailySpendCard({ spend }: Props) {
  if (!spend.hasData) return null;

  return (
    <Card className="border-0 shadow-sm animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40">
            <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Today's Spend</p>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-semibold text-foreground">₹{spend.totalSpend}</span>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          {spend.outsideSpend > 0 && (
            <span>Outside: ₹{spend.outsideSpend}</span>
          )}
          {spend.addonSpend > 0 && (
            <span>Add-ons: ₹{spend.addonSpend}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
