export interface NotificationResponse {
  notificationId: string;
  type: string;
  title: string;
  description: string;
  seen: boolean;
  notifierFullName: string;
  notifierUserId: string;
  contactId: string;
  url: string;
  createdAt: Date;
}
