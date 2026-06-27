'use client';

import { T } from '@/components/language-provider';

export const inputClass = 'rounded-lg border border-carbon-line px-3 py-2 text-sm';
export const buttonPrimary = 'rounded-lg bg-carbon-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';
export const buttonSecondary = 'rounded-lg border border-carbon-line bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50';
export const buttonDanger = 'rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-carbon-danger disabled:opacity-50';

export function requiredLabel(label: string) {
  return (
    <>
      <T>{label}</T> <span className="text-carbon-danger">*</span>
    </>
  );
}
