import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find Creators',
        href: '/find-creators',
    },
];

const PLATFORM_LABELS: Record<string, { name: string; icon: string }> = {
    instagram: { name: 'Instagram', icon: '📷' },
    tiktok: { name: 'TikTok', icon: '🎵' },
    youtube: { name: 'YouTube', icon: '📺' },
    twitter: { name: 'Twitter/X', icon: '🐦' },
};

const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'fashion', name: 'Fashion & Style' },
    { id: 'beauty', name: 'Beauty & Makeup' },
    { id: 'fitness', name: 'Fitness & Health' },
    { id: 'food', name: 'Food & Cooking' },
    { id: 'travel', name: 'Travel & Lifestyle' },
    { id: 'tech', name: 'Technology' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'business', name: 'Business & Finance' },
    { id: 'education', name: 'Education' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'music', name: 'Music' },
    { id: 'sports', name: 'Sports' },
    { id: 'parenting', name: 'Parenting & Family' },
    { id: 'diy', name: 'DIY & Crafts' },
    { id: 'home', name: 'Home & Garden' },
];

interface PlatformStats {
    handle: string;
    followers: number | null;
    engagement_rate: number | null;
}

interface CreatorResult {
    username: string;
    display_name: string;
    bio: string | null;
    profile_picture_url: string | null;
    platforms: Record<string, PlatformStats>;
}

interface Props {
    creators: CreatorResult[];
    filters: {
        query: string | null;
        category: string | null;
    };
}

const formatNumber = (num: number | null | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
};

export default function FindCreator({ creators, filters }: Props) {
    const [query, setQuery] = useState(filters.query ?? '');
    const [category, setCategory] = useState(filters.category ?? 'all');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = (newQuery: string, newCategory: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                '/find-creators',
                {
                    query: newQuery || undefined,
                    category: newCategory !== 'all' ? newCategory : undefined,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
    };

    const handleQueryChange = (value: string) => {
        setQuery(value);
        search(value, category);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        search(query, value);
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Find Creators" />

            <div className="p-4 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="mb-2 text-4xl font-bold">Find Creators</h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Search for influencers and content creators
                        </p>
                    </div>

                    <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleQueryChange(e.target.value)}
                                placeholder="Search by name or handle..."
                                className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-white dark:focus:ring-white/10"
                            />
                            <select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-white dark:focus:ring-white/10 sm:w-56"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {creators.length} creator{creators.length !== 1 ? 's' : ''}
                            {query ? ` matching "${query}"` : ''}
                        </p>
                    </div>

                    {creators.length === 0 ? (
                        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 text-6xl">🔍</div>
                            <h3 className="mb-2 text-xl font-semibold">No creators found</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                {query ? 'Try a different search query or category' : 'No creators have connected their social accounts yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {creators.map((result, index) => (
                                <div
                                    key={index}
                                    className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="mb-4 flex items-start gap-4">
                                        {result.profile_picture_url ? (
                                            <img
                                                src={result.profile_picture_url}
                                                alt={result.username}
                                                className="size-16 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
                                            />
                                        ) : (
                                            <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100 text-2xl dark:bg-neutral-800">
                                                👤
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold">{result.display_name}</h3>
                                            <p className="truncate text-sm text-neutral-600 dark:text-neutral-400">
                                                {result.username}
                                            </p>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {Object.keys(result.platforms).map((platform) => (
                                                    <span
                                                        key={platform}
                                                        className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800"
                                                    >
                                                        {PLATFORM_LABELS[platform]?.icon} {PLATFORM_LABELS[platform]?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {result.bio && (
                                        <p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            {result.bio}
                                        </p>
                                    )}

                                    <div className="mb-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                        {Object.entries(result.platforms).map(([platform, stats]) => (
                                            <div key={platform} className="flex items-center justify-between text-sm">
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    {PLATFORM_LABELS[platform]?.icon} {stats.handle}
                                                </span>
                                                <span className="font-medium">
                                                    {formatNumber(stats.followers)} followers
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/find-creators/${result.username?.replace(/^@/, '')}`}
                                        className="block w-full rounded-lg bg-black px-4 py-2.5 text-center font-semibold text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
