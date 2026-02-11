import { FoodType, DietType } from '@/types/database';
import { FOOD_PRESETS, FoodPresetData } from '@/data/foodPresets';
import { cn } from '@/lib/utils';

interface Props {
  foodType: FoodType;
  dietType: DietType | null;
  selectedPreset: FoodPresetData | null;
  onSelect: (preset: FoodPresetData) => void;
}

export default function FoodPresetList({ foodType, dietType, selectedPreset, onSelect }: Props) {
  const presets = FOOD_PRESETS.filter(
    (p) => p.food_type === foodType && (dietType ? p.diet_types.includes(dietType) : true)
  );

  if (presets.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Choose an item</p>
      <div className="space-y-1.5">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset)}
            className={cn(
              'w-full flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200',
              'hover:border-primary/40 active:scale-[0.99]',
              selectedPreset?.name === preset.name
                ? 'border-primary bg-accent'
                : 'border-transparent bg-card'
            )}
          >
            <div>
              <p className="text-sm font-medium text-foreground">{preset.name}</p>
              <p className="text-xs text-muted-foreground">
                {preset.description && <span>{preset.description} · </span>}
                {preset.calorie_min}–{preset.calorie_max} cal · {preset.protein_amount}g protein
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
