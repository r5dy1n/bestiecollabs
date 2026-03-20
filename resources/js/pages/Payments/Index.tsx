import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useState } from 'react';

interface BrandBillingAccount {
    id: string;
    stripe_customer_id: string | null;
    payment_method_type: 'card' | 'us_bank_account' | null;
    payment_method_id: string | null;
    ach_discount_eligible: boolean;
}

interface BrandInvoice {
    id: string;
    billing_period_start: string;
    billing_period_end: string;
    subtotal: string;
    discount_amount: string;
    processing_fee: string;
    total: string;
    status: 'draft' | 'open' | 'paid' | 'failed' | 'void';
    paid_at: string | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    billing_account: BrandBillingAccount | null;
    invoices: PaginatedData<BrandInvoice>;
    stripe_publishable_key: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Payments', href: '/payments' }];

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    void: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
};

function SetupForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        const result = await stripe.confirmSetup({
            elements,
            redirect: 'if_required',
        });

        if (result.error) {
            setError(result.error.message ?? 'An error occurred.');
            setProcessing(false);
        } else {
            const pmId = result.setupIntent?.payment_method as string;
            router.post('/payments/payment-method', { payment_method_id: pmId }, {
                onSuccess: () => onSuccess(),
                onError: () => setProcessing(false),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                {processing ? 'Saving…' : 'Save Payment Method'}
            </button>
        </form>
    );
}

export default function Index({ billing_account, invoices, stripe_publishable_key }: Props) {
    const [stripePromise] = useState(() => loadStripe(stripe_publishable_key));
    const [showSetup, setShowSetup] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const openSetup = async () => {
        const { data } = await axios.post('/payments/setup-intent');
        setClientSecret(data.client_secret);
        setShowSetup(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="space-y-8 p-6">
                {/* Payment Method */}
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Method</h2>

                    {billing_account?.payment_method_id ? (
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="font-medium capitalize text-gray-800 dark:text-gray-200">
                                    {billing_account.payment_method_type === 'us_bank_account' ? 'ACH Bank Account' : 'Card'}
                                </span>
                                {billing_account.ach_discount_eligible && (
                                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                        ACH Discount Applied
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={openSetup}
                                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => router.delete('/payments/payment-method')}
                                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">No payment method on file.</p>
                            <button
                                onClick={openSetup}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Add Payment Method
                            </button>
                        </div>
                    )}

                    {showSetup && clientSecret && (
                        <div className="mt-6">
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <SetupForm onSuccess={() => setShowSetup(false)} />
                            </Elements>
                        </div>
                    )}
                </div>

                {/* Invoice History */}
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Invoice History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Billing Period', 'Status', 'Subtotal', 'Discount', 'Total', 'Paid At'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {invoices.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No invoices yet.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.data.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {invoice.billing_period_start} – {invoice.billing_period_end}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[invoice.status]}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">${invoice.subtotal}</td>
                                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                                                {parseFloat(invoice.discount_amount) > 0 ? `-$${invoice.discount_amount}` : '—'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${invoice.total}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
