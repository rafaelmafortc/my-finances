'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const LOCAL_STORAGE_KEY = 'filter-month';

export function MonthPicker() {
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        const storedDate = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedDate) {
            setDate(new Date(storedDate));
        } else {
            setDate(new Date());
        }
    }, []);

    const handleChange = (newDate: Date) => {
        const normalizedDate = new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            1
        );
        setDate(normalizedDate);
        localStorage.setItem(LOCAL_STORAGE_KEY, normalizedDate.toISOString());
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="min-w-[120px]"
                    loading={!date}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MM/yyyy') : 'Selecione um mês'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 mx-3">
                <Calendar
                    mode="single"
                    month={date}
                    onMonthChange={handleChange}
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
