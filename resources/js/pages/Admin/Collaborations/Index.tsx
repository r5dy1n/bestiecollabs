import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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
    total_revenue: string;
    commission_earned: string;
    payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
    created_at: string;
}

interface PaginatedData {
    data: Collaboration[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    collaborations: PaginatedData;
    filters: {
        status?: string;
        connection_type?: string;
        collaboration_type?: string;
        brand_id?: string;
        creator_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Collaborations',
        href: '/admin/collaborations',
    },
];

export default function Index({ collaborations, filters }: Props) {
    const [status, setStatus] = useState(filters.status || '');
    const [connectionType, setConnectionType] = useState(filters.connection_type || '');
    const [collaborationType, setCollaborationType] = useState(filters.collaboration_type || '');

    const applyFilters = () => {
        router.get('/admin/collaborations', {
            status: status || undefined,
            connection_type: connectionType || undefined,
            collaboration_type: collaborationType || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setStatus('');
        setConnectionType('');
        setCollaborationType('');
        router.get('/admin/collaborations', {}, {
            preserveState: true,
            preserveScroll: true,
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

    const hasFilters = status || connectionType || collaborationType;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collaborations" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Collaborations</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage brand-creator collaborations
                        </p>
                    </div>
                    <Link
                        href="/admin/collaborations/create"
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        + New Collaboration
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <h3 className="mb-4 text-sm font-medium">Filters</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Connection Type</label>
                            <select
                                value={connectionType}
                                onChange={(e) => setConnectionType(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                            >
                                <option value="">All Types</option>
                                <option value="connected">✓ Connected</option>
                                <option value="unconnected">Unconnected</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Collaboration Type</label>
                            <select
                                value={collaborationType}
                                onChange={(e) => setCollaborationType(e.target.value)}
                                className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                            >
                                <option value="">All Types</option>
                                <option value="paid">Paid</option>
                                <option value="free">Free</option>
                                <option value="commission">Commission</option>
                                <option value="product_exchange">Product Exchange</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={applyFilters}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            Apply Filters
                        </button>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="rounded-md border border-sidebar-border px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-sidebar-border dark:hover:bg-neutral-800"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Collaborations List */}
                {collaborations.data.length === 0 ? (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-12 text-center dark:border-sidebar-border dark:bg-neutral-950">
                        <p className="text-muted-foreground">No collaborations found.</p>
                        <Link
                            href="/admin/collaborations/create"
                            className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            Create First Collaboration
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-950">
                        <table className="w-full">
                            <thead className="border-b border-sidebar-border/70 bg-neutral-50 dark:border-sidebar-border dark:bg-neutral-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Creator</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {collaborations.data.map((collaboration) => (
                                    <tr key={collaboration.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/brands/${collaboration.brand.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {collaboration.brand.brand_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/creators/${collaboration.creator.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {collaboration.creator.creator_name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(collaboration.status)}`}>
                                                    {collaboration.status}
                                                </span>
                                                {collaboration.connection_type === 'connected' && (
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        ✓ Connected
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm capitalize">{collaboration.collaboration_type.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 text-sm">
                                            ${parseFloat(collaboration.total_revenue).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(collaboration.payment_status)}`}>
                                                {collaboration.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/collaborations/${collaboration.id}`}
                                                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {collaborations.last_page > 1 && (
                            <div className="border-t border-sidebar-border/70 bg-neutral-50 px-6 py-4 dark:border-sidebar-border dark:bg-neutral-900">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {(collaborations.current_page - 1) * collaborations.per_page + 1} to{' '}
                                        {Math.min(collaborations.current_page * collaborations.per_page, collaborations.total)} of{' '}
                                        {collaborations.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {collaborations.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-md px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                                        : 'border border-sidebar-border hover:bg-neutral-100 dark:border-sidebar-border dark:hover:bg-neutral-700'
                                                } ${!link.url && 'pointer-events-none opacity-50'}`}
                                                preserveState
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
