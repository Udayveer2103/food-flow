import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType } from '@/types/database';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

export type Archetype =
  | 'mess_centered'
  | 'outside_exploring'
  | 'protein_steady'
  | 'mixed'
  | 'rice_heavy';

const ARCHETYPE_META: Record<Archetype, { title: string; description: string }> = {
  mess_centered: {
    title: 'Mess-Centered Routine',
    description: 'Most of your recent meals came from the mess.',
  },
  outside_exploring: {
    title: 'Outside-Exploring Pattern',
    description: 'Outside food appeared frequently in recent days.',
  },
  protein_steady: {
    title: 'Protein-Steady Days',
    description: 'Protein intake remained consistent across logged days.',
  },
  mixed: {
    title: 'Mixed Pattern',
    description: 'Your food sources varied across the week.',
  },
  rice_heavy: {
    title: 'Rice-Heavy Week',
    description: 'Heavier meals appeared more often in recent logs.',
  },
};

export interface DayCell {
  label: string; // Mon, Tue, ...
  logged: boolean;
  dominantSource: FoodType | null;
}

export interface FoodRhythm {
  archetype: Archetype;
  title: string;
  description: string;
  days: DayCell[];
  hasData: boolean;
  loading: boolean;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function useFoodRhythm(): FoodRhythm {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Omit<FoodRhythm, 'loading'>>({
    archetype: 'mixed',
    title: ARCHETYPE_META.mixed.title,
    description: ARCHETYPE_META.mixed.description,
    days: DAY_LABELS.map((l) => ({ label: l, logged: false, dominantSource: null })),
    hasData: false,
  });

  const compute = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const { data: logs, error } = await supabase
      .from('food_logs')
      .select('date, food_type, portion_size, protein_amount')
      .eq('user_id', user.id)
      .gte('date', format(weekStart, 'yyyy-MM-dd'))
      .lte('date', format(weekEnd, 'yyyy-MM-dd'));

    if (error || !logs || logs.length === 0) {
      setLoading(false);
      return;
    }

    // Build day map
    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const byDate = new Map<string, typeof logs>();
    for (const log of logs) {
      const arr = byDate.get(log.date) || [];
      arr.push(log);
      byDate.set(log.date, arr);
    }

    // Build day cells
    const days: DayCell[] = allDays.map((d, i) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayLogs = byDate.get(dateStr);
      if (!dayLogs || dayLogs.length === 0) {
        return { label: DAY_LABELS[i], logged: false, dominantSource: null };
      }
      // Find dominant food type
      const counts = new Map<FoodType, number>();
      for (const l of dayLogs) {
        const ft = l.food_type as FoodType;
        counts.set(ft, (counts.get(ft) || 0) + 1);
      }
      let dominant: FoodType = 'mess_meal';
      let maxCount = 0;
      for (const [ft, c] of counts) {
        if (c > maxCount) { dominant = ft; maxCount = c; }
      }
      return { label: DAY_LABELS[i], logged: true, dominantSource: dominant };
    });

    // Determine archetype
    const totalLogs = logs.length;
    const sourceTotals = new Map<FoodType, number>();
    for (const l of logs) {
      const ft = l.food_type as FoodType;
      sourceTotals.set(ft, (sourceTotals.get(ft) || 0) + 1);
    }

    const messCount = sourceTotals.get('mess_meal') || 0;
    const outsideCount = sourceTotals.get('outside_food') || 0;
    const heavierCount = logs.filter((l) => l.portion_size === 'heavier').length;

    // Check protein consistency
    const dailyProteins: number[] = [];
    for (const [, dayLogs] of byDate) {
      dailyProteins.push(dayLogs.reduce((s, l) => s + l.protein_amount, 0));
    }
    const avgProtein = dailyProteins.length > 0
      ? dailyProteins.reduce((a, b) => a + b, 0) / dailyProteins.length
      : 0;
    const proteinVariance = dailyProteins.length > 1
      ? dailyProteins.reduce((s, p) => s + Math.abs(p - avgProtein), 0) / dailyProteins.length
      : 0;
    const proteinSteady = avgProtein > 0 && proteinVariance < avgProtein * 0.25;

    let archetype: Archetype = 'mixed';
    if (messCount / totalLogs >= 0.5) {
      archetype = 'mess_centered';
    } else if (outsideCount / totalLogs >= 0.4) {
      archetype = 'outside_exploring';
    } else if (proteinSteady && dailyProteins.length >= 3) {
      archetype = 'protein_steady';
    } else if (heavierCount / totalLogs >= 0.4) {
      archetype = 'rice_heavy';
    }

    const meta = ARCHETYPE_META[archetype];

    setResult({
      archetype,
      title: meta.title,
      description: meta.description,
      days,
      hasData: true,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { ...result, loading };
}
