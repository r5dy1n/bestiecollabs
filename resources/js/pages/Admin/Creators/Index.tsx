import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { index as creatorsIndex, create as creatorsCreate, edit as creatorsEdit, destroy as creatorsDestroy } from '@/actions/App/Http/Controllers/Admin/CreatorController';

interface Creator {
    id: string;
    creator_name: string;
    category_primary: string;
    category_secondary: string | null;
    follower_age_min: number;
    follower_age_max: number;
    language: string;
    us_based: boolean;
    instagram_url: string | null;
    tiktok_url: string | null;
}

interface PaginatedData {
    data: Creator[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    creators: PaginatedData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Creators',
        href: creatorsIndex().url,
    },
];

export default function Index({ creators }: Props) {
    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            router.delete(creatorsDestroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Creators" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Creators</h1>
                        <p className="text-muted-foreground">Manage all creators in the platform</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/creators-import"
                            className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
                        >
                            Import CSV
                        </Link>
                        <Link
                            href={creatorsCreate().url}
                            className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            Add Creator
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-950">
                    <table className="w-full">
                        <thead className="border-b border-sidebar-border/70 bg-neutral-50 dark:border-sidebar-border dark:bg-neutral-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Creator Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Follower Age</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Language</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">US Based</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {creators.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No creators found. Click "Add Creator" to create one.
                                    </td>
                                </tr>
                            ) : (
                                creators.data.map((creator) => (
                                    <tr key={creator.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{creator.creator_name}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                                                    {creator.category_primary}
                                                </span>
                                                {creator.category_secondary && (
                                                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                                                        {creator.category_secondary}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {creator.follower_age_min} - {creator.follower_age_max}
                                        </td>
                                        <td className="px-4 py-3 text-sm">{creator.language}</td>
                                        <td className="px-4 py-3">
                                            {creator.us_based ? (
                                                <span className="text-green-600 dark:text-green-400">Yes</span>
                                            ) : (
                                                <span className="text-red-600 dark:text-red-400">No</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={creatorsEdit(creator.id).url}
                                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(creator.id, creator.creator_name)}
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

                {creators.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {creators.data.length} of {creators.total} creators
                        </p>
                        <div className="flex gap-2">
                            {Array.from({ length: creators.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`${creatorsIndex().url}?page=${page}`}
                                    className={`rounded px-3 py-1 text-sm ${
                                        page === creators.current_page
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
