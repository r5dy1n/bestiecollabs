import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import type { Creator } from '@/types';

interface Props {
    creator: Creator;
}

export default function SocialAccounts({ creator }: Props) {
    const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
        null,
    );
    const [platformUrl, setPlatformUrl] = useState('');

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: '📷' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵' },
        { id: 'youtube', name: 'YouTube', icon: '📺' },
        { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    ];

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!connectingPlatform) return;

        router.post(
            '/settings/social-accounts/connect',
            {
                platform: connectingPlatform,
                url: platformUrl,
            },
            {
                onSuccess: () => {
                    setConnectingPlatform(null);
                    setPlatformUrl('');
                },
            },
        );
    };

    const handleDisconnect = (platform: string) => {
        if (
            confirm(
                `Are you sure you want to disconnect your ${platform} account?`,
            )
        ) {
            router.delete(`/settings/social-accounts/${platform}`);
        }
    };

    const handleSync = (platform: string) => {
        router.post(`/settings/social-accounts/${platform}/sync`);
    };

    const isConnected = (platform: string) => {
        const urlField = `${platform}_url` as keyof Creator;
        return !!creator[urlField];
    };

    const getPlatformData = (platform: string) => {
        return creator.social_metadata?.[
            platform as keyof typeof creator.social_metadata
        ];
    };

    const formatNumber = (num: number | undefined) => {
        if (!num) return '0';
        return num.toLocaleString();
    };

    return (
        <>
            <Head title="Social Accounts" />

            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Social Accounts</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Connect and manage your social media accounts
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {platforms.map((platform) => {
                        const connected = isConnected(platform.id);
                        const data = getPlatformData(platform.id);

                        return (
                            <div
                                key={platform.id}
                                className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">
                                            {platform.icon}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold">
                                                {platform.name}
                                            </h3>
                                            {connected && data && (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                    @{data.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs ${
                                            connected
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
                                        }`}
                                    >
                                        {connected ? 'Connected' : 'Not connected'}
                                    </span>
                                </div>

                                {connected && data ? (
                                    <>
                                        <div className="mb-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-600 dark:text-neutral-400">
                                                    {platform.id === 'youtube'
                                                        ? 'Subscribers'
                                                        : 'Followers'}
                                                </span>
                                                <span className="font-semibold">
                                                    {formatNumber(
                                                        data.follower_count ||
                                                            data.subscriber_count,
                                                    )}
                                                </span>
                                            </div>
                                            {data.engagement_metrics && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 dark:text-neutral-400">
                                                        Engagement Rate
                                                    </span>
                                                    <span className="font-semibold">
                                                        {data.engagement_metrics
                                                            .engagement_rate
                                                            ? `${data.engagement_metrics.engagement_rate.toFixed(2)}%`
                                                            : 'N/A'}
                                                    </span>
                                                </div>
                                            )}
                                            {data.last_synced && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600 dark:text-neutral-400">
                                                        Last Synced
                                                    </span>
                                                    <span className="text-neutral-600 dark:text-neutral-400">
                                                        {new Date(
                                                            data.last_synced,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleSync(platform.id)
                                                }
                                                className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                                            >
                                                Sync Now
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDisconnect(platform.id)
                                                }
                                                className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    </>
                                ) : connectingPlatform === platform.id ? (
                                    <form onSubmit={handleConnect}>
                                        <input
                                            type="url"
                                            value={platformUrl}
                                            onChange={(e) =>
                                                setPlatformUrl(e.target.value)
                                            }
                                            placeholder={`Enter your ${platform.name} profile URL`}
                                            className="mb-2 w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                            >
                                                Connect
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConnectingPlatform(null)
                                                }
                                                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setConnectingPlatform(platform.id)
                                        }
                                        className="w-full rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        Connect {platform.name}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
