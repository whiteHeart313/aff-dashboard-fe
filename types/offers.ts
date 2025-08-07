export interface Offer {
  id?: number;
  offerId: string;
  offerName: string;
  landingPage: string;
  mobileOperator: string;
  payout: string; // Changed to string to match API response like "$15 per qualified lead"
  offerAvailability: string; // Changed to string to handle "Active" vs "active"
  landingPageLanguage?: string;
  LandingPageLanguage?: string; // Added to handle API case sensitivity
  payoutModel: 'CPA' | 'CPL' | 'CPI' | 'CPC';
  flow: string;
  connectionType: string; // Changed to string to handle "Any" and other values
  restriction: string;
  createdAt?: string;
  updatedAt?: string;
}
