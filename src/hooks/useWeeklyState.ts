import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { EatingState } from '@/hooks/useDailyState';

export interface WeeklyStateResult {
  eatingTone: 'Leaning Light' | 'Leaning Heavy' | 'Varied' | null;
  stateStability: 'Steady' | 'Varied' | null;
  /** Map of date -> state for rhythm correlation */
  stateByDate: Map<string, EatingState>;
  hasData: boolean;
  loading: boolean;
}

export function useWeeklyState(): WeeklyStateResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Omit<WeeklyStateResult, 'loading'>>({
    eatingTone: null,
    stateStability: null,
    stateByDate: new Map(),
    hasData: false,
  });

  const compute = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const ws = startOfWeek(now, { weekStartsOn: 1 });
    const we = endOfWeek(now, { weekStartsOn: 1 });

    const { data, error } = await supabase
      .from('daily_state')
      .select('date, state')
      .eq('user_id', user.id)
      .gte('date', format(ws, 'yyyy-MM-dd'))
      .lte('date', format(we, 'yyyy-MM-dd'));

    if (error || !data || data.length < 3) {
      setResult({ eatingTone: null, stateStability: null, stateByDate: new Map(), hasData: false });
      setLoading(false);
      return;
    }

    const stateByDate = new Map<string, EatingState>();
    const counts: Record<EatingState, number> = { light: 0, neutral: 0, heavy: 0 };
    for (const row of data) {
      const s = row.state as EatingState;
      counts[s]++;
      stateByDate.set(row.date, s);
    }

    const total = data.length;
    let eatingTone: WeeklyStateResult['eatingTone'] = 'Varied';
    if (counts.light / total >= 0.5) eatingTone = 'Leaning Light';
    else if (counts.heavy / total >= 0.5) eatingTone = 'Leaning Heavy';

    const maxCount = Math.max(counts.light, counts.neutral, counts.heavy);
    const stateStability: WeeklyStateResult['stateStability'] =
      maxCount / total >= 0.6 ? 'Steady' : 'Varied';

    setResult({ eatingTone, stateStability, stateByDate, hasData: true });
    setLoading(false);
  }, [user]);

  useEffect(() => { compute(); }, [compute]);

  return { ...result, loading };
}
