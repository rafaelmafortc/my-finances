import { Home, CircleDollarSign, TrendingDown } from 'lucide-react';

export const navbarItems = [
    {
        id: 1,
        title: 'resume',
        href: '/resume',
        icon: Home,
        color: 'text-blue-700',
    },
    {
        id: 2,
        title: 'income',
        href: '/income',
        icon: CircleDollarSign,
        color: 'text-green-700',
    },
    {
        id: 3,
        title: 'expense',
        href: '/expense',
        icon: TrendingDown,
        color: 'text-red-700',
    },
];
