import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Creator {
    id: string;
    creator_name: string;
}

interface CreatorPayout {
    id: string;
    creator: Creator;
    amount: string;
    fee: string;
    net_amount: string;
    type: 'standard' | 'instant';
    status: 'pending' | 'processing' | 'paid' | 'failed';
    stripe_payout_id: string | null;
    created_at: string;
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
    payouts: PaginatedData<CreatorPayout>;
    filters: { type?: string; status?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Payouts', href: '/admin/payouts' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const typeColors: Record<string, string> = {
    standard: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    instant: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

export default function Index({ payouts, filters }: Props) {
    const [type, setType] = useState(filters.type || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get('/admin/payouts', {
            type: type || undefined,
            status: status || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payouts" />

            <div className="flex flex-wrap gap-3 p-6 pb-0">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                    <option value="">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="instant">Instant</option>
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                    <option value="">All Statuses</option>
                    {['pending', 'processing', 'paid', 'failed'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
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
                                    {['Creator', 'Date', 'Type', 'Amount', 'Fee', 'Net', 'Status', 'Stripe ID'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {payouts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                            No payouts found.
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.data.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                {payout.creator?.creator_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {new Date(payout.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${typeColors[payout.type]}`}>
                                                    {payout.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">${payout.amount}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {parseFloat(payout.fee) > 0 ? `$${payout.fee}` : '—'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${payout.net_amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[payout.status]}`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                                                {payout.stripe_payout_id ?? '—'}
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
