import {
    ArrowUpDown,
    ChartPie,
    FileText,
    GalleryVerticalEnd,
    LineChart,
} from 'lucide-react';

export const navbarItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: ChartPie,
        defaultOpen: true,
    },
    {
        title: 'Transações',
        url: '/transactions',
        icon: FileText,
    },
    {
        title: 'Fixos',
        url: '/fixes',
        icon: ArrowUpDown,
    },
    // {
    //     title: 'Metas',
    //     url: '/metas',
    //     icon: LineChart,
    // },
    {
        title: 'Categorias',
        url: '/categories',
        icon: GalleryVerticalEnd,
    },
];
