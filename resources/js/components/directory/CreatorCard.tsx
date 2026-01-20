import { Link } from '@inertiajs/react';

interface Creator {
    id: string;
    creator_name: string;
    description: string;
    instagram_url: string | null;
    tiktok_url: string | null;
    category_primary: string;
    category_secondary: string | null;
    category_tertiary: string | null;
    follower_age_min: number;
    follower_age_max: number;
    language: string;
    us_based: boolean;
    bestie_score: string;
    connection_status: 'connected' | 'unconnected';
}

interface CreatorCardProps {
    creator: Creator;
}

export default function CreatorCard({ creator }: CreatorCardProps) {
    const truncateDescription = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-white transition-all hover:shadow-lg dark:border-sidebar-border dark:bg-neutral-950">
            <div className="absolute right-2 top-2 z-10 flex gap-2">
                {creator.connection_status === 'connected' && (
                    <div className="rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        ✓ Connected
                    </div>
                )}
                {parseFloat(creator.bestie_score) > 0 && (
                    <div className="rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm dark:bg-white/80 dark:text-black">
                        Bestie ⭐ {creator.bestie_score}
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <Link
                        href={`/creators/${creator.id}`}
                        className="text-xl font-bold hover:underline"
                    >
                        {creator.creator_name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{truncateDescription(creator.description)}</p>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
                        {creator.category_primary}
                    </span>
                    {creator.category_secondary && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
                            {creator.category_secondary}
                        </span>
                    )}
                    {creator.category_tertiary && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
                            {creator.category_tertiary}
                        </span>
                    )}
                </div>

                <div className="mb-4 space-y-2 border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Follower Age</span>
                        <span className="font-medium">
                            {creator.follower_age_min}-{creator.follower_age_max}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Language</span>
                        <span className="font-medium">{creator.language}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">US Based</span>
                        <span className={creator.us_based ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium text-red-600 dark:text-red-400'}>
                            {creator.us_based ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {creator.instagram_url && (
                        <a
                            href={creator.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                            title="Instagram"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    )}
                    {creator.tiktok_url && (
                        <a
                            href={creator.tiktok_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                            title="TikTok"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>

            <div className="border-t border-sidebar-border/70 bg-neutral-50 px-6 py-4 dark:border-sidebar-border dark:bg-neutral-900">
                <Link
                    href={`/creators/${creator.id}`}
                    className="flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
