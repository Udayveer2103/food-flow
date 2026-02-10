import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType, PortionSize, PriceBand, FOOD_TYPE_LABELS, PRICE_BAND_LABELS, PORTION_SIZE_LABELS } from '@/types/database';
import { DAILY_CALORIE_TARGET, DAILY_PROTEIN_TARGET } from '@/data/foodPresets';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

export interface DistributionItem {
  label: string;
  count: number;
  color: string;
}

export interface WeeklyTrends {
  balance: DistributionItem[];
  protein: DistributionItem[];
  foodSource: DistributionItem[];
  portionSize: DistributionItem[];
  cost: DistributionItem[];
  loggedDays: number;
  hasEnoughData: boolean;
  loading: boolean;
}

export function useWeeklyTrends(): WeeklyTrends {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<Omit<WeeklyTrends, 'loading'>>({
    balance: [],
    protein: [],
    foodSource: [],
    portionSize: [],
    cost: [],
    loggedDays: 0,
    hasEnoughData: false,
  });

  const fetchTrends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');

    const { data: logs, error } = await supabase
      .from('food_logs')
      .select('date, food_type, portion_size, calorie_min, calorie_max, protein_amount, price_band')
      .eq('user_id', user.id)
      .gte('date', startStr)
      .lte('date', endStr);

    if (error || !logs) {
      setLoading(false);
      return;
    }

    // Group by date
    const byDate = new Map<string, typeof logs>();
    for (const log of logs) {
      const existing = byDate.get(log.date) || [];
      existing.push(log);
      byDate.set(log.date, existing);
    }

    const loggedDays = byDate.size;
    const hasEnoughData = loggedDays >= 2;

    // Balance distribution
    let balancedCount = 0;
    let slightlyOffCount = 0;
    // Protein distribution
    let proteinLow = 0;
    let proteinOk = 0;

    for (const [, dayLogs] of byDate) {
      const calMin = dayLogs.reduce((s, l) => s + l.calorie_min, 0);
      const calMax = dayLogs.reduce((s, l) => s + l.calorie_max, 0);
      const protein = dayLogs.reduce((s, l) => s + l.protein_amount, 0);
      const avg = (calMin + calMax) / 2;
      const calOk = avg >= DAILY_CALORIE_TARGET.min && avg <= DAILY_CALORIE_TARGET.max;
      const protOk = protein >= DAILY_PROTEIN_TARGET;

      if (calOk && protOk) balancedCount++;
      else slightlyOffCount++;

      if (protOk) proteinOk++;
      else proteinLow++;
    }

    // Food source distribution
    const sourceCounts = new Map<FoodType, number>();
    const portionCounts = new Map<PortionSize, number>();
    const costCounts = new Map<PriceBand, number>();

    for (const log of logs) {
      const ft = log.food_type as FoodType;
      sourceCounts.set(ft, (sourceCounts.get(ft) || 0) + 1);
      const ps = log.portion_size as PortionSize;
      portionCounts.set(ps, (portionCounts.get(ps) || 0) + 1);
      if (log.price_band) {
        const pb = log.price_band as PriceBand;
        costCounts.set(pb, (costCounts.get(pb) || 0) + 1);
      }
    }

    // Muted colors from design system
    const balance: DistributionItem[] = [
      { label: 'Balanced', count: balancedCount, color: 'hsl(var(--success))' },
      { label: 'Slightly Off', count: slightlyOffCount, color: 'hsl(var(--muted))' },
    ];

    const protein: DistributionItem[] = [
      { label: 'OK', count: proteinOk, color: 'hsl(var(--protein-ok))' },
      { label: 'Low', count: proteinLow, color: 'hsl(var(--muted))' },
    ];

    const sourceLabels: Partial<Record<FoodType, string>> = {
      mess_meal: 'Mess',
      home_food: 'Home',
      outside_food: 'Outside',
    };
    const sourceColors: Partial<Record<FoodType, string>> = {
      mess_meal: 'hsl(var(--chart-1))',
      home_food: 'hsl(var(--chart-2))',
      outside_food: 'hsl(var(--chart-3))',
      milk: 'hsl(var(--chart-4))',
      protein_shake: 'hsl(var(--chart-5))',
      fruit: 'hsl(var(--warning))',
    };

    const foodSource: DistributionItem[] = [];
    for (const [type, count] of sourceCounts) {
      foodSource.push({
        label: sourceLabels[type] || FOOD_TYPE_LABELS[type],
        count,
        color: sourceColors[type] || 'hsl(var(--muted))',
      });
    }
    foodSource.sort((a, b) => b.count - a.count);

    const portionLabels: Record<PortionSize, string> = {
      smaller: 'Smaller',
      usual: 'Usual',
      heavier: 'Heavier',
    };
    const portionColors: Record<PortionSize, string> = {
      smaller: 'hsl(var(--chart-3))',
      usual: 'hsl(var(--chart-1))',
      heavier: 'hsl(var(--chart-4))',
    };

    const portionSize: DistributionItem[] = (['smaller', 'usual', 'heavier'] as PortionSize[])
      .map((ps) => ({
        label: portionLabels[ps],
        count: portionCounts.get(ps) || 0,
        color: portionColors[ps],
      }))
      .filter((i) => i.count > 0);

    const costLabels: Record<PriceBand, string> = { low: '₹', medium: '₹₹', high: '₹₹₹' };
    const costColors: Record<PriceBand, string> = {
      low: 'hsl(var(--success))',
      medium: 'hsl(var(--warning))',
      high: 'hsl(var(--calorie-high))',
    };

    const cost: DistributionItem[] = (['low', 'medium', 'high'] as PriceBand[])
      .map((pb) => ({
        label: costLabels[pb],
        count: costCounts.get(pb) || 0,
        color: costColors[pb],
      }))
      .filter((i) => i.count > 0);

    setTrends({ balance, protein, foodSource, portionSize, cost, loggedDays, hasEnoughData });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return { ...trends, loading };
}
