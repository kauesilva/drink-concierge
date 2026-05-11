import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { brazilianStates, getCitiesByUF } from '@/data/brazilLocations';

interface StateCitySelectProps {
  state: string;
  city: string;
  onStateChange: (uf: string) => void;
  onCityChange: (city: string) => void;
  stateLabel?: string;
  cityLabel?: string;
  required?: boolean;
  errors?: { state?: string; city?: string };
  layout?: 'horizontal' | 'stacked';
}

const StateCitySelect = ({
  state,
  city,
  onStateChange,
  onCityChange,
  stateLabel = 'Estado',
  cityLabel = 'Cidade',
  required,
  errors,
  layout = 'horizontal',
}: StateCitySelectProps) => {
  const cities = useMemo(() => getCitiesByUF(state), [state]);

  const containerCls =
    layout === 'horizontal'
      ? 'grid grid-cols-3 gap-3'
      : 'space-y-3';

  return (
    <div className={containerCls}>
      <div className={layout === 'horizontal' ? '' : ''}>
        <Label>
          {stateLabel} {required && '*'}
        </Label>
        <Select
          value={state || ''}
          onValueChange={(v) => {
            onStateChange(v);
            // limpa cidade ao trocar estado
            if (v !== state) onCityChange('');
          }}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {brazilianStates.map((s) => (
              <SelectItem key={s.uf} value={s.uf}>
                {s.uf} — {s.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.state && (
          <p className="text-sm text-destructive mt-1">{errors.state}</p>
        )}
      </div>

      <div className={layout === 'horizontal' ? 'col-span-2' : ''}>
        <Label>
          {cityLabel} {required && '*'}
        </Label>
        <Select
          value={city || ''}
          onValueChange={onCityChange}
          disabled={!state}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={state ? 'Selecione a cidade' : 'Selecione o estado primeiro'} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.city && (
          <p className="text-sm text-destructive mt-1">{errors.city}</p>
        )}
      </div>
    </div>
  );
};

export default StateCitySelect;
