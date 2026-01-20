import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Contactable {
    id: string;
    brand_name?: string;
    creator_name?: string;
}

interface Props {
    contactable?: Contactable;
    contactable_type?: string;
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
        title: 'Create',
        href: '/admin/outreach/create',
    },
];

export default function Create({ contactable, contactable_type }: Props) {
    const [contactableType, setContactableType] = useState(contactable_type || 'Brand');
    const [contactableId, setContactableId] = useState(contactable?.id || '');
    const [channel, setChannel] = useState('email');
    const [messageContent, setMessageContent] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);

        router.post('/admin/outreach', {
            contactable_type: contactableType,
            contactable_id: contactableId,
            channel,
            message_content: messageContent,
            notes: notes || null,
        }, {
            onError: (errors) => {
                setErrors(errors);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Outreach Attempt" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Outreach Attempt</h1>
                    <p className="text-muted-foreground">Record a new outreach contact</p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {contactable ? (
                            <div className="rounded-lg border border-sidebar-border/70 bg-neutral-50 p-4 dark:border-sidebar-border dark:bg-neutral-900">
                                <div className="text-sm font-medium text-muted-foreground">Contacting</div>
                                <div className="mt-1 text-lg font-semibold">
                                    {contactable.brand_name || contactable.creator_name}
                                </div>
                                <div className="text-sm text-muted-foreground">{contactable_type}</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Contact Type</label>
                                    <select
                                        value={contactableType}
                                        onChange={(e) => setContactableType(e.target.value)}
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                    >
                                        <option value="Brand">Brand</option>
                                        <option value="Creator">Creator</option>
                                    </select>
                                    {errors.contactable_type && (
                                        <div className="mt-2 text-sm text-red-500">{errors.contactable_type}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Contact ID</label>
                                    <input
                                        type="text"
                                        value={contactableId}
                                        onChange={(e) => setContactableId(e.target.value)}
                                        placeholder="UUID of brand or creator"
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                                    />
                                    {errors.contactable_id && (
                                        <div className="mt-2 text-sm text-red-500">{errors.contactable_id}</div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        You can find the UUID on the brand or creator detail page
                                    </p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">Channel</label>
                            <select
                                value={channel}
                                onChange={(e) => setChannel(e.target.value)}
                                className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                            >
                                <option value="email">📧 Email</option>
                                <option value="instagram">📸 Instagram</option>
                                <option value="tiktok">🎵 TikTok</option>
                            </select>
                            {errors.channel && (
                                <div className="mt-2 text-sm text-red-500">{errors.channel}</div>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Message Content</label>
                            <textarea
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                rows={8}
                                placeholder="Enter the message you sent..."
                                className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                            />
                            {errors.message_content && (
                                <div className="mt-2 text-sm text-red-500">{errors.message_content}</div>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                Maximum 5000 characters
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Any additional notes about this outreach attempt..."
                                className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-sidebar-border dark:bg-neutral-900"
                            />
                            {errors.notes && (
                                <div className="mt-2 text-sm text-red-500">{errors.notes}</div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Outreach Attempt'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit('/admin/outreach')}
                                className="rounded-lg border border-sidebar-border/70 px-6 py-2 font-medium transition-colors hover:bg-neutral-100 dark:border-sidebar-border dark:hover:bg-neutral-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                    <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">Progressive Engagement Strategy</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        After 7 successful outreach attempts (status: sent), direct messaging will be automatically unlocked for this contact.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
