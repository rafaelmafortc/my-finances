import { PiggyBank } from 'lucide-react';

import { LoginForm } from '@/modules/auth';

export default async function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-primary-foreground bg-size-[24px_24px] ">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex items-center gap-2 ">
          <PiggyBank className="size-6" />
          <span className="text-xl">MyFinances</span>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6 items-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
