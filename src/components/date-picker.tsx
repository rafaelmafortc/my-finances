'use client';

import * as React from 'react';

import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent } from '@/components/ui/card';

export default function DatePicker() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [month, setMonth] = React.useState<Date | undefined>(new Date());

    return (
        <Card>
            <CardContent className="flex flex-col gap-4 items-center">
                <Calendar
                    mode="single"
                    locale={ptBR}
                    month={month}
                    onMonthChange={setMonth}
                    selected={date}
                    onSelect={setDate}
                    className="bg-transparent p-0"
                />
                <CardAction className="flex w-full justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setMonth(new Date());
                            setDate(new Date());
                        }}
                    >
                        Hoje
                    </Button>
                </CardAction>
            </CardContent>
        </Card>
    );
}
