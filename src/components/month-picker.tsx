'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useSelectedDate } from '@/providers/selected-date-provider';

export function MonthPicker() {
    const { date, setSelectedDate } = useSelectedDate();

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
                    month={date ?? undefined}
                    onMonthChange={setSelectedDate}
                    classNames={{
                        day: 'hidden',
                        week: 'hidden',
                        weekdays: 'hidden',
                    }}
                    captionLayout="dropdown"
                    locale={ptBR}
                    showOutsideDays={false}
                />
            </PopoverContent>
        </Popover>
    );
}
