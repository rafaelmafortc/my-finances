import { TrafficCone } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function PageUnderConstruction() {
  return (
    <Empty className="w-full h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrafficCone />
        </EmptyMedia>
        <EmptyTitle>Em construção...</EmptyTitle>
        <EmptyDescription>
          Esta tela ainda não está disponível.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
