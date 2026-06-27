'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Department, OrganizationProfile, Site } from '@/lib/types';
import { T, useLanguage } from '@/components/language-provider';
import { buttonDanger, buttonPrimary, buttonSecondary, inputClass, requiredLabel } from './common';

interface Props {
  organization: OrganizationProfile;
  sites: Site[];
  departments: Department[];
  source: 'database' | 'sample';
}

export function OrganizationCrud({ organization, sites, departments, source }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    name: organization.name,
    reportingYear: String(organization.reportingYear),
    baseYear: String(organization.baseYear),
    consolidationApproach: organization.consolidationApproach,
    organizationalBoundary: organization.organizationalBoundary,
    operationalBoundary: organization.operationalBoundary,
    assumptions: organization.assumptions.join('\n'),
    exclusions: organization.exclusions.join('\n')
  });
  const [siteForm, setSiteForm] = useState({ name: '', address: '' });
  const [departmentName, setDepartmentName] = useState('');

  async function saveProfile() {
    setMessage('');
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to save organization changes.');
      return;
    }
    const response = await fetch('/api/organization', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        reportingYear: Number(profile.reportingYear),
        baseYear: Number(profile.baseYear),
        consolidationApproach: profile.consolidationApproach,
        organizationalBoundary: profile.organizationalBoundary,
        operationalBoundary: profile.operationalBoundary,
        assumptions: profile.assumptions.split('\n').map((item) => item.trim()).filter(Boolean),
        exclusions: profile.exclusions.split('\n').map((item) => item.trim()).filter(Boolean)
      })
    });
    const result = await response.json();
    setMessage(response.ok ? 'Organization profile saved.' : result.error ?? 'Could not save organization profile.');
    startTransition(() => router.refresh());
  }

  async function addSite() {
    if (!siteForm.name.trim()) {
      setMessage('Facility/site name is required.');
      return;
    }
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to save facilities/sites.');
      return;
    }
    const response = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(siteForm)
    });
    const result = await response.json();
    setMessage(response.ok ? 'Facility/site added.' : result.error ?? 'Could not add facility/site.');
    setSiteForm({ name: '', address: '' });
    startTransition(() => router.refresh());
  }

  async function deleteSite(site: Site) {
    if (!window.confirm(t('Delete this facility/site? Linked activity records will block deletion.'))) return;
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to delete facilities/sites.');
      return;
    }
    const response = await fetch(`/api/sites/${site.id}`, { method: 'DELETE' });
    const result = await response.json();
    setMessage(response.ok ? 'Facility/site deleted.' : result.error ?? 'Could not delete facility/site.');
    startTransition(() => router.refresh());
  }

  async function addDepartment() {
    if (!departmentName.trim()) {
      setMessage('Department name is required.');
      return;
    }
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to save departments.');
      return;
    }
    const response = await fetch('/api/departments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: departmentName })
    });
    const result = await response.json();
    setMessage(response.ok ? 'Department added.' : result.error ?? 'Could not add department.');
    setDepartmentName('');
    startTransition(() => router.refresh());
  }

  async function deleteDepartment(department: Department) {
    if (!window.confirm(t('Delete this department? Linked activity records will block deletion.'))) return;
    if (source === 'sample') {
      setMessage('Demo mode: connect DATABASE_URL to delete departments.');
      return;
    }
    const response = await fetch(`/api/departments/${department.id}`, { method: 'DELETE' });
    const result = await response.json();
    setMessage(response.ok ? 'Department deleted.' : result.error ?? 'Could not delete department.');
    startTransition(() => router.refresh());
  }

  return (
    <div className="mb-4 grid gap-4">
      <section className="rounded-lg border border-carbon-line bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold"><T>Edit organization and boundary</T></h2>
            <p className="text-sm font-semibold text-carbon-muted">{t(source === 'sample' ? 'Demo mode: changes are preview-only until DATABASE_URL is configured.' : 'Database mode: profile changes save through Prisma APIs.')}</p>
            {message ? <p className="mt-1 text-sm font-semibold text-carbon-green">{t(message)}</p> : null}
          </div>
          <button className={buttonPrimary} disabled={isPending} onClick={saveProfile}><T>Save Profile</T></button>
        </div>
        <div className="grid grid-cols-3 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
          <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Organization name')}<input className={inputClass} value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold">{requiredLabel('Reporting year')}<input className={inputClass} type="number" value={profile.reportingYear} onChange={(event) => setProfile({ ...profile, reportingYear: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold"><T>Base year</T><input className={inputClass} type="number" value={profile.baseYear} onChange={(event) => setProfile({ ...profile, baseYear: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold"><T>Consolidation approach</T><input className={inputClass} value={profile.consolidationApproach} onChange={(event) => setProfile({ ...profile, consolidationApproach: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold md:col-span-2"><T>Boundary description</T><textarea className={inputClass + ' min-h-20'} value={profile.organizationalBoundary} onChange={(event) => setProfile({ ...profile, organizationalBoundary: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold md:col-span-2"><T>Operational boundary</T><textarea className={inputClass + ' min-h-20'} value={profile.operationalBoundary} onChange={(event) => setProfile({ ...profile, operationalBoundary: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold"><T>Assumptions</T><textarea className={inputClass + ' min-h-20'} value={profile.assumptions} onChange={(event) => setProfile({ ...profile, assumptions: event.target.value })} /></label>
          <label className="grid gap-1 text-sm font-semibold"><T>Exclusions</T><textarea className={inputClass + ' min-h-20'} value={profile.exclusions} onChange={(event) => setProfile({ ...profile, exclusions: event.target.value })} /></label>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <div className="rounded-lg border border-carbon-line bg-white p-4">
          <h2 className="mb-3 text-lg font-bold"><T>Facilities/sites</T></h2>
          <div className="mb-3 grid grid-cols-[1fr_1fr_auto] gap-2 max-md:grid-cols-1">
            <input className={inputClass} placeholder={t('Facility/site name')} value={siteForm.name} onChange={(event) => setSiteForm({ ...siteForm, name: event.target.value })} />
            <input className={inputClass} placeholder={t('Address')} value={siteForm.address} onChange={(event) => setSiteForm({ ...siteForm, address: event.target.value })} />
            <button className={buttonSecondary} onClick={addSite}><T>Add</T></button>
          </div>
          <div className="grid gap-2">{sites.map((site) => <div key={site.id} className="flex items-center justify-between gap-3 border-b border-carbon-line pb-2"><span><strong>{site.name}</strong><br /><small className="text-carbon-muted">{site.address}</small></span><button className={buttonDanger} onClick={() => deleteSite(site)}><T>Delete</T></button></div>)}</div>
        </div>
        <div className="rounded-lg border border-carbon-line bg-white p-4">
          <h2 className="mb-3 text-lg font-bold"><T>Departments</T></h2>
          <div className="mb-3 grid grid-cols-[1fr_auto] gap-2">
            <input className={inputClass} placeholder={t('Department name')} value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} />
            <button className={buttonSecondary} onClick={addDepartment}><T>Add</T></button>
          </div>
          <div className="flex flex-wrap gap-2">{departments.map((department) => <span key={department.id} className="inline-flex items-center gap-2 rounded-full bg-carbon-bg px-3 py-2 text-sm font-semibold">{department.name}<button className="text-carbon-danger" onClick={() => deleteDepartment(department)}><T>Delete</T></button></span>)}</div>
        </div>
      </section>
    </div>
  );
}

