import { useWeeklyTrends } from '@/hooks/useWeeklyTrends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrendBar from '@/components/trends/TrendBar';
import { Loader2, BarChart3 } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';

export default function WeeklyTrends() {
  const { balance, protein, foodSource, portionSize, cost, hasEnoughData, loading, loggedDays } =
    useWeeklyTrends();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <BarChart3 className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Weekly Trends</span>
          </div>
        </div>
      </header>

      <main className="container py-5 space-y-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !hasEnoughData ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Not enough data yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Log food on at least 2 days this week to see trends
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Balance Distribution */}
            <TrendSection title="Balance Distribution">
              <TrendBar items={balance} />
            </TrendSection>

            {/* Protein Consistency */}
            <TrendSection title="Protein Consistency">
              <TrendBar items={protein} />
            </TrendSection>

            {/* Food Source Distribution */}
            {foodSource.length > 0 && (
              <TrendSection title="Food Sources">
                <TrendBar items={foodSource} />
              </TrendSection>
            )}

            {/* Portion Size Usage */}
            {portionSize.length > 0 && (
              <TrendSection title="Portion Sizes">
                <TrendBar items={portionSize} />
              </TrendSection>
            )}

            {/* Cost Distribution */}
            {cost.length > 0 && (
              <TrendSection title="Cost Distribution">
                <TrendBar items={cost} />
              </TrendSection>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function TrendSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {children}
        <p className="text-[11px] text-muted-foreground pt-1">Based on days you logged</p>
      </CardContent>
    </Card>
  );
}
