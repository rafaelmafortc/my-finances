'use client';

import { useState } from 'react';

import PeriodCarousel from '@/components/period-carousel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PeriodFilter() {
    const [mode, setMode] = useState<'month' | 'year' | 'begin'>('month');

    return (
        <div className="flex flex-col gap-4">
            <Tabs
                value={mode}
                onValueChange={(type) =>
                    setMode(type as 'month' | 'year' | 'begin')
                }
            >
                <TabsList className="w-full">
                    <TabsTrigger value="begin">Desde o inicio</TabsTrigger>
                    <TabsTrigger value="month">Mensal</TabsTrigger>
                    <TabsTrigger value="year">Anual</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="w-full flex justify-center">
                {mode !== 'begin' && <PeriodCarousel mode={mode} />}
            </div>
        </div>
    );
}
