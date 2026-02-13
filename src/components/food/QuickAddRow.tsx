import { useState, useEffect } from 'react';
import { FoodType, PORTION_MULTIPLIERS } from '@/types/database';
import { FOOD_PRESETS, FoodPresetData, FOOD_TYPE_ICONS } from '@/data/foodPresets';
import { cn } from '@/lib/utils';
import { Zap, Check } from 'lucide-react';

const STORAGE_KEY = 'calieori_last_templates';
const QUICK_ADD_TYPES: FoodType[] = ['mess_meal', 'home_food', 'outside_food'];

interface Props {
  dietType: string | null;
  saving: boolean;
  onQuickAdd: (params: {
    food_type: FoodType;
    food_name: string;
    portion_size: 'usual';
    calorie_min: number;
    calorie_max: number;
    protein_amount: number;
    price_amount?: number | null;
    price_band?: null;
  }) => Promise<{ error: Error | null }>;
}

export function getLastTemplates(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

export function saveLastTemplate(foodType: FoodType, presetName: string) {
  const existing = getLastTemplates();
  existing[foodType] = presetName;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export default function QuickAddRow({ dietType, saving, onQuickAdd }: Props) {
  const [lastTemplates, setLastTemplates] = useState<Record<string, string>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    setLastTemplates(getLastTemplates());
  }, []);

  const pills = QUICK_ADD_TYPES
    .map((ft) => {
      const presetName = lastTemplates[ft];
      if (!presetName) return null;
      const preset = FOOD_PRESETS.find(
        (p) => p.name === presetName && p.food_type === ft &&
          (dietType ? p.diet_types.includes(dietType as any) : true)
      );
      if (!preset) return null;
      return { foodType: ft, preset };
    })
    .filter(Boolean) as { foodType: FoodType; preset: FoodPresetData }[];

  if (pills.length === 0) return null;

  const handleQuickAdd = async (pill: { foodType: FoodType; preset: FoodPresetData }) => {
    if (saving || justAdded) return;
    const result = await onQuickAdd({
      food_type: pill.foodType,
      food_name: pill.preset.name,
      portion_size: 'usual',
      calorie_min: pill.preset.calorie_min,
      calorie_max: pill.preset.calorie_max,
      protein_amount: pill.preset.protein_amount,
    });
    if (!result.error) {
      setJustAdded(pill.preset.name);
      setTimeout(() => setJustAdded(null), 1500);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground">Quick Add</p>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {pills.map((pill) => (
          <button
            key={pill.foodType}
            onClick={() => handleQuickAdd(pill)}
            disabled={saving}
            className={cn(
              'flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-xs font-medium',
              'transition-all duration-200 hover:shadow-sm active:scale-[0.97]',
              'whitespace-nowrap shrink-0',
              justAdded === pill.preset.name && 'border-[hsl(var(--success))] bg-[hsl(var(--success)/0.08)]'
            )}
          >
            <span>{FOOD_TYPE_ICONS[pill.foodType]}</span>
            <span className="text-foreground">{pill.preset.name}</span>
            {justAdded === pill.preset.name && (
              <Check className="h-3 w-3 text-[hsl(var(--success))] animate-scale-in" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
