import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { update as creatorsUpdate, index as creatorsIndex } from '@/actions/App/Http/Controllers/Admin/CreatorController';
import { FormEvent } from 'react';

interface Creator {
    id: string;
    creator_name: string;
    description: string;
    instagram_url: string | null;
    tiktok_url: string | null;
    category_primary: string;
    category_secondary: string | null;
    category_tertiary: string | null;
    followers_demographs: any;
    follower_age_min: number;
    follower_age_max: number;
    language: string;
    us_based: boolean;
}

interface Props {
    creator: Creator;
}

export default function Edit({ creator }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin',
        },
        {
            title: 'Creators',
            href: creatorsIndex().url,
        },
        {
            title: creator.creator_name,
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        creator_name: creator.creator_name,
        description: creator.description,
        instagram_url: creator.instagram_url || '',
        tiktok_url: creator.tiktok_url || '',
        category_primary: creator.category_primary,
        category_secondary: creator.category_secondary || '',
        category_tertiary: creator.category_tertiary || '',
        followers_demographs: creator.followers_demographs,
        follower_age_min: creator.follower_age_min,
        follower_age_max: creator.follower_age_max,
        language: creator.language,
        us_based: creator.us_based,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(creatorsUpdate(creator.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${creator.creator_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Creator</h1>
                    <p className="text-muted-foreground">Update creator information</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Creator Name *</label>
                                <input
                                    type="text"
                                    value={data.creator_name}
                                    onChange={(e) => setData('creator_name', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                    required
                                />
                                {errors.creator_name && <p className="mt-1 text-sm text-red-600">{errors.creator_name}</p>}
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

                            <div>
                                <label className="block text-sm font-medium">Language *</label>
                                <select
                                    value={data.language}
                                    onChange={(e) => setData('language', e.target.value)}
                                    className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                    required
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Mandarin">Mandarin</option>
                                    <option value="Japanese">Japanese</option>
                                    <option value="Korean">Korean</option>
                                    <option value="Portuguese">Portuguese</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                                {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language}</p>}
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
                                    placeholder="e.g., Fashion, Beauty, Fitness"
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
                                    placeholder="https://instagram.com/username"
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
                                    placeholder="https://tiktok.com/@username"
                                />
                                {errors.tiktok_url && <p className="mt-1 text-sm text-red-600">{errors.tiktok_url}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Follower Demographics</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Min Age *</label>
                                    <input
                                        type="number"
                                        value={data.follower_age_min}
                                        onChange={(e) => setData('follower_age_min', parseInt(e.target.value))}
                                        min="18"
                                        max="100"
                                        className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                        required
                                    />
                                    {errors.follower_age_min && <p className="mt-1 text-sm text-red-600">{errors.follower_age_min}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Max Age *</label>
                                    <input
                                        type="number"
                                        value={data.follower_age_max}
                                        onChange={(e) => setData('follower_age_max', parseInt(e.target.value))}
                                        min="18"
                                        max="100"
                                        className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                        required
                                    />
                                    {errors.follower_age_max && <p className="mt-1 text-sm text-red-600">{errors.follower_age_max}</p>}
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

                            {data.followers_demographs && (
                                <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                                    <h3 className="mb-2 text-sm font-semibold">Current Demographics Data</h3>
                                    <pre className="overflow-auto text-xs text-muted-foreground">
                                        {JSON.stringify(data.followers_demographs, null, 2)}
                                    </pre>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Advanced demographic editing coming soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            {processing ? 'Updating...' : 'Update Creator'}
                        </button>
                        <a
                            href={creatorsIndex().url}
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
