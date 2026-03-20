import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface CreatorPayoutAccount {
    id: string;
    stripe_account_id: string | null;
    tier: 'Tier1' | 'Tier2' | 'Tier3';
    hold_period_days: number;
    onboarding_complete: boolean;
    charges_enabled: boolean;
    payouts_enabled: boolean;
}

interface CreatorPayout {
    id: string;
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
    payout_account: CreatorPayoutAccount | null;
    available_balance: number;
    held_balance: number;
    pending_balance: number;
    payouts: PaginatedData<CreatorPayout>;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Payouts', href: '/payouts' }];

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

export default function Index({ payout_account, available_balance, held_balance, pending_balance, payouts }: Props) {
    const feePercent = 1.5;
    const isOnboarded = payout_account?.onboarding_complete && payout_account?.payouts_enabled;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payouts" />

            <div className="space-y-6 p-6">
                {/* Onboarding Banner */}
                {!payout_account?.stripe_account_id && (
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
                        <p className="mb-3 text-sm text-indigo-800 dark:text-indigo-300">
                            Connect your Stripe account to receive payouts.
                        </p>
                        <Link
                            href="/payouts/onboard"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Connect Stripe Account
                        </Link>
                    </div>
                )}

                {payout_account?.stripe_account_id && !isOnboarded && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                        <p className="mb-3 text-sm text-amber-800 dark:text-amber-300">
                            Your Stripe account setup is incomplete. Please finish onboarding to receive payouts.
                        </p>
                        <Link
                            href="/payouts/onboard"
                            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            Continue Setup
                        </Link>
                    </div>
                )}

                {/* Balance Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950/30">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">Available</p>
                        <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-200">${available_balance.toFixed(2)}</p>
                        {isOnboarded && available_balance > 0 && (
                            <button
                                onClick={() => router.post('/payouts/instant')}
                                className="mt-3 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                            >
                                Request Instant Payout ({feePercent}% fee)
                            </button>
                        )}
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Held</p>
                        <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-200">${held_balance.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                            {payout_account ? `${payout_account.hold_period_days}-day hold period` : 'Awaiting account setup'}
                        </p>
                    </div>

                    <div className="rounded-lg border bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">${pending_balance.toFixed(2)}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Awaiting admin review</p>
                    </div>
                </div>

                {/* Payout History */}
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payout History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Date', 'Type', 'Amount', 'Fee', 'Net', 'Status'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {payouts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No payouts yet.
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.data.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
