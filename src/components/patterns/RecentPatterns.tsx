import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentPatterns } from '@/hooks/useRecentPatterns';
import { Eye } from 'lucide-react';

export default function RecentPatterns() {
  const { insights, hasEnoughData, loading } = useRecentPatterns();

  if (loading || !hasEnoughData || insights.length === 0) return null;

  return (
    <Card className="border-0 shadow-md animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          Your Recent Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl bg-muted/20 px-3.5 py-2.5"
          >
            <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground pt-1">
          Based on days you logged
        </p>
      </CardContent>
    </Card>
  );
}
