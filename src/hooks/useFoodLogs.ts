import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType, PortionSize, PriceBand, PORTION_MULTIPLIERS } from '@/types/database';
import { DAILY_CALORIE_TARGET, DAILY_PROTEIN_TARGET } from '@/data/foodPresets';
import { format } from 'date-fns';

export interface FoodLogEntry {
  id: string;
  food_type: FoodType;
  food_name: string | null;
  portion_size: PortionSize;
  calorie_min: number;
  calorie_max: number;
  protein_amount: number;
  price_amount: number | null;
  price_band: PriceBand | null;
  logged_at: string;
}

export type CalorieStatus = 'low' | 'ok' | 'high';
export type ProteinStatus = 'low' | 'ok';
export type DayStatus = 'balanced' | 'slightly_off' | null;

export interface DailySnapshot {
  totalCalorieMin: number;
  totalCalorieMax: number;
  totalProtein: number;
  calorieStatus: CalorieStatus;
  proteinStatus: ProteinStatus;
  dayStatus: DayStatus;
  logCount: number;
}

function getCalorieStatus(min: number, max: number): CalorieStatus {
  const avg = (min + max) / 2;
  if (avg < DAILY_CALORIE_TARGET.min) return 'low';
  if (avg > DAILY_CALORIE_TARGET.max) return 'high';
  return 'ok';
}

function getProteinStatus(amount: number): ProteinStatus {
  return amount >= DAILY_PROTEIN_TARGET ? 'ok' : 'low';
}

function getDayStatus(calorieStatus: CalorieStatus, proteinStatus: ProteinStatus): DayStatus {
  if (calorieStatus === 'ok' && proteinStatus === 'ok') return 'balanced';
  return 'slightly_off';
}

export function useFoodLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('logged_at', { ascending: false });

    if (!error && data) {
      setLogs(data as FoodLogEntry[]);
    }
    setLoading(false);
  }, [user, today]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = async (params: {
    food_type: FoodType;
    food_name: string;
    portion_size: PortionSize;
    calorie_min: number;
    calorie_max: number;
    protein_amount: number;
    price_amount?: number | null;
    price_band?: PriceBand | null;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };
    setSaving(true);

    const multiplier = PORTION_MULTIPLIERS[params.portion_size];
    const adjustedCalMin = Math.round(params.calorie_min * multiplier);
    const adjustedCalMax = Math.round(params.calorie_max * multiplier);
    const adjustedProtein = Math.round(params.protein_amount * multiplier);

    const { error } = await supabase.from('food_logs').insert({
      user_id: user.id,
      date: today,
      food_type: params.food_type,
      food_name: params.food_name,
      portion_size: params.portion_size,
      calorie_min: adjustedCalMin,
      calorie_max: adjustedCalMax,
      protein_amount: adjustedProtein,
      price_amount: params.price_amount ?? null,
      price_band: params.price_band ?? null,
    });

    setSaving(false);
    if (!error) {
      await fetchLogs();
    }
    return { error };
  };

  const deleteLog = async (logId: string) => {
    if (!user) return;
    await supabase.from('food_logs').delete().eq('id', logId);
    await fetchLogs();
  };

  const snapshot: DailySnapshot = (() => {
    const totalCalorieMin = logs.reduce((s, l) => s + l.calorie_min, 0);
    const totalCalorieMax = logs.reduce((s, l) => s + l.calorie_max, 0);
    const totalProtein = logs.reduce((s, l) => s + l.protein_amount, 0);
    const calorieStatus = getCalorieStatus(totalCalorieMin, totalCalorieMax);
    const proteinStatus = getProteinStatus(totalProtein);
    const dayStatus = logs.length > 0 ? getDayStatus(calorieStatus, proteinStatus) : null;

    return {
      totalCalorieMin,
      totalCalorieMax,
      totalProtein,
      calorieStatus,
      proteinStatus,
      dayStatus,
      logCount: logs.length,
    };
  })();

  return { logs, loading, saving, snapshot, addLog, deleteLog, fetchLogs };
}
