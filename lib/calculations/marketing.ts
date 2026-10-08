import type { MarketingCampaign } from "../../types/dashboard";

const percentage = (value: number, total: number) => total > 0 ? value / total * 100 : 0;
const ratio = (value: number, total: number) => total > 0 ? value / total : 0;

export function campaignDuration(campaign: MarketingCampaign, referenceDate = new Date()) {
  const start = new Date(`${campaign.startDate}T12:00:00`);
  const end = campaign.endDate ? new Date(`${campaign.endDate}T12:00:00`) : referenceDate;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1);
}

export function calculateMarketingSummary(campaigns: MarketingCampaign[]) {
  const investment = campaigns.reduce((sum, item) => sum + item.investment, 0);
  const impressions = campaigns.reduce((sum, item) => sum + item.impressions, 0);
  const clicks = campaigns.reduce((sum, item) => sum + item.clicks, 0);
  const leads = campaigns.reduce((sum, item) => sum + item.leads, 0);
  const conversions = campaigns.reduce((sum, item) => sum + item.conversions, 0);
  const revenue = campaigns.reduce((sum, item) => sum + item.attributedRevenue, 0);
  return { investment, impressions, clicks, leads, conversions, revenue, ctr: percentage(clicks, impressions), conversionRate: percentage(conversions, leads), costPerLead: ratio(investment, leads), acquisitionCost: ratio(investment, conversions), roi: percentage(revenue - investment, investment) };
}
