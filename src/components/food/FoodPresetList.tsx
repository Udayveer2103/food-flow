import { useState, useEffect } from 'react';
import { FoodType, DietType } from '@/types/database';
import { FOOD_PRESETS, FoodPresetData } from '@/data/foodPresets';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { getLastTemplates } from './QuickAddRow';

interface Props {
  foodType: FoodType;
  dietType: DietType | null;
  selectedPreset: FoodPresetData | null;
  onSelect: (preset: FoodPresetData) => void;
}

// Outside food grouping
const OUTSIDE_GROUPS: { label: string; match: (name: string) => boolean }[] = [
  { label: 'Popular', match: (n) => ['Maggi / Noodles', 'Biryani', 'Burger', 'Pizza (2 slices)', 'Sandwich / Wrap', 'Momos (6 pcs)', 'Samosa (2 pcs)', 'Chai + Biscuits'].includes(n) },
  { label: 'Wraps & Rolls', match: (n) => ['Paneer Wrap', 'Aloo Wrap', 'Chicken Tikka Wrap', 'Egg Roll'].includes(n) },
  { label: 'Grilled / Tikka', match: (n) => ['Grilled Chicken', 'Chicken Tikka', 'Fish Tikka', 'Paneer Tikka'].includes(n) },
  { label: 'Rice / Heavy Meals', match: (n) => ['Veg Biryani', 'Chicken Biryani', 'Fried Rice (Veg)', 'Fried Rice (Chicken)'].includes(n) },
  { label: 'Drinks & Sweets', match: (n) => ['Chai', 'Coffee (Milk-based)', 'Hot Chocolate', 'Milkshake'].includes(n) },
];

export default function FoodPresetList({ foodType, dietType, selectedPreset, onSelect }: Props) {
  const presets = FOOD_PRESETS.filter(
    (p) => p.food_type === foodType && (dietType ? p.diet_types.includes(dietType) : true)
  );

  // Pre-highlight last used template
  const lastTemplates = getLastTemplates();
  const lastUsed = lastTemplates[foodType];

  if (presets.length === 0) return null;

  // For outside food, render collapsible groups
  if (foodType === 'outside_food') {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Choose an item</p>
        {OUTSIDE_GROUPS.map((group, groupIdx) => {
          const groupPresets = presets.filter((p) => group.match(p.name));
          if (groupPresets.length === 0) return null;
          return (
            <CollapsibleGroup
              key={group.label}
              label={group.label}
              presets={groupPresets}
              selectedPreset={selectedPreset}
              lastUsedName={lastUsed}
              onSelect={onSelect}
              defaultOpen={groupIdx === 0}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Choose an item</p>
      <div className="space-y-1.5">
        {presets.map((preset) => (
          <PresetButton
            key={preset.name}
            preset={preset}
            selected={selectedPreset?.name === preset.name}
            highlighted={lastUsed === preset.name && !selectedPreset}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function CollapsibleGroup({
  label, presets, selectedPreset, lastUsedName, onSelect, defaultOpen,
}: {
  label: string;
  presets: FoodPresetData[];
  selectedPreset: FoodPresetData | null;
  lastUsedName?: string;
  onSelect: (p: FoodPresetData) => void;
  defaultOpen: boolean;
}) {
  const hasSelection = presets.some((p) => p.name === selectedPreset?.name);
  const [open, setOpen] = useState(defaultOpen || hasSelection);

  return (
    <div className="rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground"
      >
        <span>{label}</span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-2 pb-2 space-y-1.5 animate-fade-in">
          {presets.map((preset) => (
            <PresetButton
              key={preset.name}
              preset={preset}
              selected={selectedPreset?.name === preset.name}
              highlighted={lastUsedName === preset.name && !selectedPreset}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PresetButton({ preset, selected, highlighted, onSelect }: {
  preset: FoodPresetData;
  selected: boolean;
  highlighted: boolean;
  onSelect: (p: FoodPresetData) => void;
}) {
  return (
    <button
      onClick={() => onSelect(preset)}
      className={cn(
        'w-full flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-200',
        'hover:border-primary/40 active:scale-[0.99]',
        selected
          ? 'border-primary bg-accent'
          : highlighted
            ? 'border-primary/30 bg-accent/50'
            : 'border-transparent bg-card'
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">
          {preset.name}
          {highlighted && !selected && (
            <span className="ml-2 text-[10px] text-muted-foreground font-normal">Last used</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {preset.description && <span>{preset.description} · </span>}
          {preset.calorie_min}–{preset.calorie_max} cal · {preset.protein_amount}g protein
        </p>
      </div>
    </button>
  );
}
