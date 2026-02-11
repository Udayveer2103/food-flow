import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FoodType, FOOD_TYPE_LABELS } from '@/types/database';
import { DAILY_CALORIE_TARGET, DAILY_PROTEIN_TARGET } from '@/data/foodPresets';
import { startOfWeek, endOfWeek, format, getHours, isWeekend } from 'date-fns';

export interface PatternInsight {
  id: string;
  text: string;
  type: 'weekly' | 'situational';
}

export interface RecentPatterns {
  insights: PatternInsight[];
  hasEnoughData: boolean;
  loading: boolean;
}

export function useRecentPatterns(): RecentPatterns {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  const fetchPatterns = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');

    const { data: logs, error } = await supabase
      .from('food_logs')
      .select('date, food_type, calorie_min, calorie_max, protein_amount, logged_at, food_name')
      .eq('user_id', user.id)
      .gte('date', startStr)
      .lte('date', endStr);

    if (error || !logs || logs.length === 0) {
      setLoading(false);
      setHasEnoughData(false);
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
    if (loggedDays < 2) {
      setLoading(false);
      setHasEnoughData(false);
      return;
    }

    setHasEnoughData(true);
    const weeklyInsights: PatternInsight[] = [];
    const situationalInsights: PatternInsight[] = [];

    // --- WEEKLY PATTERNS (up to 2) ---

    // 1. Protein Pattern
    let proteinOkDays = 0;
    let proteinLowDays = 0;
    for (const [, dayLogs] of byDate) {
      const protein = dayLogs.reduce((s, l) => s + l.protein_amount, 0);
      if (protein >= DAILY_PROTEIN_TARGET) proteinOkDays++;
      else proteinLowDays++;
    }

    if (proteinOkDays > 0 || proteinLowDays > 0) {
      const ratio = proteinOkDays / loggedDays;
      if (ratio >= 0.7) {
        weeklyInsights.push({ id: 'protein', type: 'weekly', text: 'Protein levels were steady on most logged days.' });
      } else if (ratio <= 0.3) {
        weeklyInsights.push({ id: 'protein', type: 'weekly', text: 'Protein levels were on the lower side across logged days.' });
      } else {
        weeklyInsights.push({ id: 'protein', type: 'weekly', text: 'Protein levels varied across logged days.' });
      }
    }

    // 2. Meal Source Pattern
    const sourceCounts = new Map<FoodType, number>();
    for (const log of logs) {
      const ft = log.food_type as FoodType;
      sourceCounts.set(ft, (sourceCounts.get(ft) || 0) + 1);
    }

    let topSource: FoodType | null = null;
    let topCount = 0;
    for (const [ft, count] of sourceCounts) {
      if (count > topCount) {
        topCount = count;
        topSource = ft;
      }
    }

    if (topSource && weeklyInsights.length < 2) {
      const ratio = topCount / logs.length;
      if (topSource === 'outside_food' && ratio >= 0.4) {
        weeklyInsights.push({ id: 'source', type: 'weekly', text: 'Outside food appeared frequently in recent logs.' });
      } else if (topSource === 'mess_meal' && ratio >= 0.4) {
        weeklyInsights.push({ id: 'source', type: 'weekly', text: 'Mess meals made up most recent entries.' });
      } else if (topSource === 'home_food' && ratio >= 0.4) {
        weeklyInsights.push({ id: 'source', type: 'weekly', text: 'Home food was the most common source in recent logs.' });
      }
    }

    // 3. Balance Pattern (if still room)
    if (weeklyInsights.length < 2) {
      let balancedCount = 0;
      for (const [, dayLogs] of byDate) {
        const calMin = dayLogs.reduce((s, l) => s + l.calorie_min, 0);
        const calMax = dayLogs.reduce((s, l) => s + l.calorie_max, 0);
        const protein = dayLogs.reduce((s, l) => s + l.protein_amount, 0);
        const avg = (calMin + calMax) / 2;
        const calOk = avg >= DAILY_CALORIE_TARGET.min && avg <= DAILY_CALORIE_TARGET.max;
        const protOk = protein >= DAILY_PROTEIN_TARGET;
        if (calOk && protOk) balancedCount++;
      }

      const balanceRatio = balancedCount / loggedDays;
      if (balanceRatio >= 0.6) {
        weeklyInsights.push({ id: 'balance', type: 'weekly', text: 'Several days were marked as balanced.' });
      } else {
        weeklyInsights.push({ id: 'balance', type: 'weekly', text: 'Balance status differed across logged days.' });
      }
    }

    // --- SITUATIONAL PATTERN (up to 1) ---

    // Time of day analysis
    const eveningLogs = logs.filter((l) => {
      if (!l.logged_at) return false;
      const hour = getHours(new Date(l.logged_at));
      return hour >= 17; // 5 PM+
    });

    const eveningOutside = eveningLogs.filter((l) => l.food_type === 'outside_food').length;
    const eveningProtein = eveningLogs.reduce((s, l) => s + l.protein_amount, 0);

    if (eveningLogs.length >= 2 && eveningOutside / eveningLogs.length >= 0.5) {
      situationalInsights.push({ id: 'evening-outside', type: 'situational', text: 'Evening logs include outside food more frequently.' });
    } else if (eveningLogs.length >= 2 && eveningProtein / eveningLogs.length > DAILY_PROTEIN_TARGET * 0.4) {
      situationalInsights.push({ id: 'evening-protein', type: 'situational', text: 'Protein levels were higher in evening logs.' });
    }

    // Weekday vs weekend
    if (situationalInsights.length === 0) {
      const weekdayDates: string[] = [];
      const weekendDates: string[] = [];
      for (const [dateStr] of byDate) {
        const d = new Date(dateStr + 'T12:00:00');
        if (isWeekend(d)) weekendDates.push(dateStr);
        else weekdayDates.push(dateStr);
      }

      if (weekendDates.length >= 1 && weekdayDates.length >= 1) {
        // Check if weekend has more rice-heavy meals
        const weekendLogs = logs.filter((l) => weekendDates.includes(l.date));
        const riceHeavy = weekendLogs.filter((l) =>
          l.food_name?.toLowerCase().includes('biryani') || l.food_name?.toLowerCase().includes('rice')
        );
        if (riceHeavy.length >= 2) {
          situationalInsights.push({ id: 'weekend-rice', type: 'situational', text: 'Weekend logs included more rice-heavy meals.' });
        } else {
          // Check weekday balance consistency
          let weekdayBalanced = 0;
          for (const wd of weekdayDates) {
            const dayLogs = byDate.get(wd) || [];
            const calMin = dayLogs.reduce((s, l) => s + l.calorie_min, 0);
            const calMax = dayLogs.reduce((s, l) => s + l.calorie_max, 0);
            const protein = dayLogs.reduce((s, l) => s + l.protein_amount, 0);
            const avg = (calMin + calMax) / 2;
            if (avg >= DAILY_CALORIE_TARGET.min && avg <= DAILY_CALORIE_TARGET.max && protein >= DAILY_PROTEIN_TARGET) {
              weekdayBalanced++;
            }
          }
          if (weekdayDates.length >= 2 && weekdayBalanced / weekdayDates.length >= 0.6) {
            situationalInsights.push({ id: 'weekday-balance', type: 'situational', text: 'Weekday logs showed more consistent balance status.' });
          }
        }
      }
    }

    setInsights([...weeklyInsights.slice(0, 2), ...situationalInsights.slice(0, 1)]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  return { insights, hasEnoughData, loading };
}
