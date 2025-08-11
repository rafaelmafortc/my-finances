import { ChartPie, FileText, GalleryVerticalEnd } from 'lucide-react';

export const navbar = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        url: '/dashboard',
        icon: ChartPie,
        hasMonthPicker: true,
        defaultOpen: true,
    },
    {
        key: 'transactions',
        title: 'Transações',
        url: '/transactions',
        icon: FileText,
        hasMonthPicker: true,
        defaultOpen: false,
    },
    {
        key: 'categories',
        title: 'Categorias',
        url: '/categories',
        icon: GalleryVerticalEnd,
        hasMonthPicker: false,
        defaultOpen: false,
    },
] as const;
