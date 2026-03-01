import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType } from '@/types/database';
import { EatingState } from '@/hooks/useDailyState';
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
  label: string;
  logged: boolean;
  dominantSource: FoodType | null;
  state: EatingState | null;
}

export interface FoodRhythm {
  archetype: Archetype;
  title: string;
  description: string;
  days: DayCell[];
  hasData: boolean;
  loading: boolean;
  correlation: string | null;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function useFoodRhythm(): FoodRhythm {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Omit<FoodRhythm, 'loading'>>({
    archetype: 'mixed',
    title: ARCHETYPE_META.mixed.title,
    description: ARCHETYPE_META.mixed.description,
    days: DAY_LABELS.map((l) => ({ label: l, logged: false, dominantSource: null, state: null })),
    hasData: false,
    correlation: null,
  });

  const compute = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');

    // Fetch food logs and state in parallel
    const [logsRes, stateRes] = await Promise.all([
      supabase
        .from('food_logs')
        .select('date, food_type, portion_size, protein_amount')
        .eq('user_id', user.id)
        .gte('date', startStr)
        .lte('date', endStr),
      supabase
        .from('daily_state')
        .select('date, state')
        .eq('user_id', user.id)
        .gte('date', startStr)
        .lte('date', endStr),
    ]);

    const logs = logsRes.data;
    if (logsRes.error || !logs || logs.length === 0) {
      setLoading(false);
      return;
    }

    // Build state map
    const stateMap = new Map<string, EatingState>();
    if (stateRes.data) {
      for (const row of stateRes.data) {
        stateMap.set(row.date, row.state as EatingState);
      }
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
      const dayState = stateMap.get(dateStr) || null;
      if (!dayLogs || dayLogs.length === 0) {
        return { label: DAY_LABELS[i], logged: false, dominantSource: null, state: dayState };
      }
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
      return { label: DAY_LABELS[i], logged: true, dominantSource: dominant, state: dayState };
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

    // Compute state-source correlation
    let correlation: string | null = null;
    const daysWithBoth = days.filter((d) => d.logged && d.state && d.dominantSource);
    if (daysWithBoth.length >= 3) {
      const heavyDays = daysWithBoth.filter((d) => d.state === 'heavy');
      const lightDays = daysWithBoth.filter((d) => d.state === 'light');

      if (heavyDays.length >= 2) {
        const outsideHeavy = heavyDays.filter((d) => d.dominantSource === 'outside_food').length;
        if (outsideHeavy / heavyDays.length >= 0.6) {
          correlation = 'Outside meals appeared more often on heavier days.';
        }
      }
      if (!correlation && lightDays.length >= 2) {
        const homeLight = lightDays.filter((d) => d.dominantSource === 'home_food').length;
        const messLight = lightDays.filter((d) => d.dominantSource === 'mess_meal').length;
        if (homeLight / lightDays.length >= 0.6) {
          correlation = 'Home meals appeared more often on lighter days.';
        } else if (messLight / lightDays.length >= 0.6) {
          correlation = 'Mess meals appeared more often on lighter days.';
        }
      }
    }

    const meta = ARCHETYPE_META[archetype];
    setResult({
      archetype,
      title: meta.title,
      description: meta.description,
      days,
      hasData: true,
      correlation,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { ...result, loading };
}
