import { useMutation } from '@tanstack/react-query';
import { contactMessagesApi } from '@/lib/api';
import type { ContactMessagePayload } from '@/types';

export function useCreateContactMessage() {
  return useMutation({
    mutationFn: (payload: ContactMessagePayload) => contactMessagesApi.create(payload),
  });
}
