import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Brands',
        href: '/admin/brands',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        brand_name: '',
        website_url: '',
        category_primary: '',
        category_secondary: '',
        category_tertiary: '',
        instagram_url: '',
        tiktok_url: '',
        description: '',
        customer_age_min: 18,
        customer_age_max: 65,
        us_based: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/brands');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Brand" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Brand</h1>
                    <p className="text-muted-foreground">Add a new brand to the platform</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Brand Name *</label>
                                <input
                                    type="text"
                                    value={data.brand_name}
                                    onChange={(e) => setData('brand_name', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                    required
                                />
                                {errors.brand_name && <p className="mt-1 text-sm text-red-600">{errors.brand_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Website URL *</label>
                                <input
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                    required
                                />
                                {errors.website_url && <p className="mt-1 text-sm text-red-600">{errors.website_url}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Description *</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                    required
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Primary Category *</label>
                                <input
                                    type="text"
                                    value={data.category_primary}
                                    onChange={(e) => setData('category_primary', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                    required
                                />
                                {errors.category_primary && <p className="mt-1 text-sm text-red-600">{errors.category_primary}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Secondary Category</label>
                                <input
                                    type="text"
                                    value={data.category_secondary}
                                    onChange={(e) => setData('category_secondary', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                />
                                {errors.category_secondary && <p className="mt-1 text-sm text-red-600">{errors.category_secondary}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tertiary Category</label>
                                <input
                                    type="text"
                                    value={data.category_tertiary}
                                    onChange={(e) => setData('category_tertiary', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                />
                                {errors.category_tertiary && <p className="mt-1 text-sm text-red-600">{errors.category_tertiary}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Social Media</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Instagram URL</label>
                                <input
                                    type="url"
                                    value={data.instagram_url}
                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                />
                                {errors.instagram_url && <p className="mt-1 text-sm text-red-600">{errors.instagram_url}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">TikTok URL</label>
                                <input
                                    type="url"
                                    value={data.tiktok_url}
                                    onChange={(e) => setData('tiktok_url', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                />
                                {errors.tiktok_url && <p className="mt-1 text-sm text-red-600">{errors.tiktok_url}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Customer Demographics</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Min Age *</label>
                                    <input
                                        type="number"
                                        value={data.customer_age_min}
                                        onChange={(e) => setData('customer_age_min', parseInt(e.target.value))}
                                        min="18"
                                        max="100"
                                        className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                        required
                                    />
                                    {errors.customer_age_min && <p className="mt-1 text-sm text-red-600">{errors.customer_age_min}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Max Age *</label>
                                    <input
                                        type="number"
                                        value={data.customer_age_max}
                                        onChange={(e) => setData('customer_age_max', parseInt(e.target.value))}
                                        min="18"
                                        max="100"
                                        className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                        required
                                    />
                                    {errors.customer_age_max && <p className="mt-1 text-sm text-red-600">{errors.customer_age_max}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.us_based}
                                        onChange={(e) => setData('us_based', e.target.checked)}
                                        className="rounded border-neutral-300 dark:border-neutral-700"
                                    />
                                    <span className="text-sm font-medium">US Based</span>
                                </label>
                                {errors.us_based && <p className="mt-1 text-sm text-red-600">{errors.us_based}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            {processing ? 'Creating...' : 'Create Brand'}
                        </button>
                        <a
                            href="/admin/brands"
                            className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
