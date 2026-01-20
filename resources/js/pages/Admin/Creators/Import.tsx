import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface ImportError {
    row: number;
    errors: string[];
}

interface PageProps {
    errors?: {
        file?: string[];
    };
    success?: string;
    errors_data?: ImportError[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Creators',
        href: '/admin/creators',
    },
    {
        title: 'Import',
        href: '/admin/creators-import',
    },
];

export default function Import() {
    const { errors, success, errors_data } = usePage<PageProps>().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        router.post('/admin/creators-import', formData, {
            onFinish: () => setUploading(false),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Creators" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Import Creators</h1>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h2 className="mb-4 text-xl font-semibold">CSV File Upload</h2>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Upload a CSV file with the following required columns: creator_name, description, category_primary, follower_age_min, follower_age_max, language, us_based.
                            </p>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Optional columns: category_secondary, category_tertiary, instagram_url, tiktok_url.
                            </p>

                            <input
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileChange}
                                className="w-full rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 dark:border-sidebar-border dark:bg-neutral-900"
                            />
                            {errors?.file && (
                                <div className="mt-2 text-sm text-red-500">{errors.file[0]}</div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={!selectedFile || uploading}
                                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading ? 'Importing...' : 'Import Creators'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit('/admin/creators')}
                                className="rounded-lg border border-sidebar-border/70 px-6 py-2 font-medium transition-colors hover:bg-neutral-100 dark:border-sidebar-border dark:hover:bg-neutral-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                        <p className="text-green-800 dark:text-green-200">{success}</p>
                    </div>
                )}

                {errors_data && errors_data.length > 0 && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
                        <h3 className="mb-4 text-lg font-semibold text-red-800 dark:text-red-200">Import Errors</h3>
                        <div className="space-y-4">
                            {errors_data.map((error, index) => (
                                <div key={index} className="border-b border-red-200 pb-3 last:border-0 dark:border-red-900">
                                    <p className="mb-1 font-medium text-red-800 dark:text-red-200">Row {error.row}:</p>
                                    <ul className="list-inside list-disc space-y-1 text-sm text-red-700 dark:text-red-300">
                                        {error.errors.map((err, errIndex) => (
                                            <li key={errIndex}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                    <h3 className="mb-4 text-lg font-semibold">CSV Format Example</h3>
                    <div className="overflow-x-auto">
                        <pre className="rounded-lg bg-neutral-100 p-4 text-xs dark:bg-neutral-900">
{`creator_name,description,category_primary,category_secondary,category_tertiary,instagram_url,tiktok_url,follower_age_min,follower_age_max,language,us_based
Sarah Johnson,Fashion and lifestyle content creator,Fashion,Lifestyle,,https://instagram.com/sarahjohnson,https://tiktok.com/@sarahjohnson,18,35,English,1
Tech Mike,Technology reviews and tutorials,Technology,,,https://instagram.com/techmike,,25,45,English,true`}
                        </pre>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
