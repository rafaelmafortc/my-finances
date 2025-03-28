'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const PieChart = () => {
    const { theme } = useTheme();

    const data = [
        { value: 1048, name: 'Income' },
        { value: 735, name: 'Expense' },
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const getOption = () => {
        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor:
                    theme === 'dark'
                        ? 'oklch(0.21 0.006 285.885)'
                        : 'oklch(0.985 0 0)',
                textStyle: {
                    color:
                        theme === 'dark'
                            ? 'oklch(0.985 0 0)'
                            : 'oklch(0.141 0.005 285.823)',
                },
                borderColor:
                    theme === 'dark'
                        ? 'oklch(0.274 0.006 286.033)'
                        : 'oklch(0.92 0.004 286.32)',
                borderWidth: 1,
            },
            title: {
                text: `R$ ${total.toLocaleString()}`,
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
                    padAngle: 6,
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
                    data: data,
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
