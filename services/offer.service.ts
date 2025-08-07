import { Offer } from '@/types/offers';

export interface OfferFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payoutModel?: string;
  mobileOperator?: string;
}

export interface OfferResponse {
  success: boolean;
  message: string;
  data: {
    offers: Offer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class OfferService {
  private baseUrl = '/api/offers';

  async getOffers(filters: OfferFilters = {}): Promise<OfferResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.payoutModel) params.append('payoutModel', filters.payoutModel);
    if (filters.mobileOperator) params.append('mobileOperator', filters.mobileOperator);

    const response = await fetch(`${this.baseUrl}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch offers');
    }
    console.log('Offers fetched successfully:', await response.json());
    return {
      success: true,
      message: 'Offers retrieved successfully',
      data: {
        offers: await response.json(),
        pagination: {
          page: 0,
          limit: 0,
          total: 0,
          totalPages: 0
        }
      },
    }
  }

  async getOfferById(id: string): Promise<Offer> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch offer');
    }
    
    const data = await response.json();
    return data.data;
  }

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offer),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create offer');
    }
    
    const data = await response.json();
    return data.data;
  }

  async updateOffer(id: string, offer: Partial<Offer>): Promise<Offer> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offer),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update offer');
    }
    
    const data = await response.json();
    return data.data;
  }

  async deleteOffer(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete offer');
    }
  }
}

export const offerService = new OfferService();
