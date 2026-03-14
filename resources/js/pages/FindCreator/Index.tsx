import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import axios from 'axios';
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
    { id: 'all', name: 'All Categories', icon: '🌐' },
    { id: 'fashion', name: 'Fashion & Style', icon: '👗' },
    { id: 'beauty', name: 'Beauty & Makeup', icon: '💄' },
    { id: 'fitness', name: 'Fitness & Health', icon: '💪' },
    { id: 'food', name: 'Food & Cooking', icon: '🍳' },
    { id: 'travel', name: 'Travel & Lifestyle', icon: '✈️' },
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'business', name: 'Business & Finance', icon: '💼' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'parenting', name: 'Parenting & Family', icon: '👶' },
    { id: 'diy', name: 'DIY & Crafts', icon: '🔨' },
    { id: 'home', name: 'Home & Garden', icon: '🏡' },
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

const formatNumber = (num: number | null | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
};

export default function FindCreator() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [results, setResults] = useState<CreatorResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const response = await axios.post('/find-creators/search', {
                query,
                category: category !== 'all' ? category : null,
            });

            setResults(response.data.success ? response.data.results : []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

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
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="mb-3 block text-sm font-semibold">
                                    Category (Optional)
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-white dark:focus:ring-white/10"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-semibold">
                                    Search Query
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by name or handle..."
                                        className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-lg focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-white dark:focus:ring-white/10"
                                        required
                                        minLength={3}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-lg bg-black px-8 py-3 font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Searching...
                                            </span>
                                        ) : 'Search'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {loading && (
                        <div className="py-12 text-center">
                            <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-neutral-200 border-t-black dark:border-neutral-800 dark:border-t-white" />
                            <p className="text-neutral-600 dark:text-neutral-400">Searching creators...</p>
                        </div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 text-6xl">🔍</div>
                            <h3 className="mb-2 text-xl font-semibold">No creators found</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Try a different search query or category
                            </p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">
                                    Found {results.length} creator{results.length !== 1 ? 's' : ''}
                                </h2>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {results.map((result, index) => (
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
                        </>
                    )}

                    {!searched && (
                        <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="mb-4 text-xl font-semibold">How to find the perfect creators</h3>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <div className="mb-2 text-2xl">🔍</div>
                                    <h4 className="mb-1 font-semibold">Search by Name or Handle</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Find creators by their name or social media handle
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-2 text-2xl">🎯</div>
                                    <h4 className="mb-1 font-semibold">Filter by Category</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Narrow results by niche or content category
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-2 text-2xl">💬</div>
                                    <h4 className="mb-1 font-semibold">Connect & Collaborate</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Reach out to creators and start building partnerships
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
