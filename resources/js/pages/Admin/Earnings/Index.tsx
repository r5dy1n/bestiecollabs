import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Creator {
    id: string;
    creator_name: string;
}

interface Brand {
    id: string;
    brand_name: string;
}

interface Collaboration {
    id: string;
    brand: Brand;
}

interface CreatorEarning {
    id: string;
    creator: Creator;
    collaboration: Collaboration;
    amount: string;
    status: 'pending_approval' | 'held' | 'available' | 'paid_out' | 'reversed';
    approved_at: string | null;
    hold_until: string | null;
    reversed_at: string | null;
    reversal_reason: string | null;
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
    earnings: PaginatedData<CreatorEarning>;
    filters: { status?: string; creator?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Earnings', href: '/admin/earnings' },
];

const statusColors: Record<string, string> = {
    pending_approval: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    held: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    available: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    paid_out: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    reversed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function Index({ earnings, filters }: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [creator, setCreator] = useState(filters.creator || '');
    const [reverseDialog, setReverseDialog] = useState<{ earning: CreatorEarning } | null>(null);
    const [reason, setReason] = useState('');

    const applyFilters = () => {
        router.get('/admin/earnings', {
            status: status || undefined,
            creator: creator || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const approve = (earning: CreatorEarning) => {
        router.post(`/admin/earnings/${earning.id}/approve`);
    };

    const submitReverse = () => {
        if (!reverseDialog) return;
        router.post(`/admin/earnings/${reverseDialog.earning.id}/reverse`, { reason }, {
            onSuccess: () => { setReverseDialog(null); setReason(''); },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Earnings" />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-6 pb-0">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                    <option value="">All Statuses</option>
                    {['pending_approval', 'held', 'available', 'paid_out', 'reversed'].map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search creator…"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
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
                                    {['Creator', 'Brand', 'Amount', 'Status', 'Approved At', 'Hold Until', 'Actions'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {earnings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No earnings found.
                                        </td>
                                    </tr>
                                ) : (
                                    earnings.data.map((earning) => (
                                        <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                                {earning.creator?.creator_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                                {earning.collaboration?.brand?.brand_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">${earning.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[earning.status]}`}>
                                                    {earning.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {earning.approved_at ? new Date(earning.approved_at).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                {earning.hold_until ? new Date(earning.hold_until).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {earning.status === 'pending_approval' && (
                                                        <button
                                                            onClick={() => approve(earning)}
                                                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {['held', 'available', 'paid_out'].includes(earning.status) && (
                                                        <button
                                                            onClick={() => setReverseDialog({ earning })}
                                                            className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                                                        >
                                                            Reverse
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

            {/* Reverse Dialog */}
            {reverseDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Reverse Earning</h3>
                        {reverseDialog.earning.status === 'paid_out' && (
                            <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                Warning: This earning has already been paid out. A recovery earning will be created.
                            </p>
                        )}
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for reversal…"
                            rows={3}
                            className="w-full rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setReverseDialog(null)}
                                className="rounded-md border px-3 py-1.5 text-sm dark:border-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReverse}
                                disabled={!reason.trim()}
                                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                Confirm Reversal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
