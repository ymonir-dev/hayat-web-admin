import type { ProviderContext } from './types';

export type NavDef = {
  to: string;
  label: string;
  icon: string;
  permission?: string;
  roles?: string[];
};

export const ROLE_LABELS: Record<string,string> = {
  owner: 'Hospital Owner / Super Admin',
  admin: 'Hospital Admin / General Manager',
  department_manager: 'Department Manager / Supervisor',
  receptionist: 'Receptionist',
  hr: 'Human Resources',
  accountant: 'Accountant / Finance',
  cashier: 'Cashier',
  doctor_coordinator: 'Doctor Coordinator / Medical Affairs',
  doctor: 'Doctor',
  nurse: 'Nurse',
  lab_staff: 'Laboratory Staff',
  radiology_staff: 'Radiology Staff',
  pharmacy_staff: 'Pharmacy Staff',
  auditor: 'Auditor / Compliance',
  service_coordinator: 'Service Coordinator',
};

export const ROLE_DESCRIPTIONS: Record<string,string> = {
  owner: 'Executive oversight of the complete hospital organization.',
  admin: 'Hospital-wide operations, performance, approvals and coordination.',
  department_manager: 'Department team, workload, tasks, leave and incidents.',
  receptionist: 'Patient registration, appointments, check-in and front-desk workflow.',
  hr: 'Employees, attendance, leave, payroll support and HR administration.',
  accountant: 'Financial operations, transactions, reports and settlements.',
  cashier: 'Payments, receipts, refunds and front-desk financial transactions.',
  doctor_coordinator: 'Doctor schedules, availability, coordination and medical affairs.',
  doctor: 'Clinical schedule, appointments and assigned patient workflow.',
  nurse: 'Nursing queue, assigned work and patient-support workflow.',
  lab_staff: 'Laboratory requests, investigation queue and result workflow.',
  radiology_staff: 'Radiology requests, imaging queue and result workflow.',
  pharmacy_staff: 'Pharmacy requests, dispensing queue and medication workflow.',
  auditor: 'Compliance monitoring, audit findings and corrective actions.',
  service_coordinator: 'Home services, packages and operational service requests.',
};

export const NAV_ITEMS: NavDef[] = [
  {to:'/', label:'Dashboard', icon:'dashboard'},
  {to:'/owner', label:'Owner Control Center', icon:'shield', roles:['owner']},
  {to:'/admin', label:'Hospital Administration', icon:'building', roles:['admin']},
  {to:'/manager', label:'Department Management', icon:'team', roles:['department_manager']},
  {to:'/audit', label:'Audit & Compliance', icon:'audit', roles:['auditor']},
  {to:'/hr', label:'HR & Leave', icon:'hr', roles:['hr','owner','admin']},
  {to:'/staff', label:'Staff & Access', icon:'users', permission:'accounts.approve'},
  {to:'/branches', label:'Branches', icon:'branches', permission:'branches.view'},
  {to:'/doctors', label:'Doctors', icon:'doctor', permission:'doctors.view'},
  {to:'/appointments', label:'Appointments', icon:'calendar', permission:'appointments.view'},
  {to:'/services', label:'Services', icon:'services', permission:'services.view'},
  {to:'/requests', label:'Service Requests', icon:'requests', permission:'requests.view'},
  {to:'/notifications', label:'Notifications', icon:'bell', permission:'notifications.view'},
  {to:'/readiness', label:'System Readiness', icon:'health', permission:'system.readiness.view'},
];

export function hasCode(provider: ProviderContext | null, code?: string) {
  if (!code) return true;
  return new Set(provider?.permissions ?? []).has(code);
}

export function canSeeNav(provider: ProviderContext | null, item: NavDef) {
  if (!provider) return false;
  const role = provider.role;
  if (item.roles && !item.roles.includes(role)) return false;
  if (item.permission && !hasCode(provider,item.permission)) return false;
  return true;
}

export type QuickAction = { label:string; to:string; icon:string; permission?:string; roles?:string[]; tone?:string };

export const QUICK_ACTIONS: QuickAction[] = [
  {label:'Staff & Access',to:'/staff',icon:'users',permission:'accounts.approve',tone:'mint'},
  {label:'Appointments',to:'/appointments',icon:'calendar',permission:'appointments.view',tone:'blue'},
  {label:'Doctors',to:'/doctors',icon:'doctor',permission:'doctors.view',tone:'violet'},
  {label:'Branches',to:'/branches',icon:'branches',permission:'branches.view',tone:'mint'},
  {label:'Service Requests',to:'/requests',icon:'requests',permission:'requests.view',tone:'orange'},
  {label:'Services',to:'/services',icon:'services',permission:'services.view',tone:'rose'},
  {label:'Notifications',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'},
  {label:'HR & Leave',to:'/hr',icon:'hr',roles:['hr','owner','admin'],tone:'blue'},
];

export function actionsFor(provider: ProviderContext | null) {
  return QUICK_ACTIONS.filter(a => {
    if (!provider) return false;
    if (a.roles && !a.roles.includes(provider.role)) return false;
    if (a.permission && !hasCode(provider,a.permission)) return false;
    return true;
  });
}
