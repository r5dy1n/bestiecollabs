import { Link } from '@inertiajs/react';

interface DirectoryCard {
    shop_name: string;
    price_range: string;
    items_sold_30day: number;
    customer_gender: string | null;
    match_score: string;
}

interface TopCreatorMatch {
    creator_name: string;
    match_score: string;
}

interface Brand {
    id: string;
    brand_name: string;
    website_url: string;
    category_primary: string;
    category_secondary: string | null;
    category_tertiary: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
    customer_age_min: number;
    customer_age_max: number;
    bestie_score: string;
    connection_status: 'connected' | 'unconnected';
    directory_card: DirectoryCard | null;
    top_creator_matches: TopCreatorMatch[];
}

interface BrandCardProps {
    brand: Brand;
}

const avatarColors = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-rose-500',
];

function getAvatarColor(name: string): string {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();
}

function extractInstagramHandle(url: string | null): string | null {
    if (!url) {
        return null;
    }
    const match = url.match(/instagram\.com\/([^/?#]+)/);
    return match ? `@${match[1]}` : null;
}

function extractTiktokHandle(url: string | null): string | null {
    if (!url) {
        return null;
    }
    const match = url.match(/tiktok\.com\/@?([^/?#]+)/);
    return match ? `@${match[1].replace('@', '')}` : null;
}

function formatGmv(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
}

export default function BrandCard({ brand }: BrandCardProps) {
    const card = brand.directory_card;
    const shopName = card?.shop_name ?? brand.brand_name;
    const igHandle = extractInstagramHandle(brand.instagram_url);
    const tiktokHandle = extractTiktokHandle(brand.tiktok_url);
    const initials = getInitials(shopName);
    const avatarColor = getAvatarColor(shopName);
    const bestiScore = parseFloat(brand.bestie_score);
    const matchScore = card ? parseFloat(card.match_score) : 0;

    const categories = [brand.category_primary, brand.category_secondary, brand.category_tertiary].filter(Boolean);

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-white transition-all hover:shadow-lg dark:border-sidebar-border dark:bg-neutral-950">
            {/* Top badges row */}
            <div className="flex items-center justify-between px-3 pt-3">
                <div className="min-h-[28px]">
                    {bestiScore > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white dark:bg-white/80 dark:text-black">
                            ⭐ {brand.bestie_score}
                        </span>
                    )}
                </div>
                <div className="min-h-[28px]">
                    {matchScore > 0 && (
                        <span className="inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                            {Math.round(matchScore * 100)}% Match
                        </span>
                    )}
                    {brand.connection_status === 'connected' && (
                        <span className="ml-1 inline-flex items-center rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white">
                            ✓ Connected
                        </span>
                    )}
                </div>
            </div>

            {/* Creator banner */}
            {brand.top_creator_matches.length > 0 && (
                <div className="mt-2 overflow-x-auto px-3 pb-1">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Suggested Creators
                    </p>
                    <div className="flex gap-2">
                        {brand.top_creator_matches.map((match, index) => (
                            <div
                                key={index}
                                className="flex shrink-0 items-center gap-1.5 rounded-full border border-sidebar-border/70 bg-neutral-50 px-2.5 py-1 dark:border-sidebar-border dark:bg-neutral-900"
                            >
                                <span className="text-xs font-medium">{match.creator_name}</span>
                                <span className="text-[10px] font-semibold text-violet-600">
                                    {Math.round(parseFloat(match.match_score) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Logo + Shop Name + Website */}
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${avatarColor}`}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <Link href={`/brands/${brand.id}`} className="block truncate font-bold hover:underline">
                            {shopName}
                        </Link>
                        <a
                            href={brand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-xs text-muted-foreground hover:underline"
                        >
                            {brand.website_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                    </div>
                </div>

                {/* Price Range + 30 Day GMV */}
                {card && (
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Price Range</p>
                            <p className="mt-0.5 font-semibold">{card.price_range}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">30 Day GMV</p>
                            <p className="mt-0.5 font-semibold">{formatGmv(card.items_sold_30day)}</p>
                        </div>
                    </div>
                )}

                {/* Social Handles */}
                {(tiktokHandle || igHandle) && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {tiktokHandle && (
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                                <a
                                    href={brand.tiktok_url!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-xs font-medium hover:underline"
                                >
                                    {tiktokHandle}
                                </a>
                            </div>
                        )}
                        {igHandle && (
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <a
                                    href={brand.instagram_url!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-xs font-medium hover:underline"
                                >
                                    {igHandle}
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Customer Age + Gender */}
                <div className="flex items-center gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Age </span>
                        <span className="font-medium">
                            {brand.customer_age_min}–{brand.customer_age_max}
                        </span>
                    </div>
                    {card?.customer_gender && (
                        <div>
                            <span className="text-muted-foreground">Gender </span>
                            <span className="font-medium">{card.customer_gender}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-sidebar-border/70 bg-neutral-50 px-4 py-3 dark:border-sidebar-border dark:bg-neutral-900">
                <Link
                    href={`/brands/${brand.id}`}
                    className="flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
