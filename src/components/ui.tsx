'use client';

import { useLanguage } from './language-provider';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={'rounded-lg border border-carbon-line bg-white p-5 shadow-soft ' + className}>{children}</section>;
}

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  const { t } = useLanguage();
  return (
    <header className="mb-6 flex items-start justify-between gap-4 max-md:flex-col">
      <div>
        <p className="mb-1 text-sm font-bold uppercase text-carbon-green">{t(eyebrow)}</p>
        <h1 className="text-3xl font-bold tracking-normal text-carbon-ink">{t(title)}</h1>
        {description ? <p className="mt-2 max-w-3xl text-carbon-muted">{t(description)}</p> : null}
      </div>
    </header>
  );
}

export function StatusPill({ status }: { status: string }) {
  const { t } = useLanguage();
  const color = status === 'Ready' || status === 'High' || status === 'Active' ? 'bg-green-50 text-carbon-green' : status === 'Missing' || status === 'Inactive' ? 'bg-red-50 text-carbon-danger' : 'bg-amber-50 text-carbon-amber';
  return <span className={'inline-flex min-h-7 items-center rounded-full px-3 text-sm font-semibold ' + color}>{t(status)}</span>;
}
