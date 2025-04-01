'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

import { useCurrency } from '@/providers/currency-provider';
import { currencyFormatter } from '@/lib/formatCurrency';
import { convertCurrency } from '@/lib/convertCurrency';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type PieData = {
    value: number;
    name: string;
    color?: string;
    currency: string;
};

type PieChartProps = {
    data: PieData[];
};

const PieChart = ({ data }: PieChartProps) => {
    const { theme } = useTheme();
    const { currency: globalCurrency } = useCurrency();

    const [convertedData, setConvertedData] = useState<PieData[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const convertAll = async () => {
            const results = await Promise.all(
                data.map(async (item) => {
                    const convertedValue = await convertCurrency(
                        item.value,
                        item.currency,
                        globalCurrency
                    );
                    return {
                        ...item,
                        value: convertedValue,
                        currency: globalCurrency,
                    };
                })
            );

            setConvertedData(results);

            const totalConverted = results.reduce(
                (sum, item) => sum + item.value,
                0
            );
            setTotal(parseFloat(totalConverted.toFixed(2)));
        };

        if (data.length > 0) convertAll();
    }, [data, globalCurrency]);

    const getOption = () => {
        return {
            title: {
                text: `${currencyFormatter(total, globalCurrency)}`,
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
                    data: convertedData.map((item) => ({
                        value: item.value,
                        name: item.name,
                        itemStyle: item.color
                            ? { color: item.color }
                            : undefined,
                    })),
                },
            ],
        };
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
