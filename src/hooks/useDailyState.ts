import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

export type EatingState = 'light' | 'neutral' | 'heavy';

export interface DailyStateResult {
  state: EatingState | null;
  loading: boolean;
  saving: boolean;
  setState: (s: EatingState) => Promise<void>;
}

export function useDailyState(): DailyStateResult {
  const { user } = useAuth();
  const [state, setStateVal] = useState<EatingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('daily_state')
      .select('state')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();
    if (data) setStateVal(data.state as EatingState);
    setLoading(false);
  }, [user, today]);

  useEffect(() => { fetch(); }, [fetch]);

  const setState = async (s: EatingState) => {
    if (!user) return;
    setSaving(true);
    setStateVal(s);

    const { data: existing } = await supabase
      .from('daily_state')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('daily_state')
        .update({ state: s })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('daily_state')
        .insert({ user_id: user.id, date: today, state: s });
    }
    setSaving(false);
  };

  return { state, loading, saving, setState };
}
