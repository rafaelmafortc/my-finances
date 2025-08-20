'use client';

import * as React from 'react';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useAvailablePeriods } from '@/hooks/use-available-periods';

type Props = {
    mode?: 'month' | 'year';
};

export default function PeriodCarousel({ mode = 'month' }: Props) {
    const { periods } = useAvailablePeriods(mode);

    if (!periods.length) return;

    return (
        <Carousel className="w-full px-10">
            <CarouselPrevious className="left-2" />
            <CarouselContent>
                {periods.map((p) => (
                    <CarouselItem key={p.key} className="px-2 text-center">
                        {p.label}
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext className="right-2" />
        </Carousel>
    );
}
