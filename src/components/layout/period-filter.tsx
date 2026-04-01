'use client';

import { MONTHS } from '@/constants/months';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PeriodFilterProps = {
  month: string;
  year: string;
  availableYears: number[];
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
};

export function PeriodFilter({
  month,
  year,
  availableYears,
  onMonthChange,
  onYearChange,
}: PeriodFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <Select value={month} onValueChange={onMonthChange}>
        <SelectTrigger size="sm" className="w-full sm:w-auto">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={onYearChange}>
        <SelectTrigger size="sm" className="w-full sm:w-auto">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
