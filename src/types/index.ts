export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  description?: string;
  location?: string;
  size?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  linkedinUrl?: string;
  summary?: string;
  notes?: string;
  lastContactDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  companyId?: number;
  company?: Company;
}

export interface JobApplication {
  id: number;
  position: string;
  status: string;
  priority: string;
  jobDescription?: string;
  salary?: string;
  appliedDate: Date;
  responseDate?: Date;
  interviewDate?: Date;
  offerDate?: Date;
  notes?: string;
  jobUrl?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  companyId: number;
  company: Company;
}

export interface Activity {
  id: number;
  type: string;
  subject: string;
  description?: string;
  date: Date;
  duration?: number;
  outcome?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  companyId?: number;
  contactId?: number;
  jobApplicationId?: number;
  company?: Company;
  contact?: Contact;
  jobApplication?: JobApplication;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export type JobStatus =
  | "applied"
  | "interview_scheduled"
  | "interviewed"
  | "offer"
  | "rejected"
  | "accepted";

export type Priority = "low" | "medium" | "high";

export type ActivityType =
  | "email"
  | "call"
  | "meeting"
  | "application"
  | "interview"
  | "note";

export interface Tag {
  id: number;
  name: string;
  color?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface ContactTag {
  id: number;
  contactId: number;
  tagId: number;
  createdAt: Date;
  contact: Contact;
  tag: Tag;
}

export interface CompanyTag {
  id: number;
  companyId: number;
  tagId: number;
  createdAt: Date;
  company: Company;
  tag: Tag;
}

export interface ActivityTag {
  id: number;
  activityId: number;
  tagId: number;
  createdAt: Date;
  activity: Activity;
  tag: Tag;
}

// Extended types with tags included
export interface ContactWithTags extends Contact {
  contactTags: ContactTag[];
}

export interface CompanyWithTags extends Company {
  companyTags: CompanyTag[];
}

export interface ActivityWithTags extends Activity {
  activityTags: ActivityTag[];
}
