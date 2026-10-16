import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/shell';
export const metadata: Metadata = { title: 'Shift Control — управление сменой', description: 'Демонстрационная панель управления сменой кофейни' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body><Shell>{children}</Shell></body></html>; }
