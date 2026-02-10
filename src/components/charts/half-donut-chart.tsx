'use client';

import { useEffect, useRef } from 'react';

import * as echarts from 'echarts';

export type HalfDonutChartDataItem = {
  name: string;
  value: number;
  color?: string;
};

type HalfDonutChartProps = {
  data: HalfDonutChartDataItem[];
  total: number;
  centerLabel?: string | ((total: number) => string);
  onSegmentClick?: (item: HalfDonutChartDataItem, index: number) => void;
};

const CHART_HEIGHT = 280;

type TooltipParams = {
  data?: { name: string; value: number };
  name?: string;
  value?: number;
  percent?: number;
};

function tooltipFormatter(total: number) {
  return (params: unknown) => {
    const p = params as TooltipParams;
    const point = p.data ?? p;
    const value = Number(point?.value ?? 0);
    const name = point?.name ?? p?.name ?? '';
    const percent = p.percent ?? (total > 0 ? (value / total) * 100 : 0);
    return [
      '<div style="padding: 2px 0;">',
      `<div style="font-weight: 500;">${name}</div>`,
      '<div style="font-size: 11px; color: hsl(var(--muted-foreground));">',
      `R$ ${value.toLocaleString('pt-BR')} (${percent.toFixed(1)}%)`,
      '</div>',
      '</div>',
    ].join('');
  };
}

export function HalfDonutChart({
  data,
  total,
  centerLabel,
  onSegmentClick,
}: HalfDonutChartProps) {
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

    const getComputedColor = (cssVar: string) => {
      if (typeof window === 'undefined') return cssVar;
      const root = document.documentElement;
      const varMatch = cssVar.match(/var\(([^)]+)\)/);
      if (varMatch) {
        const varName = varMatch[1].trim();
        const value = getComputedStyle(root).getPropertyValue(varName).trim();
        return value || cssVar;
      }
      return cssVar;
    };

    const seriesData = data.map((d) => {
      let color = d.color || '';
      if (color && color.includes('var(--')) {
        color = getComputedColor(color);
      }
      const resolvedColor = color || undefined;
      return {
        name: d.name,
        value: d.value,
        itemStyle: { color: resolvedColor },
        emphasis: {
          itemStyle: {
            color: resolvedColor,
            opacity: 1,
          },
        },
      };
    });

    const labelText =
      typeof centerLabel === 'function'
        ? centerLabel(total)
        : (centerLabel ?? `${total.toLocaleString('pt-BR')}`);

    chart.setOption({
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
          center: ['50%', '75%'],
          startAngle: 180,
          endAngle: 0,
          padAngle: 3,
          itemStyle: {
            borderRadius: 1,
          },
          data: seriesData,
          emphasis: {
            scale: false,
            itemStyle: {
              opacity: 1,
            },
          },
          label: {
            show: true,
            position: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
            formatter: labelText,
          },
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
  }, [data, total, centerLabel, onSegmentClick, isInteractive]);

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
      className={isInteractive ? 'cursor-pointer' : ''}
    />
  );
}
