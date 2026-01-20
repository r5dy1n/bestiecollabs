import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface OutreachAttempt {
    id: string;
    contactable: {
        id: string;
        brand_name?: string;
        creator_name?: string;
    };
    contactable_type: string;
    initiated_by: {
        name: string;
    };
    channel: string;
    status: string;
    attempt_number: number;
    sent_at: string | null;
    responded_at: string | null;
    created_at: string;
}

interface PaginatedData {
    data: OutreachAttempt[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    contactable_type?: string;
    status?: string;
    channel?: string;
}

interface Props {
    attempts: PaginatedData;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Outreach',
        href: '/admin/outreach',
    },
];

export default function Index({ attempts, filters }: Props) {
    const [contactableType, setContactableType] = useState(filters.contactable_type || '');
    const [status, setStatus] = useState(filters.status || '');
    const [channel, setChannel] = useState(filters.channel || '');

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();

        router.get('/admin/outreach', {
            contactable_type: contactableType || undefined,
            status: status || undefined,
            channel: channel || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setContactableType('');
        setStatus('');
        setChannel('');
        router.get('/admin/outreach');
    };

    const hasActiveFilters = contactableType || status || channel;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'responded':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
            case 'bounced':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200';
        }
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'email':
                return '📧';
            case 'instagram':
                return '📸';
            case 'tiktok':
                return '🎵';
            default:
                return '📱';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Outreach Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Outreach Management</h1>
                        <p className="text-muted-foreground">Track and manage all outreach attempts</p>
                    </div>
                    <Link
                        href="/admin/outreach/create"
                        className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        New Outreach
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Contact Type</label>
                                <select
                                    value={contactableType}
                                    onChange={(e) => setContactableType(e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                >
                                    <option value="">All Types</option>
                                    <option value="Brand">Brands</option>
                                    <option value="Creator">Creators</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="sent">Sent</option>
                                    <option value="responded">Responded</option>
                                    <option value="failed">Failed</option>
                                    <option value="bounced">Bounced</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Channel</label>
                                <select
                                    value={channel}
                                    onChange={(e) => setChannel(e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                >
                                    <option value="">All Channels</option>
                                    <option value="email">Email</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="tiktok">TikTok</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                Apply Filters
                            </button>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="rounded-lg border border-sidebar-border/70 px-6 py-2 font-medium transition-colors hover:bg-neutral-100 dark:border-sidebar-border dark:hover:bg-neutral-900"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-950">
                    <table className="w-full">
                        <thead className="border-b border-sidebar-border/70 bg-neutral-50 dark:border-sidebar-border dark:bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Channel</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Attempt #</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Initiated By</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {attempts.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No outreach attempts found. Create your first outreach to get started.
                                    </td>
                                </tr>
                            ) : (
                                attempts.data.map((attempt) => (
                                    <tr key={attempt.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="font-medium">
                                                    {attempt.contactable.brand_name || attempt.contactable.creator_name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {attempt.contactable_type}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-lg">{getChannelIcon(attempt.channel)}</span>
                                            <span className="ml-2 capitalize">{attempt.channel}</span>
                                        </td>
                                        <td className="px-4 py-3">#{attempt.attempt_number}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(attempt.status)}`}>
                                                {attempt.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{attempt.initiated_by.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/outreach/${attempt.id}`}
                                                className="text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {attempts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {attempts.current_page > 1 && (
                            <Link
                                href={`/admin/outreach?page=${attempts.current_page - 1}`}
                                className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                            >
                                Previous
                            </Link>
                        )}

                        <div className="text-sm text-muted-foreground">
                            Page {attempts.current_page} of {attempts.last_page}
                        </div>

                        {attempts.current_page < attempts.last_page && (
                            <Link
                                href={`/admin/outreach?page=${attempts.current_page + 1}`}
                                className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                    Showing {attempts.data.length} of {attempts.total} outreach attempts
                </div>
            </div>
        </AppLayout>
    );
}
