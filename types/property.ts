export type AssetCondition = "Good" | "Fair" | "Needs Repair" | "Condemned";

export type AssetCategory =
  | "Furniture"
  | "Electronics"
  | "Kitchen"
  | "Musical Instruments"
  | "Office"
  | "Building"
  | "Sound System"
  | "Cleaning"
  | "Other";

export const ASSET_CATEGORIES: AssetCategory[] = [
  "Furniture",
  "Electronics",
  "Kitchen",
  "Musical Instruments",
  "Office",
  "Building",
  "Sound System",
  "Cleaning",
  "Other",
];

export const ASSET_CONDITIONS: AssetCondition[] = [
  "Good",
  "Fair",
  "Needs Repair",
  "Condemned",
];

export const ASSET_LOCATIONS = [
  "Worship Hall",
  "Kitchen",
  "Office",
  "Storage Room",
  "Entrance",
  "Restroom",
  "Outdoor",
  "Other",
];

export type MaintenanceEntry = {
  date: string;
  description: string;
  cost: number;
  performedBy: string;
};

export type AssetItem = {
  id?: string;
  name: string;
  category: AssetCategory;
  quantity: number;
  condition: AssetCondition;
  location: string;
  dateAcquired: string;
  acquisitionType: "Purchased" | "Donated";
  value: number;
  notes: string;
  maintenanceHistory: MaintenanceEntry[];
};

export type AssetItemDoc = AssetItem & {
  createdAt: unknown;
  updatedAt: unknown;
  createdBy: string;
};

export type BorrowStatus = "Borrowed" | "Returned";

export type BorrowRecord = {
  id?: string;
  assetId: string;
  assetName: string;
  borrower: string;
  purpose: string;
  dateOut: string;
  dateReturned: string;
  status: BorrowStatus;
};

export type BorrowRecordDoc = BorrowRecord & {
  createdAt: unknown;
  updatedAt: unknown;
  createdBy: string;
};
