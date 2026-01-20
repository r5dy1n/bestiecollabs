import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Brand {
    id: string;
    brand_name: string;
}

interface Creator {
    id: string;
    creator_name: string;
}

interface Collaboration {
    id: string;
    brand: Brand;
    creator: Creator;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    connection_type: 'connected' | 'unconnected';
    collaboration_type: 'paid' | 'free' | 'commission' | 'product_exchange';
    commission_rate: string | null;
    fixed_payment: string | null;
    currency: string;
    agreement_template: string | null;
    deliverables: string | null;
    terms: string | null;
    start_date: string | null;
    end_date: string | null;
    completed_at: string | null;
    posts_delivered: number;
    posts_required: number | null;
    total_revenue: string;
    commission_earned: string;
    payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
    amount_paid: string;
    last_payment_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    collaboration: Collaboration;
}

export default function Show({ collaboration }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin',
        },
        {
            title: 'Collaborations',
            href: '/admin/collaborations',
        },
        {
            title: `${collaboration.brand.brand_name} × ${collaboration.creator.creator_name}`,
            href: `/admin/collaborations/${collaboration.id}`,
        },
    ];
    const [status, setStatus] = useState(collaboration.status);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [revenueAmount, setRevenueAmount] = useState('');
    const [postsDelivered, setPostsDelivered] = useState(collaboration.posts_delivered.toString());
    const [processing, setProcessing] = useState(false);

    const handleUpdateStatus = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.patch(`/admin/collaborations/${collaboration.id}/status`, {
            status,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleAddPayment = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(`/admin/collaborations/${collaboration.id}/payment`, {
            amount: paymentAmount,
            payment_date: paymentDate,
        }, {
            onSuccess: () => {
                setPaymentAmount('');
                setPaymentDate(new Date().toISOString().split('T')[0]);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleAddRevenue = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(`/admin/collaborations/${collaboration.id}/revenue`, {
            amount: revenueAmount,
        }, {
            onSuccess: () => {
                setRevenueAmount('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleUpdateDeliverables = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.patch(`/admin/collaborations/${collaboration.id}/deliverables`, {
            posts_delivered: postsDelivered,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
        }
    };

    const getPaymentStatusColor = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'partial':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
        }
    };

    const totalOwed = collaboration.collaboration_type === 'commission'
        ? parseFloat(collaboration.commission_earned)
        : parseFloat(collaboration.fixed_payment || '0');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${collaboration.brand.brand_name} × ${collaboration.creator.creator_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {collaboration.brand.brand_name} × {collaboration.creator.creator_name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Created {formatDistanceToNow(new Date(collaboration.created_at))} ago
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(collaboration.status)}`}>
                            {collaboration.status}
                        </span>
                        {collaboration.connection_type === 'connected' && (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                                ✓ Connected
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Overview */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h2 className="mb-4 text-lg font-semibold">Overview</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Brand</p>
                                    <Link
                                        href={`/admin/brands/${collaboration.brand.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {collaboration.brand.brand_name}
                                    </Link>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Creator</p>
                                    <Link
                                        href={`/admin/creators/${collaboration.creator.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {collaboration.creator.creator_name}
                                    </Link>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Collaboration Type</p>
                                    <p className="font-medium capitalize">{collaboration.collaboration_type.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Currency</p>
                                    <p className="font-medium">{collaboration.currency}</p>
                                </div>
                                {collaboration.start_date && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="font-medium">{new Date(collaboration.start_date).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {collaboration.end_date && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">End Date</p>
                                        <p className="font-medium">{new Date(collaboration.end_date).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Financial Overview */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h2 className="mb-4 text-lg font-semibold">Financial Overview</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold">${parseFloat(collaboration.total_revenue).toFixed(2)}</p>
                                </div>
                                {collaboration.collaboration_type === 'commission' && (
                                    <>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Commission Rate</p>
                                            <p className="text-2xl font-bold">{collaboration.commission_rate}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Commission Earned</p>
                                            <p className="text-2xl font-bold">${parseFloat(collaboration.commission_earned).toFixed(2)}</p>
                                        </div>
                                    </>
                                )}
                                {collaboration.collaboration_type === 'paid' && collaboration.fixed_payment && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fixed Payment</p>
                                        <p className="text-2xl font-bold">${parseFloat(collaboration.fixed_payment).toFixed(2)}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                                    <p className="text-2xl font-bold">${parseFloat(collaboration.amount_paid).toFixed(2)}</p>
                                    <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getPaymentStatusColor(collaboration.payment_status)}`}>
                                        {collaboration.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Deliverables */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h2 className="mb-4 text-lg font-semibold">Deliverables</h2>
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Posts Required</p>
                                    <p className="text-2xl font-bold">{collaboration.posts_required || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Posts Delivered</p>
                                    <p className="text-2xl font-bold">{collaboration.posts_delivered}</p>
                                </div>
                            </div>
                            {collaboration.deliverables && (
                                <div className="mt-4">
                                    <p className="mb-2 text-sm font-medium">Deliverables List</p>
                                    <p className="whitespace-pre-wrap rounded-md border border-sidebar-border bg-neutral-50 p-3 text-sm dark:border-sidebar-border dark:bg-neutral-800">
                                        {collaboration.deliverables}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Terms & Agreement */}
                        {(collaboration.terms || collaboration.agreement_template) && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                                <h2 className="mb-4 text-lg font-semibold">Terms & Agreement</h2>
                                {collaboration.terms && (
                                    <div className="mb-4">
                                        <p className="mb-2 text-sm font-medium">Terms & Conditions</p>
                                        <p className="whitespace-pre-wrap rounded-md border border-sidebar-border bg-neutral-50 p-3 text-sm dark:border-sidebar-border dark:bg-neutral-800">
                                            {collaboration.terms}
                                        </p>
                                    </div>
                                )}
                                {collaboration.agreement_template && (
                                    <div>
                                        <p className="mb-2 text-sm font-medium">Agreement Template</p>
                                        <p className="whitespace-pre-wrap rounded-md border border-sidebar-border bg-neutral-50 p-3 text-sm dark:border-sidebar-border dark:bg-neutral-800">
                                            {collaboration.agreement_template}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notes */}
                        {collaboration.notes && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                                <h2 className="mb-4 text-lg font-semibold">Notes</h2>
                                <p className="whitespace-pre-wrap text-sm">{collaboration.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Update Status */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
                            <form onSubmit={handleUpdateStatus}>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="mb-3 w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={processing || status === collaboration.status}
                                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Update Status
                                </button>
                            </form>
                        </div>

                        {/* Add Revenue */}
                        {collaboration.collaboration_type === 'commission' && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                                <h3 className="mb-4 text-lg font-semibold">Add Revenue</h3>
                                <form onSubmit={handleAddRevenue}>
                                    <label className="mb-2 block text-sm font-medium">Revenue Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={revenueAmount}
                                        onChange={(e) => setRevenueAmount(e.target.value)}
                                        placeholder="500.00"
                                        className="mb-3 w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                        required
                                    />
                                    <p className="mb-3 text-xs text-muted-foreground">
                                        Commission will be calculated automatically at {collaboration.commission_rate}%
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={processing || !revenueAmount}
                                        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        Add Revenue
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Record Payment */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h3 className="mb-4 text-lg font-semibold">Record Payment</h3>
                            <form onSubmit={handleAddPayment} className="space-y-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Payment Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="100.00"
                                        className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Payment Date</label>
                                    <input
                                        type="date"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                        required
                                    />
                                </div>
                                {totalOwed > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Total owed: ${totalOwed.toFixed(2)} | Remaining: ${Math.max(0, totalOwed - parseFloat(collaboration.amount_paid)).toFixed(2)}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing || !paymentAmount}
                                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Record Payment
                                </button>
                            </form>
                        </div>

                        {/* Update Posts Delivered */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h3 className="mb-4 text-lg font-semibold">Update Posts Delivered</h3>
                            <form onSubmit={handleUpdateDeliverables}>
                                <label className="mb-2 block text-sm font-medium">Posts Delivered</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={postsDelivered}
                                    onChange={(e) => setPostsDelivered(e.target.value)}
                                    className="mb-3 w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={processing || postsDelivered === collaboration.posts_delivered.toString()}
                                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Update Posts
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
