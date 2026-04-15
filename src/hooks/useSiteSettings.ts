import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: settingsApi.get,
    staleTime: 1000 * 60 * 5,
  });
}
