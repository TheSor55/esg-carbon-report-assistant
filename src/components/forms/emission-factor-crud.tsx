'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { EmissionFactor, FactorVerificationStatus } from '@/lib/types';
import { T, useLanguage } from '@/components/language-provider';
import { buttonDanger, buttonPrimary, buttonSecondary, inputClass, requiredLabel } from './common';

interface Props {
  factors: EmissionFactor[];
  source: 'database' | 'sample';
}

type FactorForm = {
  id?: string;
  factorCode: string;
  factorName: string;
  activityType: string;
  category: string;
  gasType: string;
  unit: string;
  kgCO2ePerUnit: string;
  source: string;
  sourceYear: string;
  version: string;
  effectiveDate: string;
  expiryDate: string;
  countryRegion: string;
  verificationStatus: FactorVerificationStatus;
  isActive: boolean;
  referenceNote: string;
  metadataOnly: boolean;
};

const emptyForm: FactorForm = {
  factorCode: '',
  factorName: '',
  activityType: '',
  category: '',
  gasType: 'CO2e',
  unit: '',
  kgCO2ePerUnit: '',
  source: '',
  sourceYear: String(new Date().getFullYear()),
  version: '',
  effectiveDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  countryRegion: 'Thailand',
  verificationStatus: 'Demo',
  isActive: true,
  referenceNote: '',
  metadataOnly: false
};

function fromFactor(factor: EmissionFactor, mode: 'metadata' | 'version'): FactorForm {
  return {
    id: mode === 'metadata' ? factor.id : undefined,
    factorCode: factor.factorCode,
    factorName: factor.factorName,
    activityType: factor.activityType,
    category: '',
    gasType: factor.gasType,
    unit: factor.unit,
    kgCO2ePerUnit: String(factor.kgCO2ePerUnit),
    source: factor.source,
    sourceYear: String(factor.sourceYear),
    version: mode === 'version' ? '' : factor.version,
    effectiveDate: factor.effectiveDate,
    expiryDate: factor.expiryDate ?? '',
    countryRegion: factor.countryRegion,
    verificationStatus: factor.verificationStatus ?? 'Demo',
    isActive: factor.isActive,
    referenceNote: factor.referenceNote,
    metadataOnly: mode === 'metadata'
  };
}

export function EmissionFactorCrud({ factors, source }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FactorForm>(emptyForm);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  function validate() {
    const next = [];
    if (!form.metadataOnly) {
      if (!form.factorCode.trim()) next.push('Missing code');
      if (!form.factorName.trim()) next.push('Missing factor name');
      if (!form.unit.trim()) next.push('Missing unit');
      if (!form.kgCO2ePerUnit || Number(form.kgCO2ePerUnit) < 0) next.push('Missing kgCO2e per unit');
      if (!form.version.trim()) next.push('Missing version');
      if (factors.some((factor) => factor.factorCode === form.factorCode && factor.version === form.version)) next.push('Duplicate factor code/version');
    }
    setErrors(next);
    return next.length === 0;
  }

  async function save() {
    setMessage('');
    if (!validate()) return;
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to save emission factors.');
      return;
    }
    const payload = form.metadataOnly ? {
      expiryDate: form.expiryDate || null,
      referenceNote: form.referenceNote || null,
      verificationStatus: form.verificationStatus,
      isActive: form.isActive
    } : {
      factorCode: form.factorCode,
      factorName: form.factorName,
      activityType: form.activityType,
      gasType: form.gasType,
      unit: form.unit,
      kgCO2ePerUnit: Number(form.kgCO2ePerUnit),
      source: form.source,
      sourceYear: Number(form.sourceYear),
      version: form.version,
      effectiveDate: form.effectiveDate,
      expiryDate: form.expiryDate || undefined,
      countryRegion: form.countryRegion,
      referenceNote: form.referenceNote || undefined,
      verificationStatus: form.verificationStatus,
      isActive: form.isActive
    };
    const response = await fetch(form.metadataOnly && form.id ? `/api/emission-factors/${form.id}` : '/api/emission-factors', {
      method: form.metadataOnly && form.id ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? 'Could not save emission factor.');
      return;
    }
    setMessage(form.metadataOnly ? 'Emission factor metadata updated.' : 'Emission factor version created.');
    setOpen(false);
    setForm(emptyForm);
    startTransition(() => router.refresh());
  }

  async function deactivate(factor: EmissionFactor) {
    if (!window.confirm(t('Deactivate this emission factor? Historical records will remain preserved.'))) return;
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to deactivate emission factors.');
      return;
    }
    const response = await fetch(`/api/emission-factors/${factor.id}`, { method: 'DELETE' });
    const result = await response.json();
    setMessage(response.ok ? 'Emission factor deactivated.' : result.error ?? 'Could not deactivate factor.');
    startTransition(() => router.refresh());
  }

  return (
    <div className="mb-4 grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-carbon-muted">{t(source === 'sample' ? 'Demo mode: factor changes are preview-only until DATABASE_URL is configured.' : 'Database mode: new EF values are saved as new versions.')}</p>
          {message ? <p className="mt-1 text-sm font-semibold text-carbon-green">{t(message)}</p> : null}
        </div>
        <button className={buttonPrimary} onClick={() => { setForm(emptyForm); setErrors([]); setOpen(true); }}><T>Add Emission Factor</T></button>
      </div>

      {open ? (
        <section className="rounded-lg border border-carbon-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{t(form.metadataOnly ? 'Edit Metadata Only' : 'Create Emission Factor Version')}</h2>
            <button className={buttonSecondary} onClick={() => setOpen(false)}><T>Cancel</T></button>
          </div>
          {form.metadataOnly ? <p className="mb-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-carbon-amber">{t('Factor value, unit, source, and version are locked. Create a new version if the EF value changes.')}</p> : null}
          <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Code')}<input className={inputClass} disabled={form.metadataOnly} value={form.factorCode} onChange={(event) => setForm({ ...form, factorCode: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Factor name')}<input className={inputClass} disabled={form.metadataOnly} value={form.factorName} onChange={(event) => setForm({ ...form, factorName: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Activity type</T><input className={inputClass} disabled={form.metadataOnly} value={form.activityType} onChange={(event) => setForm({ ...form, activityType: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Scope/category</T><input className={inputClass} disabled={form.metadataOnly} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Gas</T><input className={inputClass} disabled={form.metadataOnly} value={form.gasType} onChange={(event) => setForm({ ...form, gasType: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Unit')}<input className={inputClass} disabled={form.metadataOnly} value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('kgCO2e per unit')}<input className={inputClass} disabled={form.metadataOnly} type="number" value={form.kgCO2ePerUnit} onChange={(event) => setForm({ ...form, kgCO2ePerUnit: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Source</T><input className={inputClass} disabled={form.metadataOnly} value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Source year</T><input className={inputClass} disabled={form.metadataOnly} type="number" value={form.sourceYear} onChange={(event) => setForm({ ...form, sourceYear: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Version')}<input className={inputClass} disabled={form.metadataOnly} value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Effective date</T><input className={inputClass} disabled={form.metadataOnly} type="date" value={form.effectiveDate} onChange={(event) => setForm({ ...form, effectiveDate: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Expiry date</T><input className={inputClass} type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Verification status</T><select className={inputClass} value={form.verificationStatus} onChange={(event) => setForm({ ...form, verificationStatus: event.target.value as FactorVerificationStatus })}>{['Demo', 'Pending Review', 'Verified'].map((item) => <option key={item} value={item}>{t(item)}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Status</T><select className={inputClass} value={form.isActive ? 'Active' : 'Inactive'} onChange={(event) => setForm({ ...form, isActive: event.target.value === 'Active' })}><option value="Active">{t('Active')}</option><option value="Inactive">{t('Inactive')}</option></select></label>
            <label className="grid gap-1 text-sm font-semibold md:col-span-2"><T>Note</T><textarea className={inputClass + ' min-h-20'} value={form.referenceNote} onChange={(event) => setForm({ ...form, referenceNote: event.target.value })} /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className={buttonPrimary} disabled={isPending} onClick={save}><T>Save</T></button>
            <button className={buttonSecondary} onClick={() => setForm(emptyForm)}><T>Clear</T></button>
          </div>
          {form.verificationStatus !== 'Verified' ? <p className="mt-2 text-sm font-semibold text-carbon-amber">{t('Warning: records using this EF should be reviewed before verification.')}</p> : null}
          {errors.length ? <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-carbon-amber">{errors.map((error) => t(error)).join(' · ')}</div> : null}
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {factors.map((factor) => (
          <span key={factor.id} className="inline-flex items-center gap-2 rounded-full bg-carbon-bg px-3 py-2 text-xs font-semibold">
            {factor.factorCode} v{factor.version}
            <button className="text-carbon-green" onClick={() => { setForm(fromFactor(factor, 'version')); setOpen(true); }}><T>New version</T></button>
            <button className="text-carbon-green" onClick={() => { setForm(fromFactor(factor, 'metadata')); setOpen(true); }}><T>Metadata</T></button>
            <button className="text-carbon-danger" onClick={() => deactivate(factor)}><T>Deactivate</T></button>
          </span>
        ))}
      </div>
    </div>
  );
}


