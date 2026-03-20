import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Brand {
    id: string;
    brand_name: string;
    website_url: string;
    category_primary: string;
    category_secondary: string | null;
    category_tertiary: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
    description: string;
    customer_age_min: number;
    customer_age_max: number;
    us_based: boolean;
    bestie_score: string;
    created_at: string;
}

interface TopMatch {
    creator: {
        id: string;
        creator_name: string;
        category_primary: string;
        description: string;
    };
    match_score: string;
}

interface Props {
    brand: Brand;
    topMatches: TopMatch[];
}

export default function Show({ brand, topMatches }: Props) {
    const { auth } = usePage().props as { auth: { user: { id: string; user_type: string } | null } };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brands',
            href: '/brands',
        },
        {
            title: brand.brand_name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={brand.brand_name} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
                    {parseFloat(brand.bestie_score) > 0 && (
                        <div className="absolute right-4 top-4">
                            <div className="rounded-full bg-black/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                                Bestie Score ⭐ {brand.bestie_score}
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl">
                        <h1 className="mb-2 text-4xl font-bold">{brand.brand_name}</h1>
                        <a
                            href={brand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-lg text-blue-600 hover:underline"
                        >
                            {brand.website_url}
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                {brand.category_primary}
                            </span>
                            {brand.category_secondary && (
                                <span className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                    {brand.category_secondary}
                                </span>
                            )}
                            {brand.category_tertiary && (
                                <span className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                    {brand.category_tertiary}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                            <h2 className="mb-4 text-2xl font-bold">About This Brand</h2>
                            <p className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                                {brand.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold">Customer Demographics</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Age Range</p>
                                    <p className="mt-1 text-lg font-semibold">
                                        {brand.customer_age_min} - {brand.customer_age_max} years
                                    </p>
                                </div>
                                <div className="border-t border-sidebar-border/70 pt-3">
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="mt-1 flex items-center gap-2">
                                        {brand.us_based ? (
                                            <>
                                                <span className="text-2xl">🇺🇸</span>
                                                <span className="font-semibold text-green-600">US Based</span>
                                            </>
                                        ) : (
                                            <span className="font-semibold text-neutral-600">International</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold">Connect</h3>
                            <div className="space-y-3">
                                <a
                                    href={brand.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Website</p>
                                        <p className="text-xs text-muted-foreground">Visit brand website</p>
                                    </div>
                                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>

                                {brand.instagram_url && (
                                    <a
                                        href={brand.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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

                                {brand.tiktok_url && (
                                    <a
                                        href={brand.tiktok_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
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
                            </div>
                        </div>

                        {auth.user?.user_type === 'creator' && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                                <Link
                                    href={`/messages/Brand/${brand.id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Send Message
                                </Link>
                            </div>
                        )}

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                            <Link
                                href="/brands"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-neutral-800"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to All Brands
                            </Link>
                        </div>
                    </div>
                </div>

                {topMatches && topMatches.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                        <h2 className="mb-6 text-2xl font-bold">Top Matched Creators</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {topMatches.map((match) => (
                                <Link
                                    key={match.creator.id}
                                    href={`/creators/${match.creator.id}`}
                                    className="group rounded-lg border border-sidebar-border/70 bg-neutral-50 p-4 transition-all hover:border-black hover:shadow-md"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="font-semibold group-hover:underline">{match.creator.creator_name}</h3>
                                        <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                            {match.match_score} Match
                                        </div>
                                    </div>
                                    <p className="mb-2 text-xs text-muted-foreground">{match.creator.category_primary}</p>
                                    <p className="line-clamp-2 text-sm text-neutral-600">
                                        {match.creator.description}
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
