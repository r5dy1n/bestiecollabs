import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Brand {
    id: string;
    brand_name: string;
}

interface Creator {
    id: string;
    creator_name: string;
}

interface Props {
    brands: Brand[];
    creators: Creator[];
    prefilled_brand_id?: string;
    prefilled_creator_id?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Collaborations',
        href: '/admin/collaborations',
    },
    {
        title: 'Create',
        href: '/admin/collaborations/create',
    },
];

export default function Create({ brands, creators, prefilled_brand_id, prefilled_creator_id }: Props) {
    const [brandId, setBrandId] = useState(prefilled_brand_id || '');
    const [creatorId, setCreatorId] = useState(prefilled_creator_id || '');
    const [status, setStatus] = useState<'pending' | 'active' | 'completed' | 'cancelled'>('pending');
    const [connectionType, setConnectionType] = useState<'connected' | 'unconnected'>('unconnected');
    const [collaborationType, setCollaborationType] = useState<'paid' | 'free' | 'commission' | 'product_exchange'>('commission');
    const [commissionRate, setCommissionRate] = useState('');
    const [fixedPayment, setFixedPayment] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [agreementTemplate, setAgreementTemplate] = useState('');
    const [deliverables, setDeliverables] = useState('');
    const [terms, setTerms] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [postsRequired, setPostsRequired] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/admin/collaborations', {
            brand_id: brandId,
            creator_id: creatorId,
            status,
            connection_type: connectionType,
            collaboration_type: collaborationType,
            commission_rate: commissionRate || null,
            fixed_payment: fixedPayment || null,
            currency,
            agreement_template: agreementTemplate || null,
            deliverables: deliverables || null,
            terms: terms || null,
            start_date: startDate || null,
            end_date: endDate || null,
            posts_required: postsRequired || null,
            notes: notes || null,
        }, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Collaboration" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Create New Collaboration</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Set up a new brand-creator collaboration
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Brand <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                    required
                                >
                                    <option value="">Select a brand...</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brand_id && <p className="mt-1 text-sm text-red-500">{errors.brand_id}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Creator <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={creatorId}
                                    onChange={(e) => setCreatorId(e.target.value)}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                    required
                                >
                                    <option value="">Select a creator...</option>
                                    {creators.map((creator) => (
                                        <option key={creator.id} value={creator.id}>
                                            {creator.creator_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.creator_id && <p className="mt-1 text-sm text-red-500">{errors.creator_id}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Status & Type */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Status & Type</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'pending' | 'active' | 'completed' | 'cancelled')}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Connection Type</label>
                                <select
                                    value={connectionType}
                                    onChange={(e) => setConnectionType(e.target.value as 'connected' | 'unconnected')}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                >
                                    <option value="unconnected">Unconnected</option>
                                    <option value="connected">✓ Connected</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Collaboration Type</label>
                                <select
                                    value={collaborationType}
                                    onChange={(e) => setCollaborationType(e.target.value as 'paid' | 'free' | 'commission' | 'product_exchange')}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                >
                                    <option value="commission">Commission</option>
                                    <option value="paid">Paid</option>
                                    <option value="free">Free</option>
                                    <option value="product_exchange">Product Exchange</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Payment Terms</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {collaborationType === 'commission' && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Commission Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(e.target.value)}
                                        placeholder="10.50"
                                        className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                    />
                                    {errors.commission_rate && <p className="mt-1 text-sm text-red-500">{errors.commission_rate}</p>}
                                </div>
                            )}
                            {collaborationType === 'paid' && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Fixed Payment</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={fixedPayment}
                                        onChange={(e) => setFixedPayment(e.target.value)}
                                        placeholder="500.00"
                                        className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                    />
                                    {errors.fixed_payment && <p className="mt-1 text-sm text-red-500">{errors.fixed_payment}</p>}
                                </div>
                            )}
                            <div>
                                <label className="mb-2 block text-sm font-medium">Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Timeline</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                                {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Posts Required</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={postsRequired}
                                    onChange={(e) => setPostsRequired(e.target.value)}
                                    placeholder="5"
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deliverables & Terms */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-950">
                        <h2 className="mb-4 text-lg font-semibold">Deliverables & Terms</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Deliverables</label>
                                <textarea
                                    value={deliverables}
                                    onChange={(e) => setDeliverables(e.target.value)}
                                    rows={3}
                                    placeholder="List of deliverables expected from this collaboration..."
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Terms & Conditions</label>
                                <textarea
                                    value={terms}
                                    onChange={(e) => setTerms(e.target.value)}
                                    rows={3}
                                    placeholder="Terms and conditions for this collaboration..."
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Agreement Template</label>
                                <textarea
                                    value={agreementTemplate}
                                    onChange={(e) => setAgreementTemplate(e.target.value)}
                                    rows={4}
                                    placeholder="Agreement template or contract details..."
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Internal notes about this collaboration..."
                                    className="w-full rounded-md border border-sidebar-border bg-white px-3 py-2 dark:border-sidebar-border dark:bg-neutral-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            {processing ? 'Creating...' : 'Create Collaboration'}
                        </button>
                        <Link
                            href="/admin/collaborations"
                            className="rounded-md border border-sidebar-border px-6 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-sidebar-border dark:hover:bg-neutral-800"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
