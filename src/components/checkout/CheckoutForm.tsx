'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { OrderPayload } from '@/types';
import { FiPhone, FiUser, FiMapPin, FiHome } from 'react-icons/fi';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^(\+92|0)?3\d{9}$/, 'Enter a valid Pakistan phone number'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      city: '',
      address: '',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderPayload: OrderPayload = {
        customerName: data.customerName,
        phone: data.phone,
        city: data.city,
        address: data.address,
        products: items,
        totalAmount: getTotal(),
      };

      await createOrder.mutateAsync(orderPayload);
      clearCart();
      router.push('/order-success');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        icon={<FiUser size={16} />}
        error={errors.customerName?.message}
        {...register('customerName')}
      />

      <Input
        label="Phone Number"
        placeholder="03XX-XXXXXXX"
        icon={<FiPhone size={16} />}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="City"
        placeholder="Enter your city"
        icon={<FiMapPin size={16} />}
        error={errors.city?.message}
        {...register('city')}
      />

      <div>
        <Input
          label="Full Address"
          placeholder="House #, Street, Area, Landmark"
          icon={<FiHome size={16} />}
          error={errors.address?.message}
          {...register('address')}
        />
      </div>

      {/* COD Badge */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-50 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <FiPhone size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-800">Cash on Delivery</p>
          <p className="text-xs text-primary-600">Pay when you receive your order</p>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting || createOrder.isPending}
        asMotion
      >
        {isSubmitting || createOrder.isPending ? 'Placing Order...' : 'Place Order - COD'}
      </Button>
    </form>
  );
}
