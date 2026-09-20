import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../../utils/usePageTitle';
import { patientApi, careGapApi, referralApi, encounterApi } from '../../api/services';
import { offlineStore } from '../../offline/offlineStore';
import { useOfflineSync } from '../../offline/useOfflineSync';
import { PageHeader } from '../../components/ui/PageHeader';
import { KPIStrip } from '../../components/ui/KPIStrip';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { SuccessState } from '../../components/ui/SuccessState';
import type { Patient, CareGap, Referral } from '../../types';
import './AshaDashboard.css';

export const AshaDashboard: React.FC = () => {
  usePageTitle("Today's Work — ASHA Portal");
  const { isOnline, pendingCount, triggerSync } = useOfflineSync();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [careGaps, setCareGaps] = useState<CareGap[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'patients' | 'gaps' | 'referrals' | 'enroll'>('home');

  const [searchQuery, setSearchQuery] = useState('');
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visitBP, setVisitBP] = useState('140/92');
  const [visitNotes, setVisitNotes] = useState('Elevated BP observed during home visit. Mild pedal edema.');
  const [visitSuccess, setVisitSuccess] = useState(false);

  const [newFullName, setNewFullName] = useState('');
  const [newAge, setNewAge] = useState('24');
  const [newVillage, setNewVillage] = useState('Shampur');
  const [newPhone, setNewPhone] = useState('9876543210');
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.allSettled([
      patientApi.list().then(setPatients),
      careGapApi.list().then(setCareGaps),
      referralApi.list().then(setReferrals),
    ]).finally(async () => {
      if (patients.length === 0) {
        const cached = await offlineStore.getCachedList('patients') as unknown as Patient[];
        if (cached && cached.length > 0) {
          setPatients(cached);
        } else {
          setPatients([
            { id: 'p-01', pseudonymous_id: 'PID-2026-SUNITA-9021', full_name: 'Sunita Devi', date_of_birth: '2000-05-14', gender: 'female', blood_group: 'B+', phone: '9876543210', village: 'Shampur (Ward 3)', district_id: 'dist-varanasi', facility_id: 'fac-shampur-sc', abha_id: '91-4829-1920-1122', is_active: true, created_at: '2026-09-01T08:00:00Z' },
            { id: 'p-02', pseudonymous_id: 'PID-2026-RADHA-4812', full_name: 'Radha Kumari', date_of_birth: '1998-11-20', gender: 'female', blood_group: 'O+', phone: '9876543211', village: 'Shampur (Ward 1)', district_id: 'dist-varanasi', facility_id: 'fac-shampur-sc', abha_id: '91-3829-9182-3344', is_active: true, created_at: '2026-08-15T09:30:00Z' },
            { id: 'p-03', pseudonymous_id: 'PID-2026-RAMESH-7731', full_name: 'Ramesh Patel', date_of_birth: '1975-03-10', gender: 'male', blood_group: 'A+', phone: '9876543212', village: 'Belwa', district_id: 'dist-varanasi', facility_id: 'fac-shampur-sc', abha_id: '91-1122-3344-5566', is_active: true, created_at: '2026-07-20T10:00:00Z' },
          ]);
        }
      }
      setCareGaps((prev) => prev.length > 0 ? prev : [
        { id: 'gap-01', patient_id: 'p-01', gap_type: 'ANC_2_OVERDUE', description: 'Sunita Devi (14w ANC) missed ANC-2 checkup window. Distance > 12km from CHC.', severity: 'high', status: 'alerted', detected_at: '2026-09-12T08:00:00Z', due_date: '2026-09-22T00:00:00Z', resolved_at: null, assigned_worker_id: 'asha_priya' },
        { id: 'gap-02', patient_id: 'p-03', gap_type: 'TB_DOTS_REFILL_DUE', description: 'Ramesh Patel: Intensive Phase Month 2 medication blister pack pickup overdue by 3 days.', severity: 'critical', status: 'alerted', detected_at: '2026-09-15T09:00:00Z', due_date: '2026-09-18T00:00:00Z', resolved_at: null, assigned_worker_id: 'asha_priya' },
      ]);
      setReferrals((prev) => prev.length > 0 ? prev : [
        { id: 'ref-01', referral_token: 'REF-2026-8812', patient_id: 'p-01', referring_facility_id: 'Shampur Sub-Center', receiving_facility_id: 'Ramnagar CHC', status: 'issued', priority: 'urgent', reason: 'Elevated BP (140/92) + Second trimester ultrasound screening for pre-eclampsia', clinical_summary: 'Gravida 2, Para 1. Mild pedal edema noted.', diagnosis: 'Gestational Hypertension Risk', created_at: '2026-09-15T10:30:00Z', completed_at: null },
      ]);
      setIsLoading(false);
    });
  }, [patients.length]);

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pseudonymous_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.village && p.village.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLogHomeVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const encounterPayload = {
      patient_id: selectedPatient.id,
      encounter_type: 'outreach',
      encounter_date: new Date().toISOString(),
      chief_complaint: 'Routine ASHA Home Outreach & Vitals Check',
      treatment_plan: 'Dispensed IFA 30 tablets. Advised low-salt diet and immediate CHC visit.',
      notes: visitNotes,
      vitals: { bp: visitBP, weight_kg: 54 },
    };
    try {
      if (isOnline) {
        await encounterApi.create(encounterPayload as unknown as import('../../types').EncounterCreate);
      } else {
        await offlineStore.enqueueAction({ type: 'CREATE_ENCOUNTER', endpoint: '/encounters', payload: encounterPayload });
      }
    } catch {
      await offlineStore.enqueueAction({ type: 'CREATE_ENCOUNTER', endpoint: '/encounters', payload: encounterPayload });
    }
    setVisitSuccess(true);
    setTimeout(() => { setShowVisitModal(false); setVisitSuccess(false); }, 1200);
  };

  const handleEnrollPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPID = `PID-2026-${newFullName.toUpperCase().replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPat: Patient = {
      id: `p-${Date.now()}`, pseudonymous_id: newPID, full_name: newFullName,
      date_of_birth: `${2026 - parseInt(newAge)}-01-01`, gender: 'female', blood_group: 'B+',
      phone: newPhone, village: `${newVillage} Village`, district_id: 'dist-varanasi',
      facility_id: 'fac-shampur-sc', abha_id: null, is_active: true, created_at: new Date().toISOString(),
    };
    try {
      if (isOnline) {
        await patientApi.create(newPat as unknown as import('../../types').PatientCreate);
      } else {
        await offlineStore.enqueueAction({ type: 'CREATE_PATIENT', endpoint: '/patients', payload: newPat as unknown as Record<string, unknown> });
      }
    } catch {
      await offlineStore.enqueueAction({ type: 'CREATE_PATIENT', endpoint: '/patients', payload: newPat as unknown as Record<string, unknown> });
    }
    setPatients([newPat, ...patients]);
    setEnrollSuccess(true);
    setTimeout(() => { setEnrollSuccess(false); setActiveTab('patients'); setNewFullName(''); }, 1500);
  };

  const criticalGaps = careGaps.filter((g) => g.severity === 'critical').length;

  return (
    <div className="asha-dashboard">
      {/* Page Header */}
      <PageHeader
        eyebrow="CARE CONTINUITY"
        title="Today's Work"
        description="Review patients requiring follow-up and complete pending care actions."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<Icon name="scan" size={16} />}
            onClick={() => alert('Camera QR Scanner Initialized')}
          >
            Scan Care Passport
          </Button>
        }
      />

      {/* KPI Strip */}
      <KPIStrip
        items={[
          { label: 'Patients due', value: patients.length, subtitle: 'Enrolled in Shampur SC' },
          { label: 'Care gaps', value: careGaps.length, subtitle: criticalGaps > 0 ? `${criticalGaps} critical` : 'All routine' },
          { label: 'Referrals pending', value: referrals.filter(r => r.status !== 'completed').length },
          { label: 'Sync status', value: isOnline ? 'Online' : `${pendingCount} pending`, subtitle: isOnline ? 'Connected' : 'Offline mode' },
        ]}
      />

      {/* Quick Actions */}
      <div className="asha-quick-actions">
        <Button variant="primary" size="sm" icon={<Icon name="scan" size={16} />} onClick={() => alert('Camera QR Scanner')}>
          Scan Care Passport
        </Button>
        <Button variant="outline" size="sm" icon={<Icon name="search" size={16} />} onClick={() => setActiveTab('patients')}>
          Search Patient
        </Button>
        <Button variant="outline" size="sm" icon={<Icon name="alert" size={16} />} onClick={() => setActiveTab('gaps')}>
          View Care Gaps
        </Button>
        <Button variant="outline" size="sm" icon={<Icon name="hospital" size={16} />} onClick={() => setActiveTab('referrals')}>
          Create Referral
        </Button>
        {isOnline && pendingCount > 0 && (
          <Button variant="outline" size="sm" icon={<Icon name="sync" size={16} />} onClick={() => triggerSync()}>
            Sync ({pendingCount})
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className="asha-tabs" aria-label="ASHA sections">
        {[
          { key: 'home', label: 'Priority Tasks' },
          { key: 'patients', label: `Patients (${patients.length})` },
          { key: 'gaps', label: `Care Gaps (${careGaps.length})` },
          { key: 'referrals', label: `Referrals (${referrals.length})` },
          { key: 'enroll', label: 'Register New' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`asha-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab: Priority Tasks (Home) */}
      {activeTab === 'home' && (
        <div className="asha-section">
          <h2 className="section-heading">Priority Tasks</h2>
          {isLoading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : careGaps.length === 0 ? (
            <EmptyState icon="check" title="No Pending Tasks" description="All assigned patients are up to date on care schedules." />
          ) : (
            <div className="priority-list">
              {careGaps.map((gap) => {
                const patient = patients.find((p) => p.id === gap.patient_id);
                return (
                  <div key={gap.id} className="priority-card">
                    <div className="priority-card-left">
                      <StatusBadge
                        status={gap.severity === 'critical' ? 'urgent' : 'high-priority'}
                        label={gap.severity.toUpperCase()}
                      />
                      <div className="priority-info">
                        <span className="priority-patient">{patient?.full_name || 'Unknown Patient'}</span>
                        <span className="priority-type">{gap.gap_type.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                    <div className="priority-card-right">
                      <span className="priority-due">
                        Due: {gap.due_date ? new Date(gap.due_date).toLocaleDateString() : 'Immediate'}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient || null);
                          setShowVisitModal(true);
                        }}
                      >
                        Conduct Visit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Patient Register */}
      {activeTab === 'patients' && (
        <div className="asha-section">
          <div className="patient-search-bar">
            <div className="search-input-wrapper">
              <Icon name="search" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient by name, ID, or village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search patients"
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : filteredPatients.length === 0 ? (
            <EmptyState
              icon="search"
              title="No Matching Patients"
              description={`No records matching "${searchQuery}". Check spelling or register a new patient.`}
              actionLabel="Register New Patient"
              onAction={() => setActiveTab('enroll')}
            />
          ) : (
            <div className="patient-list">
              {filteredPatients.map((p) => (
                <div key={p.id} className="patient-card">
                  <div className="patient-card-main">
                    <div className="patient-card-identity">
                      <h3 className="patient-name">{p.full_name}</h3>
                      <span className="patient-village">{p.village}</span>
                    </div>
                    <div className="patient-card-meta">
                      <StatusBadge status="active" label={p.pseudonymous_id} size="sm" />
                      <span className="patient-detail">
                        <Icon name="phone" size={12} />
                        {p.phone || 'No phone'}
                      </span>
                      <span className="patient-detail">
                        Blood: {p.blood_group}
                      </span>
                    </div>
                  </div>
                  <div className="patient-card-actions">
                    <Button variant="primary" size="sm" onClick={() => { setSelectedPatient(p); setShowVisitModal(true); }}>
                      Log Visit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(p); setActiveTab('referrals'); }}>
                      Refer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Care Gaps */}
      {activeTab === 'gaps' && (
        <div className="asha-section">
          <h2 className="section-heading">Active Care Gaps</h2>
          {careGaps.length === 0 ? (
            <EmptyState icon="check" title="No Active Care Gaps" description="All patients are up to date on treatment schedules." />
          ) : (
            <div className="gaps-list">
              {careGaps.map((gap) => (
                <div key={gap.id} className="gap-card">
                  <div className="gap-card-header">
                    <StatusBadge status={gap.severity === 'critical' ? 'urgent' : 'high-priority'} label={`${gap.severity.toUpperCase()} ALERT`} />
                    <span className="gap-type">{gap.gap_type.replace(/_/g, ' ')}</span>
                    <span className="gap-due">Due: {gap.due_date ? new Date(gap.due_date).toLocaleDateString() : 'Immediate'}</span>
                  </div>
                  <p className="gap-description">{gap.description}</p>
                  <div className="gap-card-footer">
                    <Button variant="primary" size="sm" onClick={() => { setSelectedPatient(patients[0] || null); setShowVisitModal(true); }}>
                      Conduct Visit & Close Gap
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Referrals */}
      {activeTab === 'referrals' && (
        <div className="asha-section">
          <h2 className="section-heading">Active Referrals</h2>
          <p className="section-sub">Track patient transit and receive closed-loop discharge feedback.</p>
          {referrals.length === 0 ? (
            <EmptyState icon="hospital" title="No Pending Referrals" description="No active referrals dispatched from this sub-center." />
          ) : (
            <div className="referral-list">
              {referrals.map((r) => (
                <div key={r.id} className="referral-card">
                  <div className="referral-card-header">
                    <span className="referral-token">{r.referral_token}</span>
                    <StatusBadge status={r.priority === 'urgent' ? 'urgent' : 'routine'} label={r.priority.toUpperCase()} />
                  </div>
                  <h4 className="referral-reason">{r.reason}</h4>
                  <div className="referral-details">
                    <div className="referral-detail-row"><span className="detail-label">Diagnosis</span><span>{r.diagnosis}</span></div>
                    <div className="referral-detail-row"><span className="detail-label">Receiving</span><span>{r.receiving_facility_id}</span></div>
                  </div>
                  <div className="referral-tracker">
                    {['Created', 'In Transit', 'Received', 'Completed'].map((step, i) => {
                      const statusMap: Record<string, number> = { created: 0, issued: 1, in_transit: 1, accepted: 2, arrived: 2, received: 2, completed: 3 };
                      const currentIdx = statusMap[r.status] ?? 0;
                      const stepState = i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'pending';
                      return (
                        <div key={step} className={`tracker-step tracker-${stepState}`}>
                          <span className="tracker-indicator">
                            {stepState === 'done' ? <Icon name="check" size={10} /> : <span>{i + 1}</span>}
                          </span>
                          <span className="tracker-label">{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Register New Patient */}
      {activeTab === 'enroll' && (
        <div className="asha-section">
          <div className="enroll-card">
            <h2 className="section-heading">Register New Patient</h2>
            <p className="section-sub">Patient will be enrolled locally with a Care Passport credential.</p>

            {enrollSuccess && (
              <SuccessState title="Patient Enrolled" message="Care Passport generated successfully." />
            )}

            {!enrollSuccess && (
              <form className="enroll-form" onSubmit={handleEnrollPatient}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="new-fullname">Full Name</label>
                    <input id="new-fullname" type="text" className="form-input" placeholder="e.g. Meena Devi" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-age">Age</label>
                    <input id="new-age" type="number" className="form-input" value={newAge} onChange={(e) => setNewAge(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="new-village">Village</label>
                    <input id="new-village" type="text" className="form-input" value={newVillage} onChange={(e) => setNewVillage(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-phone">Mobile</label>
                    <input id="new-phone" type="tel" className="form-input" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Generate Care Passport & Enroll
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Log Home Visit */}
      {showVisitModal && selectedPatient && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-visit-title">
          <div className="modal-content">
            <div className="modal-header">
              <h3 id="modal-visit-title">Log Visit: {selectedPatient.full_name}</h3>
              <button className="modal-close" onClick={() => setShowVisitModal(false)} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>

            {visitSuccess ? (
              <SuccessState
                title="Visit Recorded"
                message={`Encounter saved ${isOnline ? 'online' : 'to offline queue'}.`}
                detail={`Sync status: ${isOnline ? 'Synchronized' : 'Pending synchronization'}`}
              />
            ) : (
              <form onSubmit={handleLogHomeVisit}>
                <div className="form-group">
                  <label htmlFor="modal-bp">Blood Pressure</label>
                  <input id="modal-bp" type="text" className="form-input" value={visitBP} onChange={(e) => setVisitBP(e.target.value)} placeholder="e.g. 120/80" required />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-notes">Clinical Notes</label>
                  <textarea id="modal-notes" className="form-input form-textarea" value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)} rows={3} required />
                </div>
                <div className="modal-actions">
                  <Button variant="ghost" size="sm" onClick={() => setShowVisitModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save ({isOnline ? 'Online' : 'Offline Queue'})
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
