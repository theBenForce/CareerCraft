// Activity Types for Career Craft
export const ACTIVITY_TYPES = {
  EMAIL: "EMAIL",
  PHONE_CALL: "PHONE_CALL",
  MEETING: "MEETING",
  INTERVIEW: "INTERVIEW",
  NETWORKING_EVENT: "NETWORKING_EVENT",
  COFFEE_CHAT: "COFFEE_CHAT",
  FOLLOW_UP: "FOLLOW_UP",
  APPLICATION: "APPLICATION",
  REFERRAL: "REFERRAL",
  LINKEDIN_MESSAGE: "LINKEDIN_MESSAGE",
  NOTE: "NOTE",
  RESEARCH: "RESEARCH",
  OTHER: "OTHER",
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ACTIVITY_TYPES.EMAIL]: "Email",
  [ACTIVITY_TYPES.PHONE_CALL]: "Phone Call",
  [ACTIVITY_TYPES.MEETING]: "Meeting",
  [ACTIVITY_TYPES.INTERVIEW]: "Interview",
  [ACTIVITY_TYPES.NETWORKING_EVENT]: "Networking Event",
  [ACTIVITY_TYPES.COFFEE_CHAT]: "Coffee Chat",
  [ACTIVITY_TYPES.FOLLOW_UP]: "Follow Up",
  [ACTIVITY_TYPES.APPLICATION]: "Application",
  [ACTIVITY_TYPES.REFERRAL]: "Referral",
  [ACTIVITY_TYPES.LINKEDIN_MESSAGE]: "LinkedIn Message",
  [ACTIVITY_TYPES.NOTE]: "Note",
  [ACTIVITY_TYPES.RESEARCH]: "Research",
  [ACTIVITY_TYPES.OTHER]: "Other",
};

export const ACTIVITY_TYPE_OPTIONS = Object.entries(ACTIVITY_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
