'use client';

import { useEffect, useRef } from 'react';

import * as echarts from 'echarts';

export type PieChartDataItem = {
  name: string;
  value: number;
  color?: string;
};

export const PIE_CHART_PALETTE = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];

export function getPieChartColor(index: number): string {
  return PIE_CHART_PALETTE[index % PIE_CHART_PALETTE.length];
}

type PieChartProps = {
  data: PieChartDataItem[];
  total: number;
  onSegmentClick?: (item: PieChartDataItem, index: number) => void;
};

const CHART_HEIGHT = 280;
const CHART_HEIGHT_MOBILE = 220;

type TooltipParams = {
  data?: { name: string; value: number };
  name?: string;
  value?: number;
};

function tooltipFormatter(total: number) {
  return (params: unknown) => {
    const p = params as TooltipParams;
    const point = p.data ?? p;
    const value = Number(point?.value ?? 0);
    const name = point?.name ?? p?.name ?? '';
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
    return [
      '<div style="padding: 2px 0;">',
      `<div style="font-weight: 500;">${name}</div>`,
      '<div style="font-size: 11px; color: hsl(var(--muted-foreground));">',
      `R$ ${value.toLocaleString('pt-BR')} (${pct}%)`,
      '</div>',
      '</div>',
    ].join('');
  };
}

export function PieChart({ data, total, onSegmentClick }: PieChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const onSegmentClickRef = useRef(onSegmentClick);
  onSegmentClickRef.current = onSegmentClick;
  const isInteractive = Boolean(onSegmentClick);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current);
    }

    const chart = chartRef.current;
    const cursor: 'pointer' | 'default' = isInteractive ? 'pointer' : 'default';
    const seriesData = data.map((d) => ({ name: d.name, value: d.value }));

    chart.setOption({
      color: PIE_CHART_PALETTE,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'lab(5.26802% 0 0)',
        borderColor: 'lab(5.26802% 0 0)',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        textStyle: { color: 'hsl(var(--foreground))', fontSize: 12 },
        formatter: tooltipFormatter(total),
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '90%'],
          center: ['50%', '50%'],
          padAngle: 3,
          itemStyle: {
            borderRadius: 1,
          },
          data: seriesData,
          emphasis: { scale: false },
          label: { show: false },
          labelLine: { show: false },
        },
      ],
    });

    chart.off('click');
    if (onSegmentClick) {
      chart.on('click', (params: { dataIndex: number }) => {
        const item = data[params.dataIndex];
        if (item) onSegmentClickRef.current?.(item, params.dataIndex);
      });
    }
    chart.getZr().setCursorStyle(cursor);

    return () => {
      chart.off('click');
    };
  }, [data, total, onSegmentClick, isInteractive]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (data.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: CHART_HEIGHT }}
      className={`${isInteractive ? 'cursor-pointer' : ''} h-[220px] sm:h-[280px]`}
    />
  );
}
