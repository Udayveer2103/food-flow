import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { useMoneyLog } from '@/hooks/useMoneyLog';
import { Button } from '@/components/ui/button';
import { Utensils, LogOut, Plus } from 'lucide-react';
import { DIET_TYPE_LABELS, FOOD_TYPE_LABELS } from '@/types/database';
import { FOOD_TYPE_ICONS } from '@/data/foodPresets';
import { Card, CardContent } from '@/components/ui/card';
import DailySnapshotCard from '@/components/food/DailySnapshotCard';
import FoodLogList from '@/components/food/FoodLogList';
import EndOfDayStatus from '@/components/food/EndOfDayStatus';
import LogFoodSheet from '@/components/food/LogFoodSheet';
import WeeklyReflection from '@/components/weekly/WeeklyReflection';
import RecentPatterns from '@/components/patterns/RecentPatterns';
import DailySpendCard from '@/components/money/DailySpendCard';
import QuickAddRow, { saveLastTemplate } from '@/components/food/QuickAddRow';
import BottomNav from '@/components/layout/BottomNav';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { Loader2, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabValue = 'food' | 'money';

function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEE, d MMM');
}

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const { logs, saving, snapshot, addLog, deleteLog } = useFoodLogs();
  const { days, loading: moneyLoading, todaySpend } = useMoneyLog();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>('food');

  // Wrap addLog to also save last template
  const handleAddLog = async (params: Parameters<typeof addLog>[0]) => {
    const result = await addLog(params);
    if (!result.error && params.food_type && params.food_name) {
      saveLastTemplate(params.food_type, params.food_name);
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Utensils className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Calieori</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container py-6 space-y-8 pb-36">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-base font-medium text-foreground">Hi there 👋</h1>
          {profile?.diet_type && (
            <p className="text-sm text-muted-foreground">
              {DIET_TYPE_LABELS[profile.diet_type]} diet
              {profile.optional_goal && ` · ${profile.optional_goal}`}
            </p>
          )}
        </div>

        {/* Segmented Control */}
        <div className="flex rounded-xl bg-muted/50 p-1 gap-1">
          <button
            onClick={() => setActiveTab('food')}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-150',
              activeTab === 'food'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Food Log
          </button>
          <button
            onClick={() => setActiveTab('money')}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-150',
              activeTab === 'money'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Money Log
          </button>
        </div>

        {/* Food Tab — reordered hierarchy */}
         {activeTab === 'food' && (
           <div className="space-y-8 animate-fade-in">
            {/* 1. Daily Snapshot */}
            <DailySnapshotCard snapshot={snapshot} />

            {/* 2. Quick Add Row */}
            <QuickAddRow
              dietType={profile?.diet_type ?? null}
              saving={saving}
              onQuickAdd={handleAddLog}
            />

            {/* 3. Today's Spend */}
            <DailySpendCard spend={todaySpend} />

            {/* 4. End of Day Status */}
            <EndOfDayStatus status={snapshot.dayStatus} />

            {/* 5. Today's Entries */}
            <FoodLogList logs={logs} onDelete={deleteLog} />

            {/* 6. Weekly Summary */}
            <WeeklyReflection />

            {/* 7. Recent Patterns */}
            <RecentPatterns />
          </div>
        )}

        {/* Money Tab */}
         {activeTab === 'money' && (
           <div className="space-y-8 animate-fade-in">
            {moneyLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : days.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
                  <IndianRupee className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No spending logged yet.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Spending appears when you log outside food or add-ons.
                </p>
              </div>
            ) : (
              days.map((day) => (
              <Card key={day.date} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-foreground">
                        {formatDateLabel(day.date)}
                      </p>
                      <p className="text-sm font-medium text-foreground">₹{day.totalSpend}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                      {day.outsideSpend > 0 && <span>Outside: ₹{day.outsideSpend}</span>}
                      {day.addonSpend > 0 && <span>Add-ons: ₹{day.addonSpend}</span>}
                    </div>
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
          </div>
        )}
      </main>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-14 left-0 right-0 z-20 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          onClick={() => setSheetOpen(true)}
          className="w-full h-12 rounded-2xl text-base font-medium shadow-sm transition-transform duration-150 active:scale-[0.98]"
        >
          <Plus className="mr-2 h-5 w-5" />
          Log Food
        </Button>
      </div>

      <LogFoodSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        dietType={profile?.diet_type ?? null}
        saving={saving}
        onSave={handleAddLog}
      />

      <BottomNav />
    </div>
  );
}
