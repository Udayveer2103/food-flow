import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FoodType, PortionSize, PriceBand, DietType } from '@/types/database';
import { FoodPresetData } from '@/data/foodPresets';
import FoodCategoryPicker from './FoodCategoryPicker';
import PortionPicker from './PortionPicker';
import FoodPresetList from './FoodPresetList';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dietType: DietType | null;
  saving: boolean;
  onSave: (params: {
    food_type: FoodType;
    food_name: string;
    portion_size: PortionSize;
    calorie_min: number;
    calorie_max: number;
    protein_amount: number;
    price_amount?: number | null;
    price_band?: PriceBand | null;
  }) => Promise<{ error: Error | null }>;
}

function getPriceBand(amount: number): PriceBand {
  if (amount <= 50) return 'low';
  if (amount <= 150) return 'medium';
  return 'high';
}

const PRICE_TYPES: FoodType[] = ['outside_food', 'milk', 'protein_shake', 'fruit'];

export default function LogFoodSheet({ open, onOpenChange, dietType, saving, onSave }: Props) {
  const [category, setCategory] = useState<FoodType | null>(null);
  const [preset, setPreset] = useState<FoodPresetData | null>(null);
  const [portion, setPortion] = useState<PortionSize>('usual');
  const [priceInput, setPriceInput] = useState('');

  const reset = () => {
    setCategory(null);
    setPreset(null);
    setPortion('usual');
    setPriceInput('');
  };

  const handleSave = async () => {
    if (!category || !preset) return;
    const priceAmount = priceInput ? parseFloat(priceInput) : null;
    const result = await onSave({
      food_type: category,
      food_name: preset.name,
      portion_size: portion,
      calorie_min: preset.calorie_min,
      calorie_max: preset.calorie_max,
      protein_amount: preset.protein_amount,
      price_amount: priceAmount,
      price_band: priceAmount ? getPriceBand(priceAmount) : null,
    });
    if (!result.error) {
      reset();
      onOpenChange(false);
    }
  };

  const showPrice = category && PRICE_TYPES.includes(category);

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">Log Food</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          {/* Category */}
          <FoodCategoryPicker selected={category} onSelect={(t) => { setCategory(t); setPreset(null); }} />

          {/* Food items */}
          {category && (
            <FoodPresetList
              foodType={category}
              dietType={dietType}
              selectedPreset={preset}
              onSelect={setPreset}
            />
          )}

          {/* Outside food helper */}
          {category === 'outside_food' && (
            <p className="text-xs text-muted-foreground italic px-1">
              Outside food varies a lot. Choose portion size to keep estimates realistic.
            </p>
          )}

          {/* Portion */}
          {preset && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Portion size</p>
              <PortionPicker selected={portion} onSelect={setPortion} />
            </div>
          )}

          {/* Price */}
          {preset && showPrice && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Price (optional)</p>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="₹ amount"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}

          {/* Save */}
          {preset && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 rounded-xl text-base font-medium"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add to Log'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
