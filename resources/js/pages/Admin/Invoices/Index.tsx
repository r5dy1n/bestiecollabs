import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Brand {
    id: string;
    brand_name: string;
}

interface BrandInvoice {
    id: string;
    brand: Brand;
    billing_period_start: string;
    billing_period_end: string;
    subtotal: string;
    discount_amount: string;
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
    invoices: PaginatedData<BrandInvoice>;
    filters: { status?: string; brand?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Invoices', href: '/admin/invoices' },
];

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    void: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
};

export default function Index({ invoices, filters }: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [brand, setBrand] = useState(filters.brand || '');
    const [confirmCharge, setConfirmCharge] = useState<BrandInvoice | null>(null);
    const [confirmVoid, setConfirmVoid] = useState<BrandInvoice | null>(null);

    const applyFilters = () => {
        router.get('/admin/invoices', {
            status: status || undefined,
            brand: brand || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const charge = (invoice: BrandInvoice) => {
        router.post(`/admin/invoices/${invoice.id}/charge`, {}, {
            onSuccess: () => setConfirmCharge(null),
        });
    };

    const voidInvoice = (invoice: BrandInvoice) => {
        router.post(`/admin/invoices/${invoice.id}/void`, {}, {
            onSuccess: () => setConfirmVoid(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />

            <div className="flex flex-wrap gap-3 p-6 pb-0">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                    <option value="">All Statuses</option>
                    {['draft', 'open', 'paid', 'failed', 'void'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search brand…"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                />
                <button
                    onClick={applyFilters}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Filter
                </button>
            </div>

            <div className="p-6">
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Brand', 'Period', 'Subtotal', 'Discount', 'Total', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {invoices.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.data.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                <Link href={`/admin/invoices/${invoice.id}`} className="hover:underline">
                                                    {invoice.brand?.brand_name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {invoice.billing_period_start} – {invoice.billing_period_end}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">${invoice.subtotal}</td>
                                            <td className="px-6 py-4 text-green-600 dark:text-green-400">
                                                {parseFloat(invoice.discount_amount) > 0 ? `-$${invoice.discount_amount}` : '—'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${invoice.total}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[invoice.status]}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {invoice.status === 'open' && (
                                                        <button
                                                            onClick={() => setConfirmCharge(invoice)}
                                                            className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                                                        >
                                                            Charge Now
                                                        </button>
                                                    )}
                                                    {['open', 'failed'].includes(invoice.status) && (
                                                        <button
                                                            onClick={() => setConfirmVoid(invoice)}
                                                            className="rounded bg-gray-500 px-2 py-1 text-xs font-medium text-white hover:bg-gray-600"
                                                        >
                                                            Void
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Charge Confirm Dialog */}
            {confirmCharge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Charge Invoice</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Charge <strong>${confirmCharge.total}</strong> to {confirmCharge.brand?.brand_name}?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmCharge(null)} className="rounded-md border px-3 py-1.5 text-sm dark:border-gray-600">Cancel</button>
                            <button onClick={() => charge(confirmCharge)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Charge</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Void Confirm Dialog */}
            {confirmVoid && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Void Invoice</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to void this invoice for {confirmVoid.brand?.brand_name}?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmVoid(null)} className="rounded-md border px-3 py-1.5 text-sm dark:border-gray-600">Cancel</button>
                            <button onClick={() => voidInvoice(confirmVoid)} className="rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700">Void</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
