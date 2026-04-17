'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateOrder } from '@/hooks/useOrders';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { OrderPayload } from '@/types';
import { calculateDeliveryFee, formatPrice } from '@/lib/utils';
import { FiCheckCircle, FiCreditCard, FiHome, FiMapPin, FiPhone, FiShield, FiUser } from 'react-icons/fi';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^(\+92|0)?3\d{9}$/, 'Enter a valid Pakistan phone number'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  paymentReference: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useCreateOrder();
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState('cod');
  const { data: settings } = useSiteSettings();
  const subtotal = getTotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const grandTotal = subtotal + deliveryFee;
  const paymentMethods = useMemo(() => {
    const methods = settings?.paymentMethods?.filter((method) => method.isActive) || [];
    return methods.length > 0
      ? [...methods].sort((a, b) => a.sortOrder - b.sortOrder)
      : [
          {
            code: 'cod',
            label: 'Cash on Delivery',
            type: 'cod' as const,
            instructions: 'Pay when you receive your order.',
            isActive: true,
            sortOrder: 0,
          },
        ];
  }, [settings?.paymentMethods]);
  const selectedPaymentMethod =
    paymentMethods.find((method) => method.code === selectedPaymentCode) || paymentMethods[0];
  const isPrepaid = selectedPaymentMethod?.type !== 'cod';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      city: '',
      address: '',
      paymentReference: '',
    },
  });
  const paymentReference = watch('paymentReference');

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please choose a payment method');
      return;
    }

    if (isPrepaid && !data.paymentReference?.trim()) {
      toast.error('Add the payment reference or transaction ID');
      return;
    }

    try {
      setIsCompletingOrder(true);

      const orderPayload: OrderPayload = {
        customerName: data.customerName,
        phone: data.phone,
        city: data.city,
        address: data.address,
        products: items,
        totalAmount: grandTotal,
        paymentMethodCode: selectedPaymentMethod.code,
        paymentReference: data.paymentReference?.trim() || undefined,
      };

      const order = await createOrder.mutateAsync(orderPayload);
      sessionStorage.setItem('latest-order', JSON.stringify(order));
      clearCart();
      router.replace(`/order-success?id=${encodeURIComponent(order._id)}`);
    } catch {
      setIsCompletingOrder(false);
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

      <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Payment Method</p>
            <p className="text-xs text-text-secondary">
              Choose COD or pay now using admin-managed account details.
            </p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            Total {formatPrice(grandTotal)}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {paymentMethods.map((method) => {
            const checked = method.code === selectedPaymentCode;

            return (
              <label
                key={method.code}
                className={`block cursor-pointer rounded-2xl border p-4 transition-all ${
                  checked
                    ? 'border-primary bg-white shadow-[0_18px_40px_-28px_rgba(16,185,129,0.65)]'
                    : 'border-white bg-white/70 hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={checked}
                    onChange={() => setSelectedPaymentCode(method.code)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{method.label}</p>
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700">
                        {method.type === 'cod' ? 'Pay on Delivery' : 'Pay Now'}
                      </span>
                    </div>
                    {method.instructions && (
                      <p className="mt-1 text-xs leading-5 text-text-secondary">{method.instructions}</p>
                    )}

                    {method.type !== 'cod' && (
                      <div className="mt-3 grid gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 sm:grid-cols-2">
                        {method.accountTitle && (
                          <div>
                            <p className="font-semibold text-slate-900">Account Title</p>
                            <p>{method.accountTitle}</p>
                          </div>
                        )}
                        {method.accountNumber && (
                          <div>
                            <p className="font-semibold text-slate-900">Account Number</p>
                            <p className="break-all">{method.accountNumber}</p>
                          </div>
                        )}
                        {method.iban && (
                          <div className="sm:col-span-2">
                            <p className="font-semibold text-slate-900">IBAN</p>
                            <p className="break-all">{method.iban}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {checked && <FiCheckCircle className="mt-0.5 h-5 w-5 text-primary" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {isPrepaid && (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-amber-800">
            <FiCreditCard size={16} />
            <p className="text-sm font-semibold">Payment Reference</p>
          </div>
          <Input
            label="Transaction ID / Reference"
            placeholder="Enter your transfer receipt number"
            error={errors.paymentReference?.message}
            {...register('paymentReference')}
          />
          <p className="mt-2 text-xs leading-5 text-amber-700">
            Share the transaction ID after sending {formatPrice(grandTotal)} to help the admin verify your payment quickly.
          </p>
        </div>
      )}

      <div className="grid gap-3 rounded-[1.75rem] border border-slate-200/70 bg-white p-4 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary-50 p-2 text-primary">
            <FiShield size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Secure checkout</p>
            <p className="text-xs text-text-secondary">Clear totals and verified payment details.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary-50 p-2 text-primary">
            <FiMapPin size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Nationwide delivery</p>
            <p className="text-xs text-text-secondary">Fast dispatch across Pakistan.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary-50 p-2 text-primary">
            <FiPhone size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Confirmation support</p>
            <p className="text-xs text-text-secondary">
              {isPrepaid && paymentReference ? 'Payment will be reviewed after reference verification.' : 'Our team will confirm your order after it is placed.'}
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting || createOrder.isPending || isCompletingOrder}
        asMotion
      >
        {isSubmitting || createOrder.isPending || isCompletingOrder
          ? 'Placing Order...'
          : isPrepaid
            ? 'Place Order - Payment Sent'
            : 'Place Order - Cash on Delivery'}
      </Button>
    </form>
  );
}
