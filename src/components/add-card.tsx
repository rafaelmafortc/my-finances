'use client';

import { Plus } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';

import { db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PieFooterCardProps {
    name: string;
}

export function AddCard({ name }: PieFooterCardProps) {
    const incomeCollegionRef = collection(db, 'incomes');

    const addIncome = async () => {
        try {
            await addDoc(incomeCollegionRef, {
                amount: 0,
                currency: 'BRL',
                description: 'description',
                userId: auth?.currentUser?.uid,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex items-center bg-background space-x-4 rounded-md border p-4 lg:w-1/4 w-full h-16">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
            </div>
            <div className="flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] sm:ml-8">
                        <DialogHeader>
                            <DialogTitle>Add income</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Input
                                    id="name"
                                    placeholder="Description"
                                    className="col-span-4"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Button
                                    variant="outline"
                                    className="col-span-1"
                                >
                                    $
                                </Button>
                                <Input
                                    id="value"
                                    placeholder="Value"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={addIncome}>
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
