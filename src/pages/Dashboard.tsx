import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, LogOut, Plus } from 'lucide-react';
import { DIET_TYPE_LABELS } from '@/types/database';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Calieori</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold">
            Hi there! 👋
          </h1>
          <p className="text-muted-foreground">
            {profile?.diet_type && `${DIET_TYPE_LABELS[profile.diet_type]} diet`}
            {profile?.optional_goal && ` • ${profile.optional_goal}`}
          </p>
        </div>

        {/* Daily Snapshot Card */}
        <Card className="animate-fade-in border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Snapshot</CardTitle>
            <CardDescription>Your food balance so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">No logs yet</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">No logs yet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Food Button */}
        <Button
          size="lg"
          className="h-14 w-full rounded-xl text-base font-medium shadow-lg animate-fade-in"
        >
          <Plus className="mr-2 h-5 w-5" />
          Log Food
        </Button>

        {/* Recent Logs */}
        <Card className="animate-fade-in border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Utensils className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No food logged today</p>
              <p className="text-sm text-muted-foreground">
                Tap "Log Food" to get started
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
