import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFoodLogs } from '@/hooks/useFoodLogs';
import { Button } from '@/components/ui/button';
import { Utensils, LogOut, Plus } from 'lucide-react';
import { DIET_TYPE_LABELS } from '@/types/database';
import DailySnapshotCard from '@/components/food/DailySnapshotCard';
import FoodLogList from '@/components/food/FoodLogList';
import EndOfDayStatus from '@/components/food/EndOfDayStatus';
import LogFoodSheet from '@/components/food/LogFoodSheet';

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const { logs, saving, snapshot, addLog, deleteLog } = useFoodLogs();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Utensils className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Calieori</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container py-5 space-y-4 pb-24">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-xl font-bold">Hi there! 👋</h1>
          {profile?.diet_type && (
            <p className="text-sm text-muted-foreground">
              {DIET_TYPE_LABELS[profile.diet_type]} diet
              {profile.optional_goal && ` · ${profile.optional_goal}`}
            </p>
          )}
        </div>

        {/* Snapshot */}
        <DailySnapshotCard snapshot={snapshot} />

        {/* End of day status */}
        <EndOfDayStatus status={snapshot.dayStatus} />

        {/* Food log list */}
        <FoodLogList logs={logs} onDelete={deleteLog} />
      </main>

      {/* Floating add button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
        <Button
          size="lg"
          onClick={() => setSheetOpen(true)}
          className="h-14 px-8 rounded-2xl text-base font-medium shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Log Food
        </Button>
      </div>

      {/* Log food sheet */}
      <LogFoodSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        dietType={profile?.diet_type ?? null}
        saving={saving}
        onSave={addLog}
      />
    </div>
  );
}
