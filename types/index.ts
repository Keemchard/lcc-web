import { Timestamp } from "firebase-admin/firestore";

export type UserRole = "pending" | "admin" | "supreme_admin";

export type UserDoc = {
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  approvedBy?: string;
};

export type CarouselSlideDoc = {
  imageUrl: string;
  imagePath: string;
  title: string;
  details: string;
  time: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
};

export type ServiceTimeDoc = {
  imageUrl: string;
  imagePath: string;
  title: string;
  time: string;
  location: string;
  speaker: string;
  ctaLabel: string;
  ctaHref?: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
};

export type ChangeHistoryDoc = {
  entityType: "carouselSlide" | "serviceTime";
  entityId: string;
  entityTitle: string;
  action: "create" | "update" | "delete";
  changes?: Record<string, { before: unknown; after: unknown }>;
  performedBy: string;
  performedByEmail: string;
  performedAt: Timestamp;
};

export type SerializedCarouselSlide = {
  id: string;
  imageUrl: string;
  title: string;
  details: string;
  time: string;
  order: number;
};

export type SerializedServiceTime = {
  id: string;
  imageUrl: string;
  title: string;
  time: string;
  location: string;
  speaker: string;
  ctaLabel: string;
  ctaHref?: string;
  order: number;
};

export type AdminUser = {
  uid: string;
  email: string;
  role: UserRole;
};
