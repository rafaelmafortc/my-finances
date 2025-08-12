import {
    ChartPie,
    FileText,
    GalleryVerticalEnd,
    LucideIcon,
} from 'lucide-react';

export const navbar: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
    defaultOpen?: boolean;
}> = [
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
        title: 'Categorias',
        url: '/categories',
        icon: GalleryVerticalEnd,
    },
] as const;
