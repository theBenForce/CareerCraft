import {
  Contact,
  Company,
  Activity,
  Tag,
  JobApplication,
} from "@prisma/client";

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

// Extended types with tags and relations included
export interface ContactWithTags extends Contact {
  tags: Tag[];
}

export interface CompanyWithTags extends Company {
  tags: Tag[];
}

export interface ActivityWithTags extends Activity {
  tags: Tag[];
  company?: Company | null;
  jobApplication?: JobApplication | null;
  contacts?: Contact[];
}
