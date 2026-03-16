import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import type { BreadcrumbItem, CreatorProfile } from '@/types';
import AppLayout from '@/layouts/app-layout';

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

interface Props {
    username: string;
    profiles: Record<Platform, CreatorProfile | null>;
}

const platforms: { id: Platform; name: string; icon: string }[] = [
    { id: 'instagram', name: 'Instagram', icon: '\uD83D\uDCF7' },
    { id: 'tiktok', name: 'TikTok', icon: '\uD83C\uDFB5' },
    { id: 'youtube', name: 'YouTube', icon: '\uD83D\uDCFA' },
    { id: 'twitter', name: 'Twitter/X', icon: '\uD83D\uDC26' },
];

function timeAgo(isoString: string): string {
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

function formatNumber(num: number | undefined): string {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

function getExternalProfileUrl(platform: Platform, profile: CreatorProfile): string {
    const username = profile.username?.replace(/^@/, '');
    switch (platform) {
        case 'instagram':
            return `https://instagram.com/${username}`;
        case 'tiktok':
            return `https://tiktok.com/@${username}`;
        case 'youtube':
            return profile.channel_id
                ? `https://youtube.com/channel/${profile.channel_id}`
                : `https://youtube.com/@${username}`;
        case 'twitter':
            return `https://x.com/${username}`;
        default:
            return '#';
    }
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
        </div>
    );
}

function PlatformContent({ platform, profile }: { platform: Platform; profile: CreatorProfile | null }) {
    if (!profile) {
        return (
            <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-neutral-500 dark:text-neutral-400">No data available for this platform</p>
            </div>
        );
    }

    const metrics = profile.engagement_metrics;
    const displayName = profile.display_name || profile.channel_name || profile.username;
    const platformMeta = platforms.find((p) => p.id === platform);

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    {/* Avatar */}
                    {profile.profile_picture_url ? (
                        <img
                            src={profile.profile_picture_url}
                            alt={profile.username}
                            className="size-20 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
                        />
                    ) : (
                        <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100 text-3xl dark:bg-neutral-800">
                            {profile.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold">{displayName}</h2>
                            {profile.verified && (
                                <svg className="size-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            @{profile.username?.replace(/^@/, '')}
                        </p>

                        {/* Quick stats */}
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                            {(profile.follower_count || profile.subscriber_count) ? (
                                <span>
                                    <span className="font-semibold">{formatNumber(profile.follower_count || profile.subscriber_count)}</span>{' '}
                                    <span className="text-neutral-500 dark:text-neutral-400">
                                        {platform === 'youtube' ? 'subscribers' : 'followers'}
                                    </span>
                                </span>
                            ) : null}
                            {profile.following_count ? (
                                <span>
                                    <span className="font-semibold">{formatNumber(profile.following_count)}</span>{' '}
                                    <span className="text-neutral-500 dark:text-neutral-400">following</span>
                                </span>
                            ) : null}
                            {profile.post_count ? (
                                <span>
                                    <span className="font-semibold">{formatNumber(profile.post_count)}</span>{' '}
                                    <span className="text-neutral-500 dark:text-neutral-400">posts</span>
                                </span>
                            ) : null}
                            {profile.video_count ? (
                                <span>
                                    <span className="font-semibold">{formatNumber(profile.video_count)}</span>{' '}
                                    <span className="text-neutral-500 dark:text-neutral-400">videos</span>
                                </span>
                            ) : null}
                            {profile.tweet_count ? (
                                <span>
                                    <span className="font-semibold">{formatNumber(profile.tweet_count)}</span>{' '}
                                    <span className="text-neutral-500 dark:text-neutral-400">tweets</span>
                                </span>
                            ) : null}
                        </div>

                        {/* Bio */}
                        {(profile.bio || profile.description) && (
                            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                                {profile.bio || profile.description}
                            </p>
                        )}
                    </div>

                    {/* External link + last synced */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                        <a
                            href={getExternalProfileUrl(platform, profile)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-black px-6 py-2.5 text-center font-semibold text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            View on {platformMeta?.name}
                        </a>
                        {profile.last_synced && (
                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                Synced {timeAgo(profile.last_synced)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-4 text-lg font-semibold">Stats</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        label={platform === 'youtube' ? 'Subscribers' : 'Followers'}
                        value={
                            (profile.follower_count || profile.subscriber_count)
                                ? formatNumber(profile.follower_count || profile.subscriber_count)
                                : 'N/A'
                        }
                    />
                    <StatCard
                        label="Engagement Rate"
                        value={metrics?.engagement_rate != null ? `${metrics.engagement_rate.toFixed(2)}%` : 'N/A'}
                    />
                    <StatCard
                        label="Avg Likes"
                        value={metrics?.avg_likes != null ? formatNumber(metrics.avg_likes) : 'N/A'}
                    />
                    <StatCard
                        label="Avg Comments"
                        value={metrics?.avg_comments != null ? formatNumber(metrics.avg_comments) : 'N/A'}
                    />
                </div>
            </div>

            {/* Engagement Details */}
            {metrics && (metrics.avg_shares != null || metrics.avg_views != null || metrics.avg_retweets != null || metrics.avg_replies != null) && (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-4 text-lg font-semibold">Engagement Details</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {metrics.avg_shares != null && (
                            <StatCard
                                label={platform === 'twitter' ? 'Avg Retweets' : 'Avg Shares'}
                                value={formatNumber(metrics.avg_shares)}
                            />
                        )}
                        {metrics.avg_retweets != null && (
                            <StatCard label="Avg Retweets" value={formatNumber(metrics.avg_retweets)} />
                        )}
                        {metrics.avg_views != null && (
                            <StatCard label="Avg Views" value={formatNumber(metrics.avg_views)} />
                        )}
                        {metrics.avg_replies != null && (
                            <StatCard label="Avg Replies" value={formatNumber(metrics.avg_replies)} />
                        )}
                    </div>
                </div>
            )}

            {/* Content Counts */}
            {(profile.post_count != null || profile.video_count != null || profile.tweet_count != null || profile.total_views != null || profile.total_likes != null) && (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-4 text-lg font-semibold">Content</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {profile.post_count != null && (
                            <StatCard label="Posts" value={formatNumber(profile.post_count)} />
                        )}
                        {profile.video_count != null && (
                            <StatCard label="Videos" value={formatNumber(profile.video_count)} />
                        )}
                        {profile.tweet_count != null && (
                            <StatCard label="Tweets" value={formatNumber(profile.tweet_count)} />
                        )}
                        {profile.total_views != null && (
                            <StatCard label="Total Views" value={formatNumber(profile.total_views)} />
                        )}
                        {profile.total_likes != null && (
                            <StatCard label="Total Likes" value={formatNumber(profile.total_likes)} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Show({ username, profiles }: Props) {
    const [activeTab, setActiveTab] = useState<Platform>('instagram');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Find Creators', href: '/find-creators' },
        { title: 'Creator Details', href: `/find-creators/${username}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`@${username} - Creator Details`} />

            <div className="p-4 sm:p-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back link */}
                    <Link
                        href="/find-creators"
                        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Find creators
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Creator details</h1>
                        <p className="mt-1 text-neutral-500 dark:text-neutral-400">@{username}</p>
                    </div>

                    {/* Platform Tabs */}
                    <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                        {platforms.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setActiveTab(p.id)}
                                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === p.id
                                        ? 'bg-white shadow-sm dark:bg-neutral-800'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                                }`}
                            >
                                <span>{p.icon}</span>
                                {p.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <PlatformContent platform={activeTab} profile={profiles[activeTab]} />
                </div>
            </div>
        </AppLayout>
    );
}
