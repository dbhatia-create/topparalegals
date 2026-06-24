export interface Service {
  id: string;
  label: string;
  description: string;
  specialties: string[];
}

export const services: Service[] = [
  { id: "litigation", label: "Litigation Support", description: "Discovery, case management, and trial preparation assistance", specialties: ["Discovery Assistance", "Document Review", "Trial Preparation", "Case Management", "Legal Research"] },
  { id: "document", label: "Document Preparation", description: "Legal document drafting and preparation services", specialties: ["Contract Drafting", "Motion Drafting", "Pleadings", "Legal Forms", "Document Review"] },
  { id: "family", label: "Family Law Support", description: "Paralegal support for family law matters", specialties: ["Divorce Proceedings", "Child Custody", "Adoption", "Guardianship", "Domestic Relations"] },
  { id: "immigration", label: "Immigration Support", description: "Immigration document preparation and filing assistance", specialties: ["Visa Applications", "Green Card Processing", "Citizenship Applications", "Deportation Defense Support", "DACA Applications"] },
  { id: "estate", label: "Estate Planning Support", description: "Wills, trusts, and probate document preparation", specialties: ["Will Drafting", "Trust Documents", "Probate Support", "Power of Attorney", "Healthcare Directives"] },
  { id: "real-estate", label: "Real Estate Law Support", description: "Real estate transaction and closing document preparation", specialties: ["Closing Documents", "Title Review", "Lease Agreements", "Purchase Agreements", "HOA Documents"] },
  { id: "corporate", label: "Corporate Law Support", description: "Business formation, compliance, and contract support", specialties: ["Business Formation", "Operating Agreements", "Corporate Minutes", "Contract Review", "Compliance Documents"] },
  { id: "personal-injury", label: "Personal Injury Support", description: "Client intake, medical records management, and case support", specialties: ["Client Intake", "Medical Records Management", "Demand Letters", "Settlement Documents", "Insurance Claims"] },
  { id: "bankruptcy", label: "Bankruptcy Support", description: "Chapter 7, Chapter 13, and related filings", specialties: ["Chapter 7 Filings", "Chapter 13 Filings", "Means Test", "Creditor Negotiations", "Debt Schedule Preparation"] },
  { id: "remote", label: "Remote Paralegal Services", description: "Virtual and remote legal support for law firms nationwide", specialties: ["Remote Document Preparation", "Virtual Case Management", "Online Legal Research", "Cloud-Based Filing", "Remote Client Support"] },
];

export const allServiceIds: string[] = services.map((s) => s.id);
export const allServiceLabels: string[] = services.map((s) => s.label);
