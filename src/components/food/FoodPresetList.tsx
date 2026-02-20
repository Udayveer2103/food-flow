import { useState } from 'react';
import { FoodType, DietType } from '@/types/database';
import { FOOD_PRESETS, FoodPresetData, OutsideCategory, OUTSIDE_CATEGORIES } from '@/data/foodPresets';
import { cn } from '@/lib/utils';
import { getLastTemplates } from './QuickAddRow';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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

  const lastTemplates = getLastTemplates();
  const lastUsed = lastTemplates[foodType];

  if (presets.length === 0) return null;

  if (foodType === 'outside_food') {
    return (
      <OutsideFoodView
        presets={presets}
        dietType={dietType}
        selectedPreset={selectedPreset}
        lastUsedName={lastUsed}
        onSelect={onSelect}
      />
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Choose an item</p>
      <div className="space-y-2">
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

function OutsideFoodView({
  presets,
  dietType,
  selectedPreset,
  lastUsedName,
  onSelect,
}: {
  presets: FoodPresetData[];
  dietType: DietType | null;
  selectedPreset: FoodPresetData | null;
  lastUsedName?: string;
  onSelect: (p: FoodPresetData) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<OutsideCategory>('popular');
  const [maincourseFilter, setMaincourseFilter] = useState<'all' | 'veg' | 'non_veg'>('all');

  // Filter presets by active category
  let filtered = presets.filter((p) => p.outside_category === activeCategory);

  // For maincourse, apply veg/non-veg sub-filter
  if (activeCategory === 'maincourse' && maincourseFilter !== 'all') {
    if (maincourseFilter === 'veg') {
      filtered = filtered.filter((p) => p.diet_types.includes('veg'));
    } else {
      filtered = filtered.filter((p) => !p.diet_types.includes('veg'));
    }
  }

  // Only show categories that have presets for the user's diet
  const availableCategories = OUTSIDE_CATEGORIES.filter((cat) =>
    presets.some((p) => p.outside_category === cat.key)
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">Choose an item</p>

      {/* Category filter chips */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {availableCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setMaincourseFilter('all'); }}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150',
                activeCategory === cat.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Maincourse sub-filter */}
      {activeCategory === 'maincourse' && (
        <div className="flex gap-2">
          {(['all', 'veg', 'non_veg'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setMaincourseFilter(f)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
                maincourseFilter === f
                  ? 'bg-accent text-accent-foreground border border-primary/30'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              )}
            >
              {f === 'all' ? 'All' : f === 'veg' ? 'Veg' : 'Non-Veg'}
            </button>
          ))}
        </div>
      )}

      {/* Preset list */}
      <div className="space-y-2">
        {filtered.map((preset) => (
          <PresetButton
            key={preset.name}
            preset={preset}
            selected={selectedPreset?.name === preset.name}
            highlighted={lastUsedName === preset.name && !selectedPreset}
            onSelect={onSelect}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No items in this category for your diet.
          </p>
        )}
      </div>
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
        'w-full flex items-center justify-between rounded-xl border-2 px-4 py-4 text-left transition-all duration-200',
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
