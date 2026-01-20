import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { index as brandsIndex, create as brandsCreate, edit as brandsEdit, destroy as brandsDestroy } from '@/actions/App/Http/Controllers/Admin/BrandController';

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
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Brand[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    brands: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Brands',
        href: brandsIndex().url,
    },
];

export default function Index({ brands }: Props) {
    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(brandsDestroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Brands</h1>
                        <p className="text-muted-foreground">Manage all brands in the platform</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/brands-import"
                            className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                        >
                            Import CSV
                        </Link>
                        <Link
                            href={brandsCreate().url}
                            className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            Add Brand
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-950">
                    <table className="w-full">
                        <thead className="border-b border-sidebar-border/70 bg-neutral-50 dark:border-sidebar-border dark:bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Brand Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Age Range</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">US Based</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {brands.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No brands found. Click "Add Brand" to create one.
                                    </td>
                                </tr>
                            ) : (
                                brands.data.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="font-medium">{brand.brand_name}</div>
                                                <a
                                                    href={brand.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-muted-foreground hover:underline"
                                                >
                                                    {brand.website_url}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                                                    {brand.category_primary}
                                                </span>
                                                {brand.category_secondary && (
                                                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                                                        {brand.category_secondary}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {brand.customer_age_min} - {brand.customer_age_max}
                                        </td>
                                        <td className="px-4 py-3">
                                            {brand.us_based ? (
                                                <span className="text-green-600 dark:text-green-400">Yes</span>
                                            ) : (
                                                <span className="text-red-600 dark:text-red-400">No</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={brandsEdit(brand.id).url}
                                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(brand.id, brand.brand_name)}
                                                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {brands.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {brands.data.length} of {brands.total} brands
                        </p>
                        <div className="flex gap-2">
                            {Array.from({ length: brands.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`${brandsIndex().url}?page=${page}`}
                                    className={`rounded px-3 py-1 text-sm ${
                                        page === brands.current_page
                                            ? 'bg-black text-white dark:bg-white dark:text-black'
                                            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
