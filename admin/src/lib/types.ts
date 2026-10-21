export type Period = 'day' | 'week' | 'month';

/** One period of the traffic chart. `bucket` is the period's local start time, e.g. "2026-10-21T00:00:00". */
export type TrafficPoint = { bucket: string; visits: number; visitors: number; enquiries: number };

export type Dimension = 'country' | 'device' | 'source' | 'section';
export type BreakdownRow = { dimension: Dimension; label: string; total: number };

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  phone_country: string | null;
  company: string | null;
  country: string | null;
  interests: string[];
  message: string;
  page: string | null;
  status: EnquiryStatus;
  notes: string | null;
  ip_country: string | null;
  email_sent: boolean;
  is_test: boolean;
};

export type EnquiryPatch = Partial<Pick<Enquiry, 'status' | 'notes'>>;

/** Where the panel's data comes from: the live database, or built-in sample data (demo mode). */
export interface Backend {
  mode: 'live' | 'demo';
  traffic(period: Period, periods: number, includeTest: boolean): Promise<TrafficPoint[]>;
  breakdown(period: Period, periods: number, includeTest: boolean): Promise<BreakdownRow[]>;
  enquiries(includeTest: boolean): Promise<Enquiry[]>;
  updateEnquiry(id: string, patch: EnquiryPatch): Promise<void>;
}

/** How each Daily / Weekly / Monthly view is shown. */
export const periodViews: Record<Period, { tab: string; periods: number; current: string; previous: string; range: string; per: string }> = {
  day: { tab: 'Daily', periods: 30, current: 'Today', previous: 'Yesterday', range: 'Last 30 days', per: 'per day' },
  week: { tab: 'Weekly', periods: 12, current: 'This week', previous: 'Last week', range: 'Last 12 weeks', per: 'per week' },
  month: { tab: 'Monthly', periods: 12, current: 'This month', previous: 'Last month', range: 'Last 12 months', per: 'per month' },
};
