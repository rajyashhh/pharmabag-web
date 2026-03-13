'use client';

import { ReactQueryProvider } from '@/lib/react-query-provider';
import { AuthProvider } from '@pharmabag/api-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}
