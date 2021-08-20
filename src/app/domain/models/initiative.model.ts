export interface Initiative {
  id: number;
  initiatorEmail: string;
  category: string;
  title: string;
  description: string;
  scheduledFor: string;
  eventType: string;
  location: string;
  participantEmails: string[];
}
