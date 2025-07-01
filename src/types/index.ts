export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  description?: string;
  location?: string;
  size?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Contact {
  id: string;
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
  userId: string;
  companyId?: string;
  company?: Company;
}

export interface JobApplication {
  id: string;
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
  userId: string;
  companyId: string;
  company?: Company;
}

export interface Activity {
  id: string;
  type: string;
  subject: string;
  description?: string;
  date: Date;
  duration?: number;
  outcome?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  companyId?: string;
  contactId?: string;
  jobApplicationId?: string;
  company?: Company;
  contact?: Contact;
  jobApplication?: JobApplication;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
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
  id: string;
  name: string;
  color?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ContactTag {
  id: string;
  contactId: string;
  tagId: string;
  createdAt: Date;
  contact: Contact;
  tag: Tag;
}

export interface CompanyTag {
  id: string;
  companyId: string;
  tagId: string;
  createdAt: Date;
  company: Company;
  tag: Tag;
}

export interface ActivityTag {
  id: string;
  activityId: string;
  tagId: string;
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
