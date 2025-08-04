'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function MonthPicker() {
    const [date, setDate] = useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    {date ? format(date, 'MM/yyyy') : 'Selecionar mês'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 mx-3">
                <Calendar
                    mode="single"
                    selected={date}
                    onMonthChange={(newDate) => {
                        setDate(
                            new Date(
                                newDate.getFullYear(),
                                newDate.getMonth(),
                                1
                            )
                        );
                    }}
                    captionLayout="dropdown"
                    locale={ptBR}
                    showOutsideDays={false}
                    classNames={{
                        day: 'hidden',
                        week: 'hidden',
                        weekdays: 'hidden',
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
