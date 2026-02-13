import { FoodType, FOOD_TYPE_LABELS } from '@/types/database';
import { FOOD_TYPE_ICONS } from '@/data/foodPresets';
import { cn } from '@/lib/utils';

interface Props {
  selected: FoodType | null;
  onSelect: (type: FoodType) => void;
}

const CATEGORIES: FoodType[] = ['mess_meal', 'home_food', 'outside_food', 'milk', 'protein_shake', 'fruit'];

export default function FoodCategoryPicker({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CATEGORIES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
            'hover:border-primary/40 hover:shadow-sm active:scale-[0.97]',
            selected === type
              ? 'border-primary bg-accent shadow-sm'
              : 'border-transparent bg-card'
          )}
        >
          <span className="text-2xl">{FOOD_TYPE_ICONS[type]}</span>
          <span className="text-xs font-medium text-foreground leading-tight text-center">
            {FOOD_TYPE_LABELS[type]}
          </span>
        </button>
      ))}
    </div>
  );
}
