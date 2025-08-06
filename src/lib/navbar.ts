import {
    ArrowUpDown,
    ChartPie,
    CircleUser,
    CreditCard,
    FileText,
    GalleryVerticalEnd,
} from 'lucide-react';

export const navbarMain = [
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
    {
        title: 'Categorias',
        url: '/categories',
        icon: GalleryVerticalEnd,
    },
];

export const navbarSettings = [
    {
        id: 'account',
        title: 'Conta',
        icon: CircleUser,
    },
    // {
    //     id: 'payment',
    //     title: 'Pagamento',
    //     icon: CreditCard,
    // },
];
