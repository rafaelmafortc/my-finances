export function Footer() {
    return (
        <div className="flex flex-col justify-between items-center pt-8 border-t-2 gap-4">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-2xl font-semibold">MyFinances</h1>
                <span>Right Footer</span>
            </div>
            <span className="text-xs text-muted-foreground">
                powered by Rafael Mafort Coimbra
            </span>
        </div>
    );
}
