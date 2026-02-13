import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-1 min-h-screen items-center justify-center w-full min-w-0">
      <Loader2 className="size-4 text-muted-foreground animate-spin" />
    </div>
  );
}
