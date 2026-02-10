import { useMoneyLog } from '@/hooks/useMoneyLog';
import { Card, CardContent } from '@/components/ui/card';
import { FOOD_TYPE_LABELS } from '@/types/database';
import { FOOD_TYPE_ICONS } from '@/data/foodPresets';
import { Loader2, IndianRupee } from 'lucide-react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import BottomNav from '@/components/layout/BottomNav';

function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEE, d MMM');
}

export default function MoneyLog() {
  const { days, loading } = useMoneyLog();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <IndianRupee className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Money Log</span>
          </div>
        </div>
      </header>

      <main className="container py-5 space-y-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : days.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
              <IndianRupee className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No spend data yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Prices are logged when you add outside food or add-ons
            </p>
          </div>
        ) : (
          days.map((day) => (
            <Card key={day.date} className="border-0 shadow-md animate-fade-in">
              <CardContent className="pt-5 pb-4">
                {/* Day header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {formatDateLabel(day.date)}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    ₹{day.totalSpend}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                  {day.outsideSpend > 0 && <span>Outside: ₹{day.outsideSpend}</span>}
                  {day.addonSpend > 0 && <span>Add-ons: ₹{day.addonSpend}</span>}
                </div>

                {/* Entries */}
                <div className="space-y-1.5">
                  {day.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl bg-muted/20 px-3 py-2.5"
                    >
                      <span className="text-base">
                        {FOOD_TYPE_ICONS[entry.food_type]}
                      </span>
                      <span className="flex-1 text-sm text-foreground truncate">
                        {entry.food_name || FOOD_TYPE_LABELS[entry.food_type]}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        ₹{entry.price_amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
