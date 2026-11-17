export type BudgetLineItem = {
  label: string;
  amount: number;
  remarks: string;
};

export type BudgetSection = {
  section: string;
  items: BudgetLineItem[];
};

export type AnnualBudget = {
  id?: string;
  year: number;
  sections: BudgetSection[];
  notes: string;
};

export type AnnualBudgetDoc = AnnualBudget & {
  createdAt: unknown;
  updatedAt: unknown;
  createdBy: string;
};

export const DEFAULT_BUDGET_SECTIONS: BudgetSection[] = [
  {
    section: "Fellowship Coordinator",
    items: [
      { label: "Couples' Fellowship", amount: 0, remarks: "" },
      { label: "Women's Fellowship", amount: 0, remarks: "" },
      { label: "Men's Fellowship", amount: 0, remarks: "" },
      { label: "Youth Fellowship", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Training Director",
    items: [
      { label: "Leadership Training", amount: 0, remarks: "" },
      { label: "Worship Leading Training", amount: 0, remarks: "" },
      { label: "Ministry Roles Seminar", amount: 0, remarks: "" },
      { label: "Training Materials", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Sunday School Director",
    items: [
      { label: "Sunday School Materials", amount: 0, remarks: "" },
      { label: "Children's Activities", amount: 0, remarks: "" },
      { label: "DVBS", amount: 0, remarks: "" },
      { label: "Teacher's Allowance", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Program Coordinator",
    items: [
      { label: "Anniversary Celebration", amount: 0, remarks: "" },
      { label: "Christmas Program", amount: 0, remarks: "" },
      { label: "Easter / Holy Week", amount: 0, remarks: "" },
      { label: "Mother & Father's Day", amount: 0, remarks: "" },
      { label: "Special Events", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Membership Coordinator",
    items: [
      { label: "New Members Kit", amount: 0, remarks: "" },
      { label: "Water Baptism", amount: 0, remarks: "" },
      { label: "Member Appreciation", amount: 0, remarks: "" },
      { label: "Pastoral Care", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Property Custodian",
    items: [
      { label: "Building Maintenance", amount: 0, remarks: "" },
      { label: "Cleaning Materials", amount: 0, remarks: "" },
      { label: "Kitchen Supplies", amount: 0, remarks: "" },
      { label: "Electricity", amount: 0, remarks: "" },
      { label: "Water", amount: 0, remarks: "" },
      { label: "Internet", amount: 0, remarks: "" },
      { label: "Equipment Repair", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Finance / Administration",
    items: [
      { label: "Pastors' Allowance", amount: 0, remarks: "" },
      { label: "Staff Allowance", amount: 0, remarks: "" },
      { label: "SSS / PHIC", amount: 0, remarks: "" },
      { label: "Office Supplies", amount: 0, remarks: "" },
      { label: "CMF Dues", amount: 0, remarks: "" },
      { label: "Miscellaneous", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Mission and Evangelism",
    items: [
      { label: "Outreach Bible Study", amount: 0, remarks: "" },
      { label: "Libreng Almusal", amount: 0, remarks: "" },
      { label: "Kids Ministry", amount: 0, remarks: "" },
      { label: "Prayer Rally", amount: 0, remarks: "" },
    ],
  },
  {
    section: "Church Building",
    items: [
      { label: "Materials", amount: 0, remarks: "" },
      { label: "Labor", amount: 0, remarks: "" },
      { label: "Pantry Expenses", amount: 0, remarks: "" },
    ],
  },
];

export function computeBudgetTotals(budget: AnnualBudget) {
  const sectionTotals = budget.sections.map((s) => ({
    section: s.section,
    total: s.items.reduce((sum, i) => sum + i.amount, 0),
  }));
  const grandTotal = sectionTotals.reduce((sum, s) => sum + s.total, 0);
  return { sectionTotals, grandTotal };
}
