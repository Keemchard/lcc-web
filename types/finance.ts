export type ReportType = "receipts" | "building";

export type IncomeEntry = {
  date: string;
  amount: number;
};

export type AdditionalIncome = {
  label: string;
  amount: number;
};

export type DisbursementItem = {
  label: string;
  amount: number;
};

export type DisbursementCategory = {
  category: string;
  items: DisbursementItem[];
};

export type Signatory = {
  name: string;
  title: string;
};

export type FinanceReport = {
  id?: string;
  type: ReportType;
  month: number;
  year: number;
  balanceForwarded: number;
  incomeEntries: IncomeEntry[];
  additionalIncome: AdditionalIncome[];
  disbursements: DisbursementCategory[];
  preparedBy: Signatory;
  attestedBy: Signatory;
};

export type FinanceReportDoc = FinanceReport & {
  createdAt: unknown;
  updatedAt: unknown;
  createdBy: string;
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DEFAULT_RECEIPTS_CATEGORIES: DisbursementCategory[] = [
  {
    category: "Finance / Administration",
    items: [
      { label: "Pastors / Allowances / Honorarium / Love Gift", amount: 0 },
      { label: "Custodian Allowance", amount: 0 },
      { label: "Secretary Allowance", amount: 0 },
      { label: "Music Team Allowance", amount: 0 },
      { label: "Bible School Mission Savings", amount: 0 },
      { label: "Medical Assistance", amount: 0 },
      { label: "Bereavement Assistance", amount: 0 },
      { label: "Lunch Council Meeting / Election", amount: 0 },
      { label: "SSS / PHIC", amount: 0 },
      { label: "Funeral / Flowers", amount: 0 },
      { label: "Office Supplies", amount: 0 },
      { label: "Kalinga Mangagawa Dues (2 Pastors)", amount: 0 },
      { label: "CMF Dues (District / D4)", amount: 0 },
      { label: "CMF Dues (National / Regional)", amount: 0 },
      { label: "Tax Declaration Processing / Building Permit", amount: 0 },
      { label: "Tax Declaration Professional Fee / Liaison Fee", amount: 0 },
    ],
  },
  {
    category: "Ministry - Christian Education",
    items: [
      { label: "Transportation - Kids", amount: 0 },
      { label: "Music - Worship", amount: 0 },
      { label: "Music Instrument Repair - Speaker", amount: 0 },
    ],
  },
  {
    category: "Ministry - Fellowship",
    items: [
      { label: "Women's Fellowship", amount: 0 },
      { label: "Men's Fellowship", amount: 0 },
      { label: "Youth Fellowship", amount: 0 },
    ],
  },
  {
    category: "Ministry - Mission and Evangelism",
    items: [
      { label: "Kids Fellowship", amount: 0 },
      { label: "Children Film Showing (Food)", amount: 0 },
    ],
  },
  {
    category: "Ministry - Membership",
    items: [
      { label: "Teacher's Day Appreciation Gift", amount: 0 },
      { label: "Pastor's Day Appreciation (Food and Cake)", amount: 0 },
      { label: "Church Worker Appreciation", amount: 0 },
    ],
  },
  {
    category: "Ministry - Trustees",
    items: [
      { label: "Church Building Maintenance", amount: 0 },
      { label: "Other Church Accessories", amount: 0 },
      { label: "Kitchen Accessories", amount: 0 },
      { label: "Refreshment", amount: 0 },
      { label: "Cleaning Materials", amount: 0 },
      { label: "Disposables", amount: 0 },
      { label: "Lord's Table Wine / Bread (Welch)", amount: 0 },
      { label: "Rice - 25kg", amount: 0 },
      { label: "Electricity", amount: 0 },
      { label: "TWD", amount: 0 },
      { label: "Potable Water", amount: 0 },
      { label: "Internet", amount: 0 },
    ],
  },
  {
    category: "Ministry - Training",
    items: [
      { label: "Worship Leading Training Office Supplies", amount: 0 },
      { label: "Worship Leading Training Food", amount: 0 },
      { label: "Ministry Roles and Responsibilities Seminar", amount: 0 },
    ],
  },
];

export const DEFAULT_BUILDING_CATEGORIES: DisbursementCategory[] = [
  {
    category: "Cash Disbursement",
    items: [
      { label: "Pantry Expenses", amount: 0 },
      { label: "Total Materials", amount: 0 },
      { label: "Total Labor", amount: 0 },
    ],
  },
];

export const DEFAULT_RECEIPTS_ADDITIONAL: AdditionalIncome[] = [
  { label: "D4 Electricity Share", amount: 0 },
];

export function computeTotals(report: FinanceReport) {
  const totalIncome = report.incomeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalAdditional = report.additionalIncome.reduce((sum, e) => sum + e.amount, 0);
  const totalCashAvailable = report.balanceForwarded + totalIncome + totalAdditional;

  const categoryTotals = report.disbursements.map((cat) => ({
    category: cat.category,
    total: cat.items.reduce((sum, item) => sum + item.amount, 0),
  }));

  const totalExpenses = categoryTotals.reduce((sum, c) => sum + c.total, 0);
  const balanceToForward = totalCashAvailable - totalExpenses;

  return {
    totalIncome,
    totalAdditional,
    totalCashAvailable,
    categoryTotals,
    totalExpenses,
    balanceToForward,
  };
}
