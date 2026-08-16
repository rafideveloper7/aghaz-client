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
import {
  FiCheckCircle,
  FiCreditCard,
  FiHome,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
  FiUpload,
  FiX,
  FiCopy,
  FiDownload,
  FiZoomIn,
} from 'react-icons/fi';
import { uploadApi } from '@/lib/api';

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
    if (methods.length > 0) {
      const sorted = [...methods].sort((a, b) => a.sortOrder - b.sortOrder);
      const cod = sorted.find((m) => m.type === 'cod');
      const rest = sorted.filter((m) => m.type !== 'cod');
      return cod ? [cod, ...rest] : sorted;
    }
    return [
      {
        code: 'cod',
        label: 'Cash on Delivery',
        type: 'cod' as const,
        instructions: 'Pay when you receive your order.',
        isActive: true,
        sortOrder: 0,
      },
      {
        code: 'easypaisa',
        label: 'Easypaisa',
        type: 'easypaisa' as const,
        instructions: 'Send payment to our Easypaisa account and share the transaction ID.',
        isActive: true,
        sortOrder: 1,
      },
    ];
  }, [settings?.paymentMethods]);

  const selectedPaymentMethod =
    paymentMethods.find((method) => method.code === selectedPaymentCode) || paymentMethods[0];
  const isPrepaid = selectedPaymentMethod?.type !== 'cod';
  const isEasypaisa = selectedPaymentMethod?.type === 'easypaisa';

  const getPaymentLabel = (method: { type: string; label: string }) => {
    if (method.type === 'cod') return 'Cash on Delivery';
    if (method.type === 'easypaisa') return 'Easypaisa';
    return method.label;
  };

  const getPaymentInstructions = (method: { type: string; instructions?: string }) => {
    if (method.type === 'cod') return 'Pay when you receive your order.';
    return method.instructions || '';
  };

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
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isQrLightboxOpen, setIsQrLightboxOpen] = useState(false);

  const handleCopyAccountNumber = async () => {
    const accountNumber = selectedPaymentMethod?.accountNumber;
    if (!accountNumber) return;
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      toast.success('Copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleQrDownload = async () => {
    const qrUrl = selectedPaymentMethod?.qrCode;
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easypaisa-qr-${selectedPaymentMethod.code}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('QR code downloaded');
    } catch {
      toast.error('Download failed');
    }
  };

  const handlePaymentProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size is larger than 10MB — upload may be slow', { id: 'size-warn' });
    }
    setUploadingProof(true);
    try {
      const res = await uploadApi.uploadImage(file);
      setPaymentProofUrl(res.url);
      toast.success('Payment proof uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingProof(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please choose a payment method');
      return;
    }

    if (isEasypaisa && !data.paymentReference?.trim() && !paymentProofUrl) {
      toast.error('Please provide your Transaction ID or payment screenshot.');
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
        paymentProofUrl: paymentProofUrl || undefined,
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

  const isLoading = isSubmitting || createOrder.isPending || isCompletingOrder;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
              Choose how you want to pay.
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
                      <p className="text-sm font-semibold text-text-primary">{getPaymentLabel(method)}</p>
                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700">
                        {method.type === 'cod' ? 'Pay on Delivery' : 'Pay Now'}
                      </span>
                    </div>
                    {getPaymentInstructions(method) && (
                      <p className="mt-1 text-xs leading-5 text-text-secondary">{getPaymentInstructions(method)}</p>
                    )}

                    {isEasypaisa && checked && (
                      <div className="mt-3 grid gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 sm:grid-cols-2">
                        {method.accountTitle && (
                          <div>
                            <p className="font-semibold text-slate-900">Account Holder Name</p>
                            <p>{method.accountTitle}</p>
                          </div>
                        )}
                        {method.accountNumber && (
                          <div>
                            <p className="font-semibold text-slate-900">Account Number</p>
                            <div className="flex items-center gap-2">
                              <p className="break-all">{method.accountNumber}</p>
                              <button
                                type="button"
                                onClick={handleCopyAccountNumber}
                                className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-semibold text-primary shadow-sm"
                              >
                                {copied ? 'Copied' : <><FiCopy size={10} /> Copy</>}
                              </button>
                            </div>
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

      {isEasypaisa && (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-amber-800">
            <FiCreditCard size={16} />
            <p className="text-sm font-semibold">Easypaisa Payment</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-3 border border-amber-100">
              <p className="text-xs text-amber-700">Amount to Pay</p>
              <p className="text-lg font-bold text-amber-900">{formatPrice(grandTotal)}</p>
            </div>
            {selectedPaymentMethod?.accountNumber && (
              <div className="rounded-xl bg-white p-3 border border-amber-100">
                <p className="text-xs text-amber-700">Easypaisa Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-amber-900 break-all">{selectedPaymentMethod.accountNumber}</p>
                  <button
                    type="button"
                    onClick={handleCopyAccountNumber}
                    className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200 shrink-0"
                  >
                    {copied ? 'Copied' : <><FiCopy size={10} /> Copy</>}
                  </button>
                </div>
              </div>
            )}
            {selectedPaymentMethod?.accountTitle && (
              <div className="rounded-xl bg-white p-3 border border-amber-100 sm:col-span-2">
                <p className="text-xs text-amber-700">Account Name</p>
                <p className="text-sm font-semibold text-amber-900">{selectedPaymentMethod.accountTitle}</p>
              </div>
            )}
             {selectedPaymentMethod?.qrCode && (
               <div className="rounded-xl bg-white p-3 border border-amber-100 sm:col-span-2">
                 <p className="text-xs text-amber-700 mb-2">Scan QR Code</p>
                 <button
                   type="button"
                   onClick={() => setIsQrLightboxOpen(true)}
                   className="relative inline-block rounded-lg border border-amber-200 bg-white p-1 transition hover:border-amber-400"
                 >
                   <img
                     src={selectedPaymentMethod.qrCode}
                     alt="Easypaisa QR Code"
                     className="h-32 w-32 object-contain"
                     onError={(e) => {
                       (e.target as HTMLImageElement).style.display = 'none';
                     }}
                   />
                   <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 text-white opacity-0 transition hover:opacity-100">
                     <FiZoomIn size={24} />
                   </span>
                 </button>
                 <div className="mt-2">
                   <button
                     type="button"
                     onClick={handleQrDownload}
                     className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-medium text-amber-700 shadow-sm border border-amber-200 hover:bg-amber-50"
                   >
                     <FiDownload size={14} />
                     Download QR
                   </button>
                 </div>
               </div>
             )}
          </div>

          <div className="mt-4 rounded-xl bg-white p-3 border border-amber-100">
            <p className="text-xs font-semibold text-amber-800 mb-2">How to Pay with Easypaisa</p>
            <ol className="list-inside list-decimal space-y-1 text-xs text-amber-700">
              <li>Open the Easypaisa app on your phone.</li>
              <li>Send the exact order amount to the number shown above.</li>
              <li>Or scan the QR code if available.</li>
              <li>Complete the payment.</li>
              <li>Enter your Transaction ID or upload a payment screenshot below.</li>
              <li>Submit your order for verification.</li>
            </ol>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-amber-800 mb-2">Payment Proof</label>
            <p className="text-xs text-amber-700 mb-2">
              Provide your Transaction ID or payment screenshot. At least one is required.
            </p>
            <Input
              label="Transaction ID / Reference"
              placeholder="Enter your transfer receipt number"
              error={errors.paymentReference?.message}
              {...register('paymentReference')}
            />
            <p className="mt-1 text-[11px] text-amber-600">
              Optional if you upload a screenshot below.
            </p>

            <div className="mt-3">
              <label className="block text-xs font-medium text-amber-800 mb-2">Payment Screenshot</label>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50">
                  {uploadingProof ? (
                    <span className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full" />
                  ) : (
                    <FiUpload className="h-4 w-4" />
                  )}
                  {uploadingProof ? 'Uploading...' : 'Upload Screenshot'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePaymentProofUpload}
                    className="hidden"
                    disabled={uploadingProof}
                  />
                </label>
                {paymentProofUrl && (
                  <button
                    type="button"
                    onClick={() => setPaymentProofUrl('')}
                    className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
                  >
                    <FiX className="h-3 w-3" />
                    Remove
                  </button>
                )}
              </div>
              {paymentProofUrl && (
                <div className="mt-2 relative h-20 w-32 rounded-lg overflow-hidden border border-gray-200">
                  <img src={paymentProofUrl} alt="Payment proof" className="h-full w-full object-cover" />
                </div>
              )}
              <p className="mt-1 text-[11px] text-amber-600">
                Optional if you enter a Transaction ID above.
              </p>
            </div>
          </div>
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
              {isPrepaid ? 'Payment will be reviewed after reference verification.' : 'Our team will confirm your order after it is placed.'}
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        asMotion={true}
      >
        {isCompletingOrder ? (
          'Processing...'
        ) : isSubmitting || createOrder.isPending ? (
          'Placing Order...'
        ) : isPrepaid ? (
          'Place Order - Payment Sent'
        ) : (
          'Place Order - Cash on Delivery'
        )}
      </Button>
      {isQrLightboxOpen && selectedPaymentMethod?.qrCode ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsQrLightboxOpen(false)}
        >
          <div
            className="relative max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Easypaisa QR Code</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleQrDownload}
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 border border-amber-200"
                >
                  <FiDownload size={14} />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setIsQrLightboxOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <img
                src={selectedPaymentMethod.qrCode}
                alt="Easypaisa QR Code full size"
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Scan this QR code with your Easypaisa app to pay {formatPrice(grandTotal)}.
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}
