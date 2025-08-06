'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Demo8Layout } from '@/app/components/layouts/demo8/layout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  if (!user) {
    return <ScreenLoader />;
  }

  return <Demo8Layout>{children}</Demo8Layout>;
}
