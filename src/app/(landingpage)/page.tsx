import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        Login
      </Link>
    </div>
  );
}
