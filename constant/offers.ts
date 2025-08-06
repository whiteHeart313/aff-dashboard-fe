import { Offer } from '@/types/offers';

export const OFFER_DATA: Offer[] = [
  {
    id: 1,
    offerId: 'OFF-001',
    offerName: 'Gaming App Install',
    landingPage: 'https://game-install.com',
    mobileOperator: 'Vodafone',
    payout: 5.50,
    offerAvailability: 'active',
    landingPageLanguage: 'English',
    payoutModel: 'CPI',
    flow: 'Direct Flow',
    connectionType: 'wifi',
    restriction: 'Age 18+',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    offerId: 'OFF-002',
    offerName: 'Survey Completion',
    landingPage: 'https://survey-platform.com',
    mobileOperator: 'T-Mobile',
    payout: 2.25,
    offerAvailability: 'active',
    landingPageLanguage: 'Spanish',
    payoutModel: 'CPL',
    flow: 'SMS Flow',
    connectionType: 'mobile',
    restriction: 'US Only',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14'
  },
  {
    id: 3,
    offerId: 'OFF-003',
    offerName: 'E-commerce Sign Up',
    landingPage: 'https://shop-signup.com',
    mobileOperator: 'AT&T',
    payout: 3.75,
    offerAvailability: 'pending',
    landingPageLanguage: 'French',
    payoutModel: 'CPA',
    flow: 'Email Flow',
    connectionType: 'both',
    restriction: 'EU Only',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12'
  },
  {
    id: 4,
    offerId: 'OFF-004',
    offerName: 'News Subscription',
    landingPage: 'https://news-sub.com',
    mobileOperator: 'Verizon',
    payout: 1.50,
    offerAvailability: 'inactive',
    landingPageLanguage: 'German',
    payoutModel: 'CPC',
    flow: 'PIN Flow',
    connectionType: 'wifi',
    restriction: 'No restrictions',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10'
  },
  {
    id: 5,
    offerId: 'OFF-005',
    offerName: 'Fitness App Trial',
    landingPage: 'https://fitness-trial.com',
    mobileOperator: 'Orange',
    payout: 4.25,
    offerAvailability: 'active',
    landingPageLanguage: 'Italian',
    payoutModel: 'CPI',
    flow: 'App Store Flow',
    connectionType: 'both',
    restriction: 'iOS Only',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08'
  }
];

export const PAYOUT_MODELS = ['CPA', 'CPL', 'CPI', 'CPC'] as const;
export const CONNECTION_TYPES = ['wifi', 'mobile', 'both'] as const;
export const OFFER_STATUSES = ['active', 'inactive', 'pending'] as const;