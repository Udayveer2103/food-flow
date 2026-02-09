import { PortionSize, PORTION_SIZE_LABELS } from '@/types/database';
import { cn } from '@/lib/utils';

interface Props {
  selected: PortionSize;
  onSelect: (size: PortionSize) => void;
}

const PORTIONS: PortionSize[] = ['smaller', 'usual', 'heavier'];

export default function PortionPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {PORTIONS.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={cn(
            'flex-1 rounded-xl border-2 py-2.5 px-2 text-center text-sm font-medium transition-all duration-200',
            'hover:border-primary/40 active:scale-[0.97]',
            selected === size
              ? 'border-primary bg-accent text-accent-foreground'
              : 'border-transparent bg-card text-muted-foreground'
          )}
        >
          {PORTION_SIZE_LABELS[size]}
        </button>
      ))}
    </div>
  );
}
