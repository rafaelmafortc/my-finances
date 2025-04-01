'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

import { useCurrency } from '@/providers/currency-provider';
import { currencyFormatter } from '@/lib/formatCurrency';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type PieData = {
    value: number;
    name: string;
    color?: string;
};

type PieChartProps = {
    title: number;
    data: PieData[];
};

const PieChart = ({ title, data }: PieChartProps) => {
    const { theme } = useTheme();
    const { currency } = useCurrency();

    const getOption = () => {
        const option = {
            title: {
                text: `${currencyFormatter(title, currency)}`,
                left: 'center',
                top: 'center',
                textStyle: {
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color:
                        theme === 'dark'
                            ? 'oklch(0.985 0 0)'
                            : 'oklch(0.141 0.005 285.823)',
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['60%', '90%'],
                    avoidLabelOverlap: false,
                    padAngle: 1,
                    itemStyle: {
                        borderRadius: 10,
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{d}%',
                        fontSize: 12,
                        fontWeight: 'bold',
                    },
                    data: data.map((item) => ({
                        ...item,
                        itemStyle: item.color
                            ? { color: item.color }
                            : undefined,
                    })),
                },
            ],
        };

        return option;
    };

    return (
        <ReactECharts
            option={getOption()}
            opts={{ renderer: 'svg' }}
            notMerge
            style={{ height: '100%', width: '100%' }}
        />
    );
};

export default PieChart;
