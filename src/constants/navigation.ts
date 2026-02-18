import { ArrowUpDown, Layers2, ScrollText, TrendingUp } from 'lucide-react';

export const NAVIGATION = [
  {
    name: 'Extrato',
    href: '/statement',
    icon: ScrollText,
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
