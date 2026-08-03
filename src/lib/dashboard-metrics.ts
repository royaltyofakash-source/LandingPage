import type { SpreadsheetRow } from "@/hooks/useSpreadsheetData";

/**
 * Every figure surfaced on the dashboard is derived here from the raw
 * spreadsheet rows. Nothing in this file is hardcoded or sampled — if a value
 * is missing in the sheet it is simply excluded from the aggregate.
 */

export interface NamedCount {
  name: string;
  value: number;
}

export interface RevenuePoint {
  key: string;
  label: string;
  revenue: number;
  deals: number;
}

export interface LeadPoint {
  key: string;
  label: string;
  leads: number;
  bookedCalls: number;
}

export interface ChannelPerformance {
  name: string;
  leads: number;
  bookedCalls: number;
  closed: number;
  revenue: number;
}

export interface DashboardMetrics {
  totalLeads: number;
  totalRevenue: number;
  bookedCalls: number;
  closedDeals: number;
  payingCustomers: number;
  leadsInCrm: number;
  avgLeadScore: number | null;
  scoredLeads: number;
  bookingRate: number;
  closeRate: number;
  avgDealSize: number;
  revenuePerLead: number;
  leadsByDay: LeadPoint[];
  revenueByMonth: RevenuePoint[];
  trafficSources: NamedCount[];
  placements: NamedCount[];
  gradeDistribution: NamedCount[];
  pipelineStages: NamedCount[];
  programTypes: { name: string; deals: number; revenue: number }[];
  paymentTypes: NamedCount[];
  topCampaigns: NamedCount[];
  campaignPerformance: ChannelPerformance[];
  sourcePerformance: ChannelPerformance[];
  firstLeadDate: string | null;
  lastLeadDate: string | null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses "1,234.50" / "$1,234.50" / "" into a number, defaulting to 0. */
export function parseAmount(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

/** Sheet timestamps look like "2026-05-14 00:52:41+00:00" — we only need the date part. */
export function isoDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? match[0] : null;
}

function isYes(raw: string | undefined): boolean {
  return (raw ?? "").trim().toLowerCase() === "yes";
}

function dayLabel(key: string): string {
  const [, month = "", day = ""] = key.split("-");
  return `${MONTHS[Number(month) - 1] ?? month} ${Number(day)}`;
}

function monthLabel(key: string): string {
  const [year = "", month = ""] = key.split("-");
  return `${MONTHS[Number(month) - 1] ?? month} ${year.slice(2)}`;
}

/** ig / instagram / IG all refer to the same channel in the sheet. */
function sourceLabel(raw: string): string {
  const value = raw.trim().toLowerCase();
  if (!value) return "Direct / Unknown";
  if (value === "ig" || value === "instagram") return "Instagram";
  if (value === "fb" || value === "facebook") return "Facebook";
  if (value === "email" || value === "newsletter") return "Email";
  return raw.trim().replace(/^\w/, (c) => c.toUpperCase());
}

function toSortedCounts(counts: Map<string, number>, limit?: number): NamedCount[] {
  const list = [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  return limit ? list.slice(0, limit) : list;
}

function bump(map: Map<string, number>, key: string, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

export function computeDashboardMetrics(rows: SpreadsheetRow[] | undefined): DashboardMetrics {
  const empty: DashboardMetrics = {
    totalLeads: 0,
    totalRevenue: 0,
    bookedCalls: 0,
    closedDeals: 0,
    payingCustomers: 0,
    leadsInCrm: 0,
    avgLeadScore: null,
    scoredLeads: 0,
    bookingRate: 0,
    closeRate: 0,
    avgDealSize: 0,
    revenuePerLead: 0,
    leadsByDay: [],
    revenueByMonth: [],
    trafficSources: [],
    placements: [],
    gradeDistribution: [],
    pipelineStages: [],
    programTypes: [],
    paymentTypes: [],
    topCampaigns: [],
    campaignPerformance: [],
    sourcePerformance: [],
    firstLeadDate: null,
    lastLeadDate: null,
  };

  if (!rows || rows.length === 0) return empty;

  let totalRevenue = 0;
  let bookedCalls = 0;
  let closedDeals = 0;
  let payingCustomers = 0;
  let leadsInCrm = 0;
  let scoreSum = 0;
  let scoredLeads = 0;

  const leadsPerDay = new Map<string, number>();
  const callsPerDay = new Map<string, number>();
  const revenuePerMonth = new Map<string, number>();
  const dealsPerMonth = new Map<string, number>();
  const sources = new Map<string, number>();
  const placements = new Map<string, number>();
  const grades = new Map<string, number>();
  const stages = new Map<string, number>();
  const programDeals = new Map<string, number>();
  const programRevenue = new Map<string, number>();
  const payments = new Map<string, number>();
  const campaigns = new Map<string, number>();
  const byCampaign = new Map<string, ChannelPerformance>();
  const bySource = new Map<string, ChannelPerformance>();

  const track = (
    map: Map<string, ChannelPerformance>,
    name: string,
    booked: boolean,
    closed: boolean,
    cash: number,
  ) => {
    const entry = map.get(name) ?? { name, leads: 0, bookedCalls: 0, closed: 0, revenue: 0 };
    entry.leads++;
    if (booked) entry.bookedCalls++;
    if (closed) entry.closed++;
    entry.revenue += cash;
    map.set(name, entry);
  };

  for (const row of rows) {
    const cash = parseAmount(row["Cash_Collected_USD"]);
    const booked = isYes(row["Close_Booked_Call"]);
    const closed = isYes(row["Close_Closed"]);

    totalRevenue += cash;
    if (booked) bookedCalls++;
    if (closed) closedDeals++;
    if (cash > 0) payingCustomers++;
    if (isYes(row["Close_In_CRM"])) leadsInCrm++;

    const score = parseFloat((row["Lead Score"] ?? "").trim());
    if (Number.isFinite(score)) {
      scoreSum += score;
      scoredLeads++;
    }

    const capturedOn = isoDate(row["Date Captured"]);
    if (capturedOn) {
      bump(leadsPerDay, capturedOn);
      if (booked) bump(callsPerDay, capturedOn);
    }

    if (cash > 0) {
      const closedOn = isoDate(row["Close_Date_Created"]) ?? capturedOn;
      if (closedOn) {
        const month = closedOn.slice(0, 7);
        bump(revenuePerMonth, month, cash);
        bump(dealsPerMonth, month);
      }
    }

    const source = sourceLabel(row["UTM Source"] ?? "");
    bump(sources, source);
    track(bySource, source, booked, closed, cash);

    const medium = (row["UTM Medium"] ?? "").trim();
    if (medium) bump(placements, medium.replace(/_/g, " "));

    const grade = (row["Lead Grade"] ?? "").trim().toUpperCase();
    if (grade) bump(grades, grade);

    const stage = (row["Close_Opportunity_Stage"] ?? "").trim();
    if (stage) bump(stages, stage);

    const program = (row["Program_Type"] ?? "").trim();
    if (program) {
      bump(programDeals, program);
      bump(programRevenue, program, cash);
    }

    const payment = (row["Payment_Type"] ?? "").trim();
    if (payment) bump(payments, payment);

    const campaign = (row["UTM Campaign"] ?? "").trim();
    if (campaign) {
      bump(campaigns, campaign);
      track(byCampaign, campaign, booked, closed, cash);
    }
  }

  const leadDays = [...leadsPerDay.keys()].sort();
  const leadsByDay: LeadPoint[] = leadDays.map((key) => ({
    key,
    label: dayLabel(key),
    leads: leadsPerDay.get(key) ?? 0,
    bookedCalls: callsPerDay.get(key) ?? 0,
  }));

  const revenueByMonth: RevenuePoint[] = [...revenuePerMonth.keys()].sort().map((key) => ({
    key,
    label: monthLabel(key),
    revenue: revenuePerMonth.get(key) ?? 0,
    deals: dealsPerMonth.get(key) ?? 0,
  }));

  const programTypes = [...programDeals.keys()]
    .map((name) => ({
      name,
      deals: programDeals.get(name) ?? 0,
      revenue: programRevenue.get(name) ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const totalLeads = rows.length;

  return {
    totalLeads,
    totalRevenue,
    bookedCalls,
    closedDeals,
    payingCustomers,
    leadsInCrm,
    avgLeadScore: scoredLeads > 0 ? scoreSum / scoredLeads : null,
    scoredLeads,
    bookingRate: totalLeads > 0 ? (bookedCalls / totalLeads) * 100 : 0,
    closeRate: bookedCalls > 0 ? (closedDeals / bookedCalls) * 100 : 0,
    avgDealSize: payingCustomers > 0 ? totalRevenue / payingCustomers : 0,
    revenuePerLead: totalLeads > 0 ? totalRevenue / totalLeads : 0,
    leadsByDay,
    revenueByMonth,
    trafficSources: toSortedCounts(sources),
    placements: toSortedCounts(placements, 6),
    gradeDistribution: [...grades.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    pipelineStages: toSortedCounts(stages, 6),
    programTypes,
    paymentTypes: toSortedCounts(payments),
    topCampaigns: toSortedCounts(campaigns, 5),
    campaignPerformance: [...byCampaign.values()]
      .sort((a, b) => b.revenue - a.revenue || b.leads - a.leads)
      .slice(0, 8),
    sourcePerformance: [...bySource.values()].sort(
      (a, b) => b.revenue - a.revenue || b.leads - a.leads,
    ),
    firstLeadDate: leadDays[0] ?? null,
    lastLeadDate: leadDays[leadDays.length - 1] ?? null,
  };
}

export function formatCurrency(value: number, fractionDigits = 0): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatDateRange(from: string | null, to: string | null): string {
  if (!from || !to) return "No dated leads in the sheet";
  return `${dayLabel(from)} – ${dayLabel(to)}, ${to.slice(0, 4)}`;
}
