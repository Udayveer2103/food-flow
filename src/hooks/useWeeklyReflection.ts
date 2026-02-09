import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType, PriceBand, FOOD_TYPE_LABELS } from '@/types/database';
import { DAILY_CALORIE_TARGET, DAILY_PROTEIN_TARGET } from '@/data/foodPresets';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

interface DayResult {
  date: string;
  balanced: boolean;
}

export interface WeeklyReflection {
  /** Number of days with at least one log */
  loggedDays: number;
  /** Number of balanced days */
  balancedDays: number;
  /** Average protein across logged days */
  avgProtein: number;
  /** Most common food source label */
  mostCommonSource: string | null;
  /** Predominant price band */
  predominantPriceBand: PriceBand | null;
  /** Per-day dot data for Mon–Sun */
  dots: DayResult[];
  /** Whether we have enough data to show (>= 2 logged days) */
  hasEnoughData: boolean;
  loading: boolean;
}

export function useWeeklyReflection(): WeeklyReflection {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState<Omit<WeeklyReflection, 'loading'>>({
    loggedDays: 0,
    balancedDays: 0,
    avgProtein: 0,
    mostCommonSource: null,
    predominantPriceBand: null,
    dots: [],
    hasEnoughData: false,
  });

  const fetchWeeklyData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');

    const { data: logs, error } = await supabase
      .from('food_logs')
      .select('date, food_type, calorie_min, calorie_max, protein_amount, price_band')
      .eq('user_id', user.id)
      .gte('date', startStr)
      .lte('date', endStr);

    if (error || !logs) {
      setLoading(false);
      return;
    }

    // Group logs by date
    const byDate = new Map<string, typeof logs>();
    for (const log of logs) {
      const existing = byDate.get(log.date) || [];
      existing.push(log);
      byDate.set(log.date, existing);
    }

    const loggedDays = byDate.size;
    const hasEnoughData = loggedDays >= 2;

    // Calculate per-day status
    let balancedDays = 0;
    let totalProtein = 0;
    const foodTypeCounts = new Map<FoodType, number>();
    const priceBandCounts = new Map<PriceBand, number>();

    const dots: DayResult[] = allDays.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayLogs = byDate.get(dateStr);
      if (!dayLogs || dayLogs.length === 0) {
        return { date: dateStr, balanced: false };
      }

      const calMin = dayLogs.reduce((s, l) => s + l.calorie_min, 0);
      const calMax = dayLogs.reduce((s, l) => s + l.calorie_max, 0);
      const protein = dayLogs.reduce((s, l) => s + l.protein_amount, 0);
      totalProtein += protein;

      const avg = (calMin + calMax) / 2;
      const calOk = avg >= DAILY_CALORIE_TARGET.min && avg <= DAILY_CALORIE_TARGET.max;
      const protOk = protein >= DAILY_PROTEIN_TARGET;
      const balanced = calOk && protOk;
      if (balanced) balancedDays++;

      // Count food types & price bands
      for (const log of dayLogs) {
        foodTypeCounts.set(log.food_type as FoodType, (foodTypeCounts.get(log.food_type as FoodType) || 0) + 1);
        if (log.price_band) {
          priceBandCounts.set(log.price_band as PriceBand, (priceBandCounts.get(log.price_band as PriceBand) || 0) + 1);
        }
      }

      return { date: dateStr, balanced };
    });

    // Most common food source
    let mostCommonSource: string | null = null;
    let maxCount = 0;
    for (const [type, count] of foodTypeCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonSource = FOOD_TYPE_LABELS[type];
      }
    }

    // Predominant price band
    let predominantPriceBand: PriceBand | null = null;
    let maxPB = 0;
    for (const [band, count] of priceBandCounts) {
      if (count > maxPB) {
        maxPB = count;
        predominantPriceBand = band;
      }
    }

    const avgProtein = loggedDays > 0 ? Math.round(totalProtein / loggedDays) : 0;

    setReflection({
      loggedDays,
      balancedDays,
      avgProtein,
      mostCommonSource,
      predominantPriceBand,
      dots,
      hasEnoughData,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWeeklyData();
  }, [fetchWeeklyData]);

  return { ...reflection, loading };
}
