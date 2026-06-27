'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ActivityRecord, EvidenceRecord, RecordStatus } from '@/lib/types';
import { T, useLanguage } from '@/components/language-provider';
import { buttonDanger, buttonPrimary, buttonSecondary, inputClass, requiredLabel } from './common';

interface Props {
  activities: ActivityRecord[];
  evidenceRecords: EvidenceRecord[];
  source: 'database' | 'sample';
}

type EvidenceForm = {
  id?: string;
  activityId: string;
  evidenceType: string;
  fileName: string;
  fileUrl: string;
  documentDate: string;
  dataPeriod: string;
  owner: string;
  status: RecordStatus;
  reviewerComment: string;
  note: string;
};

const emptyForm: EvidenceForm = {
  activityId: '',
  evidenceType: 'OTHER',
  fileName: '',
  fileUrl: '',
  documentDate: '',
  dataPeriod: '',
  owner: '',
  status: 'Draft',
  reviewerComment: '',
  note: ''
};

function fromEvidence(record: EvidenceRecord): EvidenceForm {
  return {
    id: record.id,
    activityId: record.activityId,
    evidenceType: record.evidenceType,
    fileName: record.fileName ?? '',
    fileUrl: record.fileUrl ?? '',
    documentDate: record.documentDate ?? '',
    dataPeriod: record.dataPeriod ?? '',
    owner: record.owner ?? '',
    status: record.status,
    reviewerComment: record.reviewerComment ?? '',
    note: record.note ?? ''
  };
}

export function EvidenceCrud({ activities, evidenceRecords, source }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EvidenceForm>(emptyForm);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  function validate() {
    const next = [];
    if (!form.activityId) next.push('Missing related activity record');
    if (!form.evidenceType.trim()) next.push('Missing evidence type');
    if (!form.fileName.trim() && !form.fileUrl.trim()) next.push('Missing evidence name or URL');
    if (form.fileUrl && !form.fileUrl.startsWith('http')) next.push('Evidence URL must start with http');
    setErrors(next);
    return next.length === 0;
  }

  async function save() {
    setMessage('');
    if (!validate()) return;
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to save evidence metadata.');
      return;
    }
    const payload = {
      activityId: form.activityId,
      evidenceType: form.evidenceType,
      fileName: form.fileName || undefined,
      fileUrl: form.fileUrl || undefined,
      documentDate: form.documentDate || undefined,
      dataPeriod: form.dataPeriod || undefined,
      owner: form.owner || undefined,
      status: form.status,
      reviewerComment: form.reviewerComment || undefined,
      note: form.note || undefined
    };
    const response = await fetch(form.id ? `/api/evidence/${form.id}` : '/api/evidence', {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? 'Could not save evidence metadata.');
      return;
    }
    setMessage('Evidence metadata saved.');
    setOpen(false);
    setForm(emptyForm);
    startTransition(() => router.refresh());
  }

  async function remove(record: EvidenceRecord) {
    if (!window.confirm(t('Delete this evidence metadata record?'))) return;
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to delete evidence metadata.');
      return;
    }
    const response = await fetch(`/api/evidence/${record.id}`, { method: 'DELETE' });
    const result = await response.json();
    setMessage(response.ok ? 'Evidence metadata deleted.' : result.error ?? 'Could not delete evidence metadata.');
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-carbon-muted">{t(source === 'sample' ? 'Demo mode: evidence changes are preview-only until DATABASE_URL is configured.' : 'Database mode: evidence metadata saves through Prisma APIs.')}</p>
          {message ? <p className="mt-1 text-sm font-semibold text-carbon-green">{t(message)}</p> : null}
        </div>
        <button className={buttonPrimary} onClick={() => { setForm({ ...emptyForm, activityId: activities[0]?.id ?? '' }); setOpen(true); }}><T>Add Evidence Metadata</T></button>
      </div>

      {open ? (
        <section className="rounded-lg border border-carbon-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{t(form.id ? 'Edit Evidence Metadata' : 'Add Evidence Metadata')}</h2>
            <button className={buttonSecondary} onClick={() => setOpen(false)}><T>Cancel</T></button>
          </div>
          <div className="grid grid-cols-3 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Related activity record')}<select className={inputClass} value={form.activityId} onChange={(event) => setForm({ ...form, activityId: event.target.value })}>{activities.map((activity) => <option key={activity.id} value={activity.id}>{activity.activityType} / {activity.month}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Evidence type')}<input className={inputClass} value={form.evidenceType} onChange={(event) => setForm({ ...form, evidenceType: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Evidence name</T><input className={inputClass} value={form.fileName} onChange={(event) => setForm({ ...form, fileName: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Evidence URL</T><input className={inputClass} value={form.fileUrl} onChange={(event) => setForm({ ...form, fileUrl: event.target.value })} placeholder="https://..." /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Document date</T><input className={inputClass} type="date" value={form.documentDate} onChange={(event) => setForm({ ...form, documentDate: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Data period</T><input className={inputClass} value={form.dataPeriod} onChange={(event) => setForm({ ...form, dataPeriod: event.target.value })} placeholder="2026-01" /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Owner</T><input className={inputClass} value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Status</T><select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as RecordStatus })}>{['Draft', 'Ready', 'Reviewed', 'Rejected', 'Inactive'].map((item) => <option key={item} value={item}>{t(item)}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-semibold"><T>Reviewer comment</T><input className={inputClass} value={form.reviewerComment} onChange={(event) => setForm({ ...form, reviewerComment: event.target.value })} /></label>
            <label className="grid gap-1 text-sm font-semibold md:col-span-2"><T>Note</T><textarea className={inputClass + ' min-h-20'} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className={buttonPrimary} disabled={isPending} onClick={save}><T>Save</T></button>
            <button className={buttonSecondary} onClick={() => setForm(emptyForm)}><T>Clear</T></button>
          </div>
          {errors.length ? <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-carbon-amber">{errors.map((error) => t(error)).join(' · ')}</div> : null}
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {evidenceRecords.length ? evidenceRecords.map((record) => (
          <span key={record.id} className="inline-flex items-center gap-2 rounded-full bg-carbon-bg px-3 py-2 text-xs font-semibold">
            {record.fileName || record.evidenceType}
            <button className="text-carbon-green" onClick={() => { setForm(fromEvidence(record)); setOpen(true); }}><T>Edit</T></button>
            <button className="text-carbon-danger" onClick={() => remove(record)}><T>Delete</T></button>
          </span>
        )) : <p className="text-sm text-carbon-muted">{t('No evidence metadata yet.')}</p>}
      </div>
    </div>
  );
}


