import { ArrowUpDown, FileChartColumn, TrendingUp } from 'lucide-react';

export const navigation = [
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
];
