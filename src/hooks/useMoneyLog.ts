import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType, PriceBand, FOOD_TYPE_LABELS, PRICE_BAND_LABELS } from '@/types/database';
import { FOOD_TYPE_ICONS } from '@/data/foodPresets';
import { format, subDays } from 'date-fns';

const ADDON_TYPES: FoodType[] = ['milk', 'fruit', 'protein_shake'];

export interface SpendEntry {
  id: string;
  food_type: FoodType;
  food_name: string | null;
  price_amount: number;
  price_band: PriceBand | null;
  logged_at: string;
}

export interface DaySpend {
  date: string;
  outsideSpend: number;
  addonSpend: number;
  totalSpend: number;
  entries: SpendEntry[];
}

export interface TodaySpend {
  outsideSpend: number;
  addonSpend: number;
  totalSpend: number;
  hasData: boolean;
}

export function useMoneyLog() {
  const { user } = useAuth();
  const [days, setDays] = useState<DaySpend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpendData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch last 14 days of logs that have price data
    const startDate = format(subDays(new Date(), 13), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('food_logs')
      .select('id, food_type, food_name, price_amount, price_band, logged_at, date')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .not('price_amount', 'is', null)
      .gt('price_amount', 0)
      .order('date', { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    // Group by date
    const byDate = new Map<string, SpendEntry[]>();
    for (const row of data) {
      const entries = byDate.get(row.date) || [];
      entries.push({
        id: row.id,
        food_type: row.food_type as FoodType,
        food_name: row.food_name,
        price_amount: Number(row.price_amount),
        price_band: row.price_band as PriceBand | null,
        logged_at: row.logged_at!,
      });
      byDate.set(row.date, entries);
    }

    const dayList: DaySpend[] = [];
    for (const [date, entries] of byDate) {
      const outsideSpend = entries
        .filter((e) => e.food_type === 'outside_food')
        .reduce((s, e) => s + e.price_amount, 0);
      const addonSpend = entries
        .filter((e) => ADDON_TYPES.includes(e.food_type))
        .reduce((s, e) => s + e.price_amount, 0);

      dayList.push({
        date,
        outsideSpend,
        addonSpend,
        totalSpend: outsideSpend + addonSpend,
        entries,
      });
    }

    // Sort by date descending
    dayList.sort((a, b) => b.date.localeCompare(a.date));
    setDays(dayList);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSpendData();
  }, [fetchSpendData]);

  // Today's spend for the dashboard card
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayData = days.find((d) => d.date === today);
  const todaySpend: TodaySpend = todayData
    ? {
        outsideSpend: todayData.outsideSpend,
        addonSpend: todayData.addonSpend,
        totalSpend: todayData.totalSpend,
        hasData: true,
      }
    : { outsideSpend: 0, addonSpend: 0, totalSpend: 0, hasData: false };

  return { days, loading, todaySpend, refetch: fetchSpendData };
}
