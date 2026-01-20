import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
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
        email: string;
    };
    channel: string;
    status: string;
    attempt_number: number;
    message_content: string;
    response_content: string | null;
    sent_at: string | null;
    responded_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    attempt: OutreachAttempt;
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
    {
        title: 'View',
        href: '#',
    },
];

export default function Show({ attempt }: Props) {
    const [status, setStatus] = useState(attempt.status);
    const [responseContent, setResponseContent] = useState(attempt.response_content || '');
    const [notes, setNotes] = useState(attempt.notes || '');
    const [updating, setUpdating] = useState(false);

    const handleUpdateStatus = (e: FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        router.patch(`/admin/outreach/${attempt.id}/status`, {
            status,
            response_content: responseContent || null,
            notes: notes || null,
        }, {
            onFinish: () => setUpdating(false),
        });
    };

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
            <Head title={`Outreach Attempt #${attempt.attempt_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Outreach Attempt #{attempt.attempt_number}</h1>
                        <p className="text-muted-foreground">
                            {attempt.contactable.brand_name || attempt.contactable.creator_name}
                        </p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(attempt.status)}`}>
                        {attempt.status}
                    </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h2 className="mb-4 text-lg font-semibold">Outreach Details</h2>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Contact</dt>
                                    <dd className="mt-1 text-sm">
                                        {attempt.contactable.brand_name || attempt.contactable.creator_name}
                                        <span className="ml-2 text-muted-foreground">({attempt.contactable_type})</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Channel</dt>
                                    <dd className="mt-1 text-sm">
                                        <span className="mr-2 text-lg">{getChannelIcon(attempt.channel)}</span>
                                        <span className="capitalize">{attempt.channel}</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Attempt Number</dt>
                                    <dd className="mt-1 text-sm">#{attempt.attempt_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Initiated By</dt>
                                    <dd className="mt-1 text-sm">
                                        {attempt.initiated_by.name}
                                        <div className="text-xs text-muted-foreground">{attempt.initiated_by.email}</div>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                                    <dd className="mt-1 text-sm">
                                        {formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true })}
                                    </dd>
                                </div>
                                {attempt.sent_at && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Sent At</dt>
                                        <dd className="mt-1 text-sm">
                                            {formatDistanceToNow(new Date(attempt.sent_at), { addSuffix: true })}
                                        </dd>
                                    </div>
                                )}
                                {attempt.responded_at && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Responded At</dt>
                                        <dd className="mt-1 text-sm">
                                            {formatDistanceToNow(new Date(attempt.responded_at), { addSuffix: true })}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h2 className="mb-4 text-lg font-semibold">Message Content</h2>
                            <div className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-4 text-sm dark:bg-neutral-900">
                                {attempt.message_content}
                            </div>
                        </div>

                        {attempt.response_content && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                                <h2 className="mb-4 text-lg font-semibold">Response</h2>
                                <div className="whitespace-pre-wrap rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950">
                                    {attempt.response_content}
                                </div>
                            </div>
                        )}

                        {attempt.notes && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                                <h2 className="mb-4 text-lg font-semibold">Notes</h2>
                                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                                    {attempt.notes}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                            <h2 className="mb-4 text-lg font-semibold">Update Status</h2>
                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="sent">Sent</option>
                                        <option value="responded">Responded</option>
                                        <option value="failed">Failed</option>
                                        <option value="bounced">Bounced</option>
                                    </select>
                                </div>

                                {status === 'responded' && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Response Content</label>
                                        <textarea
                                            value={responseContent}
                                            onChange={(e) => setResponseContent(e.target.value)}
                                            rows={6}
                                            placeholder="Enter the response received..."
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Add or update notes..."
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : 'Update Status'}
                                </button>
                            </form>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                            <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">Progressive Engagement</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Mark as "Sent" when successfully delivered. After 7 sent attempts, direct messaging will be unlocked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
