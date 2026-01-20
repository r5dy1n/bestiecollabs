import { Head } from '@inertiajs/react';
import { useState } from 'react';
import type { BreadcrumbItem, SocialSearchResult } from '@/types';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find Creators',
        href: '/find-creators',
    },
];

export default function FindCreator() {
    const [platform, setPlatform] = useState('instagram');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [results, setResults] = useState<SocialSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black dark:bg-white' },
        { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
        { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-blue-500' },
    ];

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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const response = await axios.post('/find-creators/search', {
                query,
                platform,
                category: category !== 'all' ? category : null,
            });

            if (response.data.success) {
                setResults(response.data.results);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number | undefined) => {
        if (!num) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    const selectedPlatform = platforms.find((p) => p.id === platform);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Find Creators" />

            <div className="p-4 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-4xl font-bold">
                            Find Creators
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Search for influencers and content creators across
                            social media platforms
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <form onSubmit={handleSearch} className="space-y-6">
                            {/* Platform Selection */}
                            <div>
                                <label className="mb-3 block text-sm font-semibold">
                                    Select Platform
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {platforms.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPlatform(p.id)}
                                            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                                platform === p.id
                                                    ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800'
                                                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'
                                            }`}
                                        >
                                            <span className="text-2xl">
                                                {p.icon}
                                            </span>
                                            <span className="font-semibold">
                                                {p.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Selection */}
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
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                    Filter creators by their niche or content category
                                </p>
                            </div>

                            {/* Search Input */}
                            <div>
                                <label className="mb-3 block text-sm font-semibold">
                                    Search Query
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        placeholder={`Search ${selectedPlatform?.name} creators...`}
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
                                                <svg
                                                    className="size-5 animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Searching...
                                            </span>
                                        ) : (
                                            'Search'
                                        )}
                                    </button>
                                </div>
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                    Try searching for topics, hashtags, or
                                    usernames
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Results */}
                    {loading && (
                        <div className="py-12 text-center">
                            <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-neutral-200 border-t-black dark:border-neutral-800 dark:border-t-white" />
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Searching {selectedPlatform?.name}...
                            </p>
                        </div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 text-6xl">🔍</div>
                            <h3 className="mb-2 text-xl font-semibold">
                                No creators found
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Try a different search query or platform
                            </p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Found {results.length} creators on{' '}
                                    {selectedPlatform?.name}
                                </h2>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        {/* Profile Header */}
                                        <div className="mb-4 flex items-start gap-4">
                                            {result.profile_picture_url ? (
                                                <img
                                                    src={
                                                        result.profile_picture_url
                                                    }
                                                    alt={result.username}
                                                    className="size-16 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
                                                />
                                            ) : (
                                                <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100 text-2xl dark:bg-neutral-800">
                                                    {selectedPlatform?.icon}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate font-semibold">
                                                    {result.display_name ||
                                                        result.channel_name ||
                                                        result.username}
                                                </h3>
                                                <p className="truncate text-sm text-neutral-600 dark:text-neutral-400">
                                                    {result.username}
                                                </p>
                                                {result.verified && (
                                                    <span className="mt-1 inline-flex items-center gap-1 text-sm text-blue-500">
                                                        <svg
                                                            className="size-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        {(result.bio || result.description) && (
                                            <p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                {result.bio || result.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="mb-4 flex gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                            <div>
                                                <div className="text-xl font-bold">
                                                    {formatNumber(
                                                        result.follower_count ||
                                                            result.subscriber_count,
                                                    )}
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {platform === 'youtube'
                                                        ? 'Subscribers'
                                                        : 'Followers'}
                                                </div>
                                            </div>
                                            {result.relevance_score && (
                                                <div>
                                                    <div className="text-xl font-bold">
                                                        {(
                                                            result.relevance_score *
                                                            100
                                                        ).toFixed(0)}
                                                        %
                                                    </div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        Match
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <button className="w-full rounded-lg bg-black px-4 py-2.5 font-semibold text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Getting Started */}
                    {!searched && (
                        <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                            <h3 className="mb-4 text-xl font-semibold">
                                How to find the perfect creators
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <div className="mb-2 text-2xl">🎯</div>
                                    <h4 className="mb-1 font-semibold">
                                        Choose Your Platform
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Select from Instagram, TikTok, YouTube,
                                        or Twitter to find creators
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-2 text-2xl">🔍</div>
                                    <h4 className="mb-1 font-semibold">
                                        Search by Interest
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Use keywords, hashtags, or topics
                                        relevant to your brand
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-2 text-2xl">💬</div>
                                    <h4 className="mb-1 font-semibold">
                                        Connect & Collaborate
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Reach out to creators and start building
                                        partnerships
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
