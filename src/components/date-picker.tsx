'use client';

import * as React from 'react';

import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent } from '@/components/ui/card';

interface DatePickerProps {
    selected: Date;
    onSelect: (date: Date) => void;
}

export default function DatePicker({ selected, onSelect }: DatePickerProps) {
    const [month, setMonth] = React.useState<Date | undefined>(selected);

    return (
        <Card>
            <CardContent className="flex flex-col gap-4 items-center">
                <Calendar
                    mode="single"
                    required
                    locale={ptBR}
                    month={month}
                    onMonthChange={setMonth}
                    selected={selected}
                    onSelect={onSelect}
                    className="bg-transparent p-0"
                />
                <CardAction className="flex w-full justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const today = new Date();
                            setMonth(today);
                            onSelect(today);
                        }}
                    >
                        Hoje
                    </Button>
                </CardAction>
            </CardContent>
        </Card>
    );
}
