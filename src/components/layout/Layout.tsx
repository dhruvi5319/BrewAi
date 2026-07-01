import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navigation />
      <div className="pt-14 md:pt-16">{children}</div>
    </>
  );
}
