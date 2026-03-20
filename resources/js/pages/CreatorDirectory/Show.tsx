import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface PlatformMetadata {
    follower_count?: number;
    post_count?: number;
    engagement_metrics?: {
        avg_likes?: number;
        avg_comments?: number;
        engagement_rate?: number;
    };
    verified?: boolean;
    last_synced?: string;
}

interface SocialMetadata {
    instagram?: PlatformMetadata;
    tiktok?: PlatformMetadata;
    youtube?: PlatformMetadata;
    twitter?: PlatformMetadata;
}

interface SocialConnectionData {
    platform: string;
    handle: string | null;
    followers: number | null;
    posts_count: number | null;
    engagement_rate: string | null;
    last_sync_at: string | null;
}

interface Creator {
    id: string;
    creator_name: string;
    description: string;
    instagram_url: string | null;
    tiktok_url: string | null;
    youtube_url: string | null;
    twitter_url: string | null;
    category_primary: string;
    category_secondary: string | null;
    category_tertiary: string | null;
    followers_demographs: any;
    follower_age_min: number;
    follower_age_max: number;
    language: string;
    us_based: boolean;
    bestie_score: string;
    engagement_rate: string | null;
    total_posts: number | null;
    follower_growth_rate: string | null;
    social_metadata: SocialMetadata | null;
    created_at: string;
}

interface TopMatch {
    brand: {
        id: string;
        brand_name: string;
        category_primary: string;
        description: string;
    };
    match_score: string;
}

interface Props {
    creator: Creator;
    topMatches: TopMatch[];
    socialConnections?: Record<string, SocialConnectionData>;
}

function formatNumber(num: number): string {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toLocaleString();
}

export default function Show({ creator, topMatches, socialConnections }: Props) {
    const { auth } = usePage().props as { auth: { user: { id: string; user_type: string } | null } };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Creators',
            href: '/creators',
        },
        {
            title: creator.creator_name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={creator.creator_name} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-purple-50 to-pink-50 p-8   ">
                    {parseFloat(creator.bestie_score) > 0 && (
                        <div className="absolute right-4 top-4">
                            <div className="rounded-full bg-black/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm  ">
                                Bestie Score ⭐ {creator.bestie_score}
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl">
                        <h1 className="mb-2 text-4xl font-bold">{creator.creator_name}</h1>
                        <p className="text-lg text-neutral-600 ">
                            {creator.language} Content Creator
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur-sm ">
                                {creator.category_primary}
                            </span>
                            {creator.category_secondary && (
                                <span className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur-sm ">
                                    {creator.category_secondary}
                                </span>
                            )}
                            {creator.category_tertiary && (
                                <span className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur-sm ">
                                    {creator.category_tertiary}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6  ">
                            <h2 className="mb-4 text-2xl font-bold">About</h2>
                            <p className="whitespace-pre-wrap leading-relaxed text-neutral-700 ">
                                {creator.description}
                            </p>
                        </div>

                        {creator.followers_demographs && (
                            <div className="mt-6 rounded-xl border border-sidebar-border/70 bg-white p-6  ">
                                <h2 className="mb-4 text-2xl font-bold">Audience Demographics</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {creator.followers_demographs.instagram && (
                                        <div>
                                            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                                                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                                                    </svg>
                                                </div>
                                                Instagram
                                            </h3>
                                            <div className="space-y-2">
                                                {creator.followers_demographs.instagram.gender && (
                                                    <div className="rounded-lg bg-neutral-50 p-3 ">
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Gender Split</p>
                                                        <div className="flex gap-3">
                                                            <span className="text-sm">
                                                                👨 {creator.followers_demographs.instagram.gender.male}%
                                                            </span>
                                                            <span className="text-sm">
                                                                👩 {creator.followers_demographs.instagram.gender.female}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                {creator.followers_demographs.instagram.locations && (
                                                    <div className="rounded-lg bg-neutral-50 p-3 ">
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Location</p>
                                                        <div className="text-sm">
                                                            🇺🇸 US: {creator.followers_demographs.instagram.locations.US}%
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {creator.followers_demographs.tiktok && (
                                        <div>
                                            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white">
                                                    <svg className="h-4 w-4 text-white " fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                    </svg>
                                                </div>
                                                TikTok
                                            </h3>
                                            <div className="space-y-2">
                                                {creator.followers_demographs.tiktok.gender && (
                                                    <div className="rounded-lg bg-neutral-50 p-3 ">
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Gender Split</p>
                                                        <div className="flex gap-3">
                                                            <span className="text-sm">
                                                                👨 {creator.followers_demographs.tiktok.gender.male}%
                                                            </span>
                                                            <span className="text-sm">
                                                                👩 {creator.followers_demographs.tiktok.gender.female}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                {creator.followers_demographs.tiktok.locations && (
                                                    <div className="rounded-lg bg-neutral-50 p-3 ">
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground">Location</p>
                                                        <div className="text-sm">
                                                            🇺🇸 US: {creator.followers_demographs.tiktok.locations.US}%
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:bg-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">Creator Info</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Language</p>
                                    <p className="mt-1 text-lg font-semibold">{creator.language}</p>
                                </div>
                                <div className="border-t border-sidebar-border/70 pt-3">
                                    <p className="text-sm text-muted-foreground">Follower Age Range</p>
                                    <p className="mt-1 text-lg font-semibold">
                                        {creator.follower_age_min} - {creator.follower_age_max} years
                                    </p>
                                </div>
                                <div className="border-t border-sidebar-border/70 pt-3">
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="mt-1 flex items-center gap-2">
                                        {creator.us_based ? (
                                            <>
                                                <span className="text-2xl">🇺🇸</span>
                                                <span className="font-semibold text-green-600">US Based</span>
                                            </>
                                        ) : (
                                            <span className="font-semibold text-neutral-600 dark:text-neutral-400">International</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {creator.social_metadata && Object.keys(creator.social_metadata).length > 0 && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:bg-neutral-900">
                                <h3 className="mb-4 text-lg font-semibold">Social Media Stats</h3>
                                <div className="space-y-4">
                                    {creator.social_metadata.instagram && (
                                        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                                                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-semibold">Instagram</span>
                                                {creator.social_metadata.instagram.verified && (
                                                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {socialConnections?.instagram && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Connected</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {creator.social_metadata.instagram.follower_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Followers</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.instagram.follower_count)}</p>
                                                    </div>
                                                )}
                                                {creator.social_metadata.instagram.post_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Posts</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.instagram.post_count)}</p>
                                                    </div>
                                                )}
                                                {creator.social_metadata.instagram.engagement_metrics?.engagement_rate != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Engagement</p>
                                                        <p className="text-lg font-bold">{creator.social_metadata.instagram.engagement_metrics.engagement_rate.toFixed(2)}%</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {creator.social_metadata.tiktok && (
                                        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white">
                                                    <svg className="h-4 w-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-semibold">TikTok</span>
                                                {creator.social_metadata.tiktok.verified && (
                                                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {socialConnections?.tiktok && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Connected</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {creator.social_metadata.tiktok.follower_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Followers</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.tiktok.follower_count)}</p>
                                                    </div>
                                                )}
                                                {creator.social_metadata.tiktok.post_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Posts</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.tiktok.post_count)}</p>
                                                    </div>
                                                )}
                                                {creator.social_metadata.tiktok.engagement_metrics?.engagement_rate != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Engagement</p>
                                                        <p className="text-lg font-bold">{creator.social_metadata.tiktok.engagement_metrics.engagement_rate.toFixed(2)}%</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {creator.social_metadata.youtube && (
                                        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                                                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-semibold">YouTube</span>
                                                {creator.social_metadata.youtube.verified && (
                                                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {socialConnections?.youtube && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Connected</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {creator.social_metadata.youtube.follower_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Subscribers</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.youtube.follower_count)}</p>
                                                    </div>
                                                )}
                                                {creator.social_metadata.youtube.post_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Videos</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.youtube.post_count)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {creator.social_metadata.twitter && (
                                        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white">
                                                    <svg className="h-4 w-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-semibold">X / Twitter</span>
                                                {creator.social_metadata.twitter.verified && (
                                                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {socialConnections?.twitter && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">Connected</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {creator.social_metadata.twitter.follower_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Followers</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.twitter.follower_count)}</p>
                                                    </div>
                                                )}
                                                {creator.social_metadata.twitter.post_count != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Posts</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.social_metadata.twitter.post_count)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(creator.engagement_rate || creator.total_posts || creator.follower_growth_rate) && (
                                        <div className="border-t border-sidebar-border/70 pt-3">
                                            <p className="mb-2 text-xs font-medium text-muted-foreground">Overall</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {creator.engagement_rate && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Avg Engagement</p>
                                                        <p className="text-lg font-bold">{creator.engagement_rate}%</p>
                                                    </div>
                                                )}
                                                {creator.total_posts != null && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Total Posts</p>
                                                        <p className="text-lg font-bold">{formatNumber(creator.total_posts)}</p>
                                                    </div>
                                                )}
                                                {creator.follower_growth_rate && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Growth Rate</p>
                                                        <p className="text-lg font-bold">{creator.follower_growth_rate}%</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:bg-neutral-900">
                            <h3 className="mb-4 text-lg font-semibold">Connect</h3>
                            <div className="space-y-3">
                                {creator.instagram_url && (
                                    <a
                                        href={creator.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Instagram</p>
                                            <p className="text-xs text-muted-foreground">Follow on Instagram</p>
                                        </div>
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}

                                {creator.tiktok_url && (
                                    <a
                                        href={creator.tiktok_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white">
                                            <svg className="h-5 w-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">TikTok</p>
                                            <p className="text-xs text-muted-foreground">Follow on TikTok</p>
                                        </div>
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}

                                {creator.youtube_url && (
                                    <a
                                        href={creator.youtube_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">YouTube</p>
                                            <p className="text-xs text-muted-foreground">Subscribe on YouTube</p>
                                        </div>
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}

                                {creator.twitter_url && (
                                    <a
                                        href={creator.twitter_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white">
                                            <svg className="h-5 w-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">X / Twitter</p>
                                            <p className="text-xs text-muted-foreground">Follow on X</p>
                                        </div>
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        {auth.user?.user_type === 'brand' && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6  ">
                                <Link
                                    href={`/messages/Creator/${creator.id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Send Message
                                </Link>
                            </div>
                        )}

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6  ">
                            <Link
                                href="/creators"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white  "
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to All Creators
                            </Link>
                        </div>
                    </div>
                </div>

                {topMatches && topMatches.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6  ">
                        <h2 className="mb-6 text-2xl font-bold">Top Matched Brands</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {topMatches.map((match) => (
                                <Link
                                    key={match.brand.id}
                                    href={`/brands/${match.brand.id}`}
                                    className="group rounded-lg border border-sidebar-border/70 bg-neutral-50 p-4 transition-all hover:border-black hover:shadow-md   "
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="font-semibold group-hover:underline">{match.brand.brand_name}</h3>
                                        <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700  ">
                                            {match.match_score} Match
                                        </div>
                                    </div>
                                    <p className="mb-2 text-xs text-muted-foreground">{match.brand.category_primary}</p>
                                    <p className="line-clamp-2 text-sm text-neutral-600 ">
                                        {match.brand.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
