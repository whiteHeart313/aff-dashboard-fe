export interface Offer {
  id: number;
  offerId: string;
  offerName: string;
  landingPage: string;
  mobileOperator: string;
  payout: number;
  offerAvailability: 'active' | 'inactive' | 'pending';
  landingPageLanguage: string;
  payoutModel: 'CPA' | 'CPL' | 'CPI' | 'CPC';
  flow: string;
  connectionType: 'wifi' | 'mobile' | 'both';
  restriction: string;
  createdAt: string;
  updatedAt: string;
}