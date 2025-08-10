import { useState, useEffect } from 'react';
import { Offer } from '@/types/offers';
import { offerService, OfferFilters } from '@/services/offer.service';

interface UseOffersProps extends OfferFilters {
}

interface UseOffersReturn {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refetch: () => void;
}

export function useOffers({ 
  page = 1, 
  limit = 10, 
  search = '',
  status = '',
  payoutModel = '',
  mobileOperator = ''
}: UseOffersProps = {}): UseOffersReturn {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: OfferFilters = {
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(payoutModel && { payoutModel }),
        ...(mobileOperator && { mobileOperator })
      };

      const response = await offerService.getOffers(filters);
      console.log('here in user-offers , this is the response offers  :', response.data.offers);
      if (response.success) {
        setOffers(Array.isArray(response.data.offers) ? response.data.offers : [response.data.offers]);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch offers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page, limit, search, status, payoutModel, mobileOperator]);

  return {
    offers,
    loading,
    error,
    pagination,
    refetch: fetchOffers
  };
}