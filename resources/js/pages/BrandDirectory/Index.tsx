import AppLayout from '@/layouts/app-layout';
import BrandCard from '@/components/directory/BrandCard';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

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
}

interface PaginatedData {
    data: Brand[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    category?: string;
    age_min?: number;
    age_max?: number;
    sort?: string;
}

interface Props {
    brands: PaginatedData;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brands',
        href: '/brands',
    },
];

export default function Index({ brands, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [ageMin, setAgeMin] = useState(filters.age_min?.toString() || '');
    const [ageMax, setAgeMax] = useState(filters.age_max?.toString() || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();

        router.get('/brands', {
            search: search || undefined,
            category: category || undefined,
            age_min: ageMin || undefined,
            age_max: ageMax || undefined,
            sort: sort !== 'latest' ? sort : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setAgeMin('');
        setAgeMax('');
        setSort('latest');
        router.get('/brands');
    };

    const hasActiveFilters = search || category || ageMin || ageMax || sort !== 'latest';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brand Directory" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Discover Brands</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Connect with amazing brands looking for creators like you
                    </p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Search</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Brand name or description..."
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Fitness">Fitness</option>
                                    <option value="Food">Food</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Home">Home</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Customer Age Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={ageMin}
                                        onChange={(e) => setAgeMin(e.target.value)}
                                        placeholder="Min"
                                        min="18"
                                        max="100"
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        value={ageMax}
                                        onChange={(e) => setAgeMax(e.target.value)}
                                        placeholder="Max"
                                        min="18"
                                        max="100"
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Sort By</label>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="bestie_score">Bestie Score</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                Apply Filters
                            </button>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="rounded-lg border border-sidebar-border/70 px-6 py-2 font-medium transition-colors hover:bg-neutral-100"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {brands.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-sidebar-border/70 bg-white p-12">
                        <div className="mb-4 text-6xl">🏪</div>
                        <h2 className="mb-2 text-2xl font-bold">No Brands Yet</h2>
                        <p className="text-center text-muted-foreground">
                            Check back soon! We're onboarding amazing brands every day.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {brands.data.map((brand) => (
                                <BrandCard key={brand.id} brand={brand} />
                            ))}
                        </div>

                        {brands.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {brands.current_page > 1 && (
                                    <Link
                                        href={`/brands?page=${brands.current_page - 1}`}
                                        className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                                    >
                                        Previous
                                    </Link>
                                )}

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(brands.last_page, 5) }, (_, i) => {
                                        let page;
                                        if (brands.last_page <= 5) {
                                            page = i + 1;
                                        } else if (brands.current_page <= 3) {
                                            page = i + 1;
                                        } else if (brands.current_page >= brands.last_page - 2) {
                                            page = brands.last_page - 4 + i;
                                        } else {
                                            page = brands.current_page - 2 + i;
                                        }

                                        return (
                                            <Link
                                                key={page}
                                                href={`/brands?page=${page}`}
                                                className={`rounded-md px-4 py-2 text-sm ${
                                                    page === brands.current_page
                                                        ? 'bg-black text-white'
                                                        : 'border border-neutral-300 hover:bg-neutral-50'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {brands.current_page < brands.last_page && (
                                    <Link
                                        href={`/brands?page=${brands.current_page + 1}`}
                                        className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="text-center text-sm text-muted-foreground">
                            Showing {brands.data.length} of {brands.total} brands
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
