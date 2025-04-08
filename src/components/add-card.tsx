'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddCardProps {
    name: string;
    onAddClick: () => void;
}

export function AddCard({ name, onAddClick }: AddCardProps) {
    return (
        <div className="flex items-center bg-background space-x-4 rounded-md border p-4 lg:w-1/4 w-full h-16">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onAddClick}>
                    <Plus />
                </Button>
            </div>
        </div>
    );
}
