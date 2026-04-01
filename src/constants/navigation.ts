import {
  ArrowUpDown,
  Layers2,
  PieChart,
  ScrollText,
  TrendingUp,
} from 'lucide-react';

export const NAVIGATION = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: PieChart,
  },
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
  // {
  //   name: 'Investimentos',
  //   href: '/investments',
  //   icon: TrendingUp,
  // },
  {
    name: 'Categorias',
    href: '/categories',
    icon: Layers2,
  },
] as const;
