import Image from 'next/image';

import founderImage from 'public/founder-image.jpg';

export function Founder() {
    return (
        <div className="flex flex-col justify-center md:flex-row gap-8 md:gap-16 items-center py-8 px-2 md:p-16">
            <Image
                width={280}
                height={280}
                src={founderImage}
                alt="Founder"
                className="rounded-full object-cover w-40 h-40 md:w-72 md:h-72"
            />
            <div className="flex flex-col gap-4 text-center md:text-left md:max-w-1/2">
                <span className="font-bold text-xl md:text-2xl">
                    Olá, sou o Rafael, o fundador do MyFinances
                </span>
                <span className="text-sm md:text-base text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Unde, nesciunt dignissimos, sapiente eum perferendis
                    pariatur repellat nobis consequatur labore doloremque
                    tempora. Voluptatum, suscipit nemo facilis delectus ipsam
                    eveniet neque pariatur!
                </span>
            </div>
        </div>
    );
}
