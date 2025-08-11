'use client';

import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/providers/user-provider';

const colorClasses: Record<string, string> = {
    blue: 'bg-blue hover:bg-blue/80',
    lime: 'bg-lime hover:bg-lime/80',
    yellow: 'bg-yellow hover:bg-yellow/80',
    red: 'bg-red hover:bg-red/80',
    cian: 'bg-cian hover:bg-cian/80',
    green: 'bg-green hover:bg-green/80',
    orange: 'bg-orange hover:bg-orange/80',
    purple: 'bg-purple hover:bg-purple/80',
    image: '',
};

export function AccountSettings() {
    const { firstName, lastName, user, initials, avatarColor, setAvatarColor } =
        useUser();

    const handleColorChange = async (colorName: string) => {
        setAvatarColor(colorName as any);

        try {
            await fetch('/api/user/color', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ color: colorName }),
            });
        } catch (err) {
            console.error('Erro ao salvar cor do avatar:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <Label className="mb-2 block text-sm font-medium">Avatar</Label>
                <div className="flex items-center gap-4">
                    <Avatar key={avatarColor} className="h-12 w-12 rounded-lg">
                        {avatarColor === 'image' ? (
                            <AvatarImage
                                src={user?.image || ''}
                                alt="Profile Image"
                            />
                        ) : (
                            <AvatarFallback
                                className={`rounded-lg bg-${avatarColor} text-xl`}
                            >
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
                <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                        Escolha a cor do avatar
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(colorClasses).map(
                            ([color, className]) => (
                                <Button
                                    key={color}
                                    size="icon"
                                    onClick={() => handleColorChange(color)}
                                    className={`rounded-full ${className} border-2 transition-all overflow-hidden ${
                                        avatarColor === color
                                            ? 'ring-2 ring-muted-foreground'
                                            : 'ring-0'
                                    }`}
                                >
                                    {user?.image && color === 'image' ? (
                                        <Image
                                            src={user?.image || ''}
                                            alt="Profile User"
                                            width={36}
                                            height={36}
                                            className="rounded-full object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="block w-full h-full rounded-full" />
                                    )}
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Primeiro nome
                </Label>
                <Input disabled value={firstName} />
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Último nome
                </Label>
                <Input disabled value={lastName} />
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">Email</Label>
                <Input disabled value={user?.email || ''} />
            </div>
        </div>
    );
}
