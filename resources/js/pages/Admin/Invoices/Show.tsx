import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Brand {
    id: string;
    brand_name: string;
}

interface Collaboration {
    id: string;
}

interface BrandInvoiceLineItem {
    id: string;
    description: string;
    type: 'charge' | 'fee' | 'credit' | 'refund' | 'adjustment';
    amount: string;
    collaboration: Collaboration | null;
}

interface BrandInvoice {
    id: string;
    brand: Brand;
    billing_period_start: string;
    billing_period_end: string;
    subtotal: string;
    discount_amount: string;
    processing_fee: string;
    total: string;
    status: 'draft' | 'open' | 'paid' | 'failed' | 'void';
    paid_at: string | null;
    line_items: BrandInvoiceLineItem[];
}

interface Props {
    invoice: BrandInvoice;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Invoices', href: '/admin/invoices' },
    { title: 'Invoice Detail', href: '#' },
];

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    void: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
};

const lineTypeColors: Record<string, string> = {
    charge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    fee: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    credit: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    refund: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    adjustment: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function Show({ invoice }: Props) {
    const [confirmCharge, setConfirmCharge] = useState(false);
    const [confirmVoid, setConfirmVoid] = useState(false);

    const charge = () => {
        router.post(`/admin/invoices/${invoice.id}/charge`, {}, {
            onSuccess: () => setConfirmCharge(false),
        });
    };

    const voidInvoice = () => {
        router.post(`/admin/invoices/${invoice.id}/void`, {}, {
            onSuccess: () => setConfirmVoid(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Invoice — ${invoice.brand?.brand_name}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{invoice.brand?.brand_name}</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {invoice.billing_period_start} – {invoice.billing_period_end}
                        </p>
                        {invoice.paid_at && (
                            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                                Paid {new Date(invoice.paid_at).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${statusColors[invoice.status]}`}>
                            {invoice.status}
                        </span>
                        {invoice.status === 'open' && (
                            <button
                                onClick={() => setConfirmCharge(true)}
                                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Charge Now
                            </button>
                        )}
                        {['open', 'failed'].includes(invoice.status) && (
                            <button
                                onClick={() => setConfirmVoid(true)}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                Void
                            </button>
                        )}
                    </div>
                </div>

                {/* Line Items */}
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b px-6 py-4 dark:border-gray-700">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Line Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Description', 'Type', 'Amount'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {invoice.line_items.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No line items.
                                        </td>
                                    </tr>
                                ) : (
                                    invoice.line_items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{item.description}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${lineTypeColors[item.type]}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                ${item.amount}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="ml-auto max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>Subtotal</span>
                            <span>${invoice.subtotal}</span>
                        </div>
                        {parseFloat(invoice.discount_amount) > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400">
                                <span>ACH Discount</span>
                                <span>-${invoice.discount_amount}</span>
                            </div>
                        )}
                        {parseFloat(invoice.processing_fee) > 0 && (
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Processing Fee</span>
                                <span>${invoice.processing_fee}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-t pt-2 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                            <span>Total</span>
                            <span>${invoice.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charge Confirm */}
            {confirmCharge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Charge Invoice</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Charge <strong>${invoice.total}</strong> to {invoice.brand?.brand_name}?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmCharge(false)} className="rounded-md border px-3 py-1.5 text-sm dark:border-gray-600">Cancel</button>
                            <button onClick={charge} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Charge</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Void Confirm */}
            {confirmVoid && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Void Invoice</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Are you sure you want to void this invoice?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmVoid(false)} className="rounded-md border px-3 py-1.5 text-sm dark:border-gray-600">Cancel</button>
                            <button onClick={voidInvoice} className="rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700">Void</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
