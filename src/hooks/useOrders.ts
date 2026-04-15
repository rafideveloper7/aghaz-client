import { useMutation } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import type { OrderPayload, OrderResponse } from '@/types';

export function useCreateOrder() {
  return useMutation<OrderResponse, Error, OrderPayload>({
    mutationFn: (payload: OrderPayload) => ordersApi.create(payload),
    onSuccess: (order) => {
      return order;
    },
  });
}
