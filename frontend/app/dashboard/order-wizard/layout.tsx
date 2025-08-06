import { ReactNode } from 'react';

export default function OrderWizardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      height: 'auto',
      overflow: 'visible' 
    }}>
      {children}
    </div>
  );
}