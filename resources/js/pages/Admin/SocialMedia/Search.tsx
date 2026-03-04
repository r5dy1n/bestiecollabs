import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface SearchResult {
    username: string;
    followers?: number;
    engagement_rate?: number;
    bio?: string;
    profile_url?: string;
    [key: string]: unknown;
}

export default function Search() {
    const [platform, setPlatform] = useState('instagram');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/admin/social-media/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ query, platform }),
            });

            const data = await response.json();
            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Social Media Search" />

            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Social Media Creator Search
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Search and import creators from social media platforms
                    </p>
                </div>

                <form onSubmit={handleSearch} className="mb-8 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium">
                                Platform
                            </label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <option value="instagram">Instagram</option>
                                <option value="tiktok">TikTok</option>
                                <option value="youtube">YouTube</option>
                                <option value="twitter">Twitter/X</option>
                            </select>
                        </div>

                        <div className="flex-[2]">
                            <label className="mb-2 block text-sm font-medium">
                                Search Query
                            </label>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter search query..."
                                className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                required
                                minLength={3}
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-black px-6 py-2 text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </form>

                {results.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950"
                            >
                                <div className="mb-4 flex items-start gap-4">
                                    {result.profile_picture_url && (
                                        <img
                                            src={result.profile_picture_url}
                                            alt={result.username}
                                            className="size-12 rounded-full"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold">
                                            {result.display_name ||
                                                result.username}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {result.username}
                                        </p>
                                    </div>
                                    {result.verified && (
                                        <span className="text-blue-500">✓</span>
                                    )}
                                </div>

                                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    {result.bio || result.description}
                                </p>

                                <div className="mb-4 text-sm">
                                    <strong>
                                        {(
                                            result.follower_count ||
                                            result.subscriber_count ||
                                            0
                                        ).toLocaleString()}
                                    </strong>{' '}
                                    {platform === 'youtube'
                                        ? 'subscribers'
                                        : 'followers'}
                                </div>

                                <form
                                    action="/admin/social-media/import"
                                    method="POST"
                                >
                                    <input
                                        type="hidden"
                                        name="_token"
                                        value={
                                            document
                                                .querySelector(
                                                    'meta[name="csrf-token"]',
                                                )
                                                ?.getAttribute('content') || ''
                                        }
                                    />
                                    <input
                                        type="hidden"
                                        name="platform"
                                        value={platform}
                                    />
                                    <input
                                        type="hidden"
                                        name="profile_data"
                                        value={JSON.stringify(result)}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        Import Creator
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}

                {results.length === 0 && !loading && query && (
                    <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            No results found. Try a different search query.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
