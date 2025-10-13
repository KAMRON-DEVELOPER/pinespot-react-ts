import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface Filters {
  minBeds: number;
  minBaths: number;
  maxPrice?: number;
  sort?: 'price-asc' | 'price-desc' | 'area-desc';
  condition?: 'new' | 'repaired' | 'old' | 'any';
}

export function FiltersBar({ value, onChange, onReset }: { value: Filters; onChange: (v: Filters) => void; onReset: () => void }) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  return (
    <div className='flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3'>
      <div className='w-[140px]'>
        <label className='mb-1 block text-xs text-muted-foreground'>Condition</label>
        <Select
          value={value.condition ?? 'any'}
          onValueChange={(v) => set({ condition: v as Filters['condition'] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='any'>Any</SelectItem>
            <SelectItem value='new'>New</SelectItem>
            <SelectItem value='repaired'>Repaired</SelectItem>
            <SelectItem value='old'>Old</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='w-[120px]'>
        <label className='mb-1 block text-xs text-muted-foreground'>Beds</label>
        <Select
          value={String(value.minBeds)}
          onValueChange={(v) => set({ minBeds: Number(v) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='0'>Any</SelectItem>
            <SelectItem value='1'>1+ beds</SelectItem>
            <SelectItem value='2'>2+ beds</SelectItem>
            <SelectItem value='3'>3+ beds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='w-[120px]'>
        <label className='mb-1 block text-xs text-muted-foreground'>Baths</label>
        <Select
          value={String(value.minBaths)}
          onValueChange={(v) => set({ minBaths: Number(v) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='0'>Any</SelectItem>
            <SelectItem value='1'>1+ baths</SelectItem>
            <SelectItem value='2'>2+ baths</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='w-[160px]'>
        <label className='mb-1 block text-xs text-muted-foreground'>Max price</label>
        <Input
          type='number'
          min={0}
          step={100}
          value={value.maxPrice ?? ''}
          onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          placeholder='Any'
        />
      </div>

      <div className='w-[180px]'>
        <label className='mb-1 block text-xs text-muted-foreground'>Sort</label>
        <Select
          value={value.sort ?? 'price-asc'}
          onValueChange={(v) => set({ sort: v as Filters['sort'] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='price-asc'>Price: Low to High</SelectItem>
            <SelectItem value='price-desc'>Price: High to Low</SelectItem>
            <SelectItem value='area-desc'>Largest Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='ml-auto'>
        <Button
          variant='secondary'
          onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
