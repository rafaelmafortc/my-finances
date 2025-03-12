import { Home, CircleDollarSign, TrendingDown } from 'lucide-react';

export const navbarItems = [
    {
        id: 1,
        title: 'Resumo',
        href: '/',
        icon: Home,
    },
    {
        id: 2,
        title: 'Rendas',
        href: '/income',
        icon: CircleDollarSign,
    },
    {
        id: 3,
        title: 'Despesas',
        href: '/expense',
        icon: TrendingDown,
    },
];
