import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { index as brandsIndex, edit as brandsEdit } from '@/actions/App/Http/Controllers/Admin/BrandController';
import { formatDistanceToNow } from 'date-fns';

interface OutreachAttempt {
    id: string;
    channel: string;
    status: string;
    attempt_number: number;
    sent_at: string | null;
    created_at: string;
    initiated_by: {
        name: string;
    };
}

interface Collaboration {
    id: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    connection_type: 'connected' | 'unconnected';
    collaboration_type: 'paid' | 'free' | 'commission' | 'product_exchange';
    total_revenue: string;
    commission_earned: string;
    created_at: string;
    creator: {
        id: string;
        creator_name: string;
    };
}

interface Brand {
    id: string;
    brand_name: string;
    website_url: string;
    category_primary: string;
    category_secondary: string | null;
    category_tertiary: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
    description: string;
    customer_age_min: number;
    customer_age_max: number;
    us_based: boolean;
    created_at: string;
    updated_at: string;
    outreach_attempts?: OutreachAttempt[];
    collaborations?: Collaboration[];
}

interface Props {
    brand: Brand;
    can_receive_messages: boolean;
}

export default function Show({ brand, can_receive_messages }: Props) {
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

    const getCollaborationStatusColor = (status: string) => {
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
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin',
        },
        {
            title: 'Brands',
            href: brandsIndex().url,
        },
        {
            title: brand.brand_name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={brand.brand_name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{brand.brand_name}</h1>
                        <p className="text-muted-foreground">Brand Details</p>
                    </div>
                    <Link
                        href={brandsEdit(brand.id).url}
                        className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        Edit Brand
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Brand Name</p>
                                <p className="mt-1">{brand.brand_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Website</p>
                                <a
                                    href={brand.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 block text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {brand.website_url}
                                </a>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">US Based</p>
                                <p className="mt-1">
                                    {brand.us_based ? (
                                        <span className="text-green-600 dark:text-green-400">Yes</span>
                                    ) : (
                                        <span className="text-red-600 dark:text-red-400">No</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p className="mt-1 whitespace-pre-wrap">{brand.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Primary Category</p>
                                <p className="mt-1">
                                    <span className="rounded bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-800">
                                        {brand.category_primary}
                                    </span>
                                </p>
                            </div>
                            {brand.category_secondary && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Secondary Category</p>
                                    <p className="mt-1">
                                        <span className="rounded bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-800">
                                            {brand.category_secondary}
                                        </span>
                                    </p>
                                </div>
                            )}
                            {brand.category_tertiary && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tertiary Category</p>
                                    <p className="mt-1">
                                        <span className="rounded bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-800">
                                            {brand.category_tertiary}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Social Media</h2>
                        <div className="space-y-3">
                            {brand.instagram_url ? (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                                    <a
                                        href={brand.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 block text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        {brand.instagram_url}
                                    </a>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Not provided</p>
                                </div>
                            )}
                            {brand.tiktok_url ? (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">TikTok</p>
                                    <a
                                        href={brand.tiktok_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 block text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        {brand.tiktok_url}
                                    </a>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">TikTok</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Not provided</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Customer Demographics</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Age Range</p>
                                <p className="mt-1">
                                    {brand.customer_age_min} - {brand.customer_age_max} years
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Outreach History</h2>
                        <div className="flex items-center gap-4">
                            {can_receive_messages ? (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    ✓ Direct Messaging Enabled
                                </span>
                            ) : (
                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    {brand.outreach_attempts?.filter(a => a.status === 'sent').length || 0}/7 Contacts
                                </span>
                            )}
                            <Link
                                href={`/admin/outreach/create?type=Brand&id=${brand.id}`}
                                className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                            >
                                + New Outreach
                            </Link>
                        </div>
                    </div>

                    {brand.outreach_attempts && brand.outreach_attempts.length > 0 ? (
                        <div className="space-y-3">
                            {brand.outreach_attempts.map((attempt) => (
                                <Link
                                    key={attempt.id}
                                    href={`/admin/outreach/${attempt.id}`}
                                    className="flex items-center justify-between rounded-lg border border-sidebar-border/70 p-4 transition-colors hover:bg-neutral-50 dark:border-sidebar-border dark:hover:bg-neutral-900"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{getChannelIcon(attempt.channel)}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Attempt #{attempt.attempt_number}</span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(attempt.status)}`}>
                                                    {attempt.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {attempt.initiated_by.name} · {formatDistanceToNow(new Date(attempt.created_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400">View →</div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-sidebar-border/70 p-8 text-center dark:border-sidebar-border">
                            <p className="text-muted-foreground">No outreach attempts yet</p>
                            <Link
                                href={`/admin/outreach/create?type=Brand&id=${brand.id}`}
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Create first outreach attempt
                            </Link>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Collaborations</h2>
                        <Link
                            href={`/admin/collaborations/create?brand_id=${brand.id}`}
                            className="rounded-md bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                        >
                            + New Collaboration
                        </Link>
                    </div>

                    {brand.collaborations && brand.collaborations.length > 0 ? (
                        <div className="space-y-3">
                            {brand.collaborations.map((collaboration) => (
                                <Link
                                    key={collaboration.id}
                                    href={`/admin/collaborations/${collaboration.id}`}
                                    className="flex items-center justify-between rounded-lg border border-sidebar-border/70 p-4 transition-colors hover:bg-neutral-50 dark:border-sidebar-border dark:hover:bg-neutral-900"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                            <span className="text-lg">🤝</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{collaboration.creator.creator_name}</span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCollaborationStatusColor(collaboration.status)}`}>
                                                    {collaboration.status}
                                                </span>
                                                {collaboration.connection_type === 'connected' && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        ✓ Connected
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {collaboration.collaboration_type.replace('_', ' ')} · ${parseFloat(collaboration.total_revenue).toFixed(2)} revenue ·
                                                {' '}{formatDistanceToNow(new Date(collaboration.created_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400">View →</div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-sidebar-border/70 p-8 text-center dark:border-sidebar-border">
                            <p className="text-muted-foreground">No collaborations yet</p>
                            <Link
                                href={`/admin/collaborations/create?brand_id=${brand.id}`}
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Create first collaboration
                            </Link>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <h2 className="mb-4 text-lg font-semibold">Metadata</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Brand ID</p>
                            <p className="mt-1 font-mono text-sm">{brand.id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Created At</p>
                            <p className="mt-1 text-sm">{new Date(brand.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                            <p className="mt-1 text-sm">{new Date(brand.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        href={brandsIndex().url}
                        className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                    >
                        Back to Brands
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
