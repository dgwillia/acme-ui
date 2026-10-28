import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SupplierRequests } from './SupplierRequests';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupplierRequests />
  </StrictMode>,
);
