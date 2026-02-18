import {
  ArrowUpDown,
  FileChartColumn,
  Layers2,
  TrendingUp,
} from 'lucide-react';

export const NAVIGATION = [
  {
    name: 'Extrato',
    href: '/statement',
    icon: FileChartColumn,
  },
  {
    name: 'Fixos',
    href: '/fixes',
    icon: ArrowUpDown,
  },
  {
    name: 'Investimentos',
    href: '/investments',
    icon: TrendingUp,
  },
  {
    name: 'Categorias',
    href: '/categories',
    icon: Layers2,
  },
] as const;
