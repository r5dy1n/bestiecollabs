import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Discount, type ShopifyConnection } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { Package, Plus, Shuffle, Tag, Truck, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface DashboardProps {
    isBrand: boolean;
    shopifyConnection: ShopifyConnection | null;
    discounts: Discount[];
    needsReauthorization: boolean;
    canCreateDiscounts: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type StatusFilter = 'all' | 'active' | 'scheduled' | 'expired';

const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'expired', label: 'Expired' },
];

function getDiscountTypeLabel(discountType: Discount['discount_type']): string {
    switch (discountType) {
        case 'amount_off_products':
            return 'Amount off products';
        case 'amount_off_order':
            return 'Amount off order';
        case 'bxgy':
            return 'Buy X Get Y';
        case 'free_shipping':
            return 'Free shipping';
    }
}

function DiscountTypeIcon({ discountType }: { discountType: Discount['discount_type'] }) {
    switch (discountType) {
        case 'amount_off_products':
            return <Tag className="size-4" />;
        case 'amount_off_order':
            return <Package className="size-4" />;
        case 'bxgy':
            return <Tag className="size-4" />;
        case 'free_shipping':
            return <Truck className="size-4" />;
    }
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'active':
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                </span>
            );
        case 'scheduled':
            return (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Scheduled
                </span>
            );
        case 'expired':
            return (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Expired
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {status}
                </span>
            );
    }
}

function CombinationsIcons({ combinesWith }: { combinesWith: Discount['combines_with'] }) {
    return (
        <div className="flex items-center gap-1.5">
            <Tag className={`size-3.5 ${combinesWith.order_discounts ? 'text-foreground' : 'text-muted-foreground/30'}`} />
            <Package className={`size-3.5 ${combinesWith.product_discounts ? 'text-foreground' : 'text-muted-foreground/30'}`} />
            <Truck className={`size-3.5 ${combinesWith.shipping_discounts ? 'text-foreground' : 'text-muted-foreground/30'}`} />
        </div>
    );
}

function ShopifyConnectCard({ shopifyConnection, needsReauthorization, flash }: { shopifyConnection: ShopifyConnection | null; needsReauthorization: boolean; flash?: DashboardProps['flash'] }) {
    const [shopDomain, setShopDomain] = useState('');
    const [connecting, setConnecting] = useState(false);

    function handleConnect(e: FormEvent) {
        e.preventDefault();
        setConnecting(true);
        router.post('/shopify/connect', { shop_domain: shopDomain }, {
            onFinish: () => setConnecting(false),
        });
    }

    function handleDisconnect() {
        router.delete('/shopify/disconnect');
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Shopify Connection</CardTitle>
                        <CardDescription>Connect your Shopify store to manage discounts.</CardDescription>
                    </div>
                    {shopifyConnection && <Badge variant="default">Connected</Badge>}
                </div>
            </CardHeader>
            <CardContent>
                {flash?.success && (
                    <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        {flash.error}
                    </div>
                )}

                {needsReauthorization && shopifyConnection && (
                    <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        Your Shopify connection needs to be updated to show all discount types. Disconnect and reconnect your store to enable full discount access.
                    </div>
                )}

                {shopifyConnection ? (
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <span className="text-muted-foreground">Store: </span>
                            <span className="font-medium">{shopifyConnection.shop_domain}</span>
                        </div>
                        <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleConnect} className="flex items-end gap-3">
                        <div className="flex-1">
                            <Label htmlFor="shop_domain">Shop Domain</Label>
                            <Input
                                id="shop_domain"
                                type="text"
                                placeholder="my-store.myshopify.com"
                                value={shopDomain}
                                onChange={(e) => setShopDomain(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={connecting}>
                            {connecting ? 'Connecting...' : 'Connect Shopify'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

function generateRandomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function CreateDiscountForm({ onClose }: { onClose: () => void }) {
    const [data, setFormData] = useState({
        title: '',
        code: '',
        value: '',
        value_type: 'percentage' as 'percentage' | 'fixed_amount',
        minimum_quantity: '',
        once_per_customer: false,
        starts_at: new Date().toISOString().split('T')[0],
        ends_at: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function setData<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/shopify/discounts', data);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            window.location.reload();
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 422) {
                const fieldErrors = error.response.data.errors ?? {};
                const flat: Record<string, string> = {};
                for (const [key, messages] of Object.entries(fieldErrors)) {
                    flat[key] = Array.isArray(messages) ? messages[0] : (messages as string);
                }
                setErrors(flat);
            }
            setProcessing(false);
        }
    }

    return (
        <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="discount-title">Title</Label>
                    <Input
                        id="discount-title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g. Summer Sale 20% Off"
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>}
                </div>

                <div>
                    <Label htmlFor="discount-code">Discount Code</Label>
                    <div className="flex gap-2">
                        <Input
                            id="discount-code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                            placeholder="e.g. SUMMER20"
                            className="flex-1 font-mono uppercase"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setData('code', generateRandomCode())}
                            title="Generate random code"
                        >
                            <Shuffle className="size-4" />
                        </Button>
                    </div>
                    {errors.code && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.code}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="discount-value">Value</Label>
                        <Input
                            id="discount-value"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            placeholder={data.value_type === 'percentage' ? 'e.g. 20' : 'e.g. 5.00'}
                        />
                        {errors.value && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.value}</p>}
                    </div>
                    <div>
                        <Label>Type</Label>
                        <Select value={data.value_type} onValueChange={(v) => setData('value_type', v as 'percentage' | 'fixed_amount')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed_amount">Fixed Amount ($)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.value_type && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.value_type}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="discount-min-qty">Minimum Quantity</Label>
                        <Input
                            id="discount-min-qty"
                            type="number"
                            min="1"
                            step="1"
                            value={data.minimum_quantity}
                            onChange={(e) => setData('minimum_quantity', e.target.value)}
                            placeholder="Optional"
                        />
                        {errors.minimum_quantity && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.minimum_quantity}</p>}
                    </div>
                    <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                                checked={data.once_per_customer}
                                onCheckedChange={(checked) => setData('once_per_customer', checked === true)}
                            />
                            Once per customer
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="discount-starts-at">Start Date</Label>
                        <Input
                            id="discount-starts-at"
                            type="date"
                            value={data.starts_at}
                            onChange={(e) => setData('starts_at', e.target.value)}
                        />
                        {errors.starts_at && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.starts_at}</p>}
                    </div>
                    <div>
                        <Label htmlFor="discount-ends-at">End Date</Label>
                        <Input
                            id="discount-ends-at"
                            type="date"
                            value={data.ends_at}
                            onChange={(e) => setData('ends_at', e.target.value)}
                            placeholder="Optional"
                        />
                        {errors.ends_at && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.ends_at}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Discount'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function DiscountsTable({ discounts, canCreateDiscounts }: { discounts: Discount[]; canCreateDiscounts: boolean }) {
    const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const filteredDiscounts = useMemo(() => {
        if (activeFilter === 'all') {
            return discounts;
        }

        return discounts.filter((d) => d.status === activeFilter);
    }, [discounts, activeFilter]);

    const filterCounts = useMemo(() => {
        const counts: Record<StatusFilter, number> = { all: discounts.length, active: 0, scheduled: 0, expired: 0 };

        for (const d of discounts) {
            if (d.status in counts) {
                counts[d.status as StatusFilter]++;
            }
        }

        return counts;
    }, [discounts]);

    if (discounts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Discounts</CardTitle>
                            <CardDescription>No discounts found in your Shopify store.</CardDescription>
                        </div>
                        {canCreateDiscounts && (
                            <Button size="sm" onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
                                <Plus className="mr-1 size-4" />
                                Create discount
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {showCreateForm ? (
                        <CreateDiscountForm onClose={() => setShowCreateForm(false)} />
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            Create discounts in your Shopify admin to see them here.
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Discounts</CardTitle>
                    {canCreateDiscounts && (
                        <Button size="sm" onClick={() => setShowCreateForm(!showCreateForm)} variant={showCreateForm ? 'outline' : 'default'}>
                            {showCreateForm ? (
                                <>
                                    <X className="mr-1 size-4" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-1 size-4" />
                                    Create discount
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {showCreateForm && (
                    <CreateDiscountForm onClose={() => setShowCreateForm(false)} />
                )}

                <div className="mb-4 flex items-center gap-1 border-b">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`relative px-3 pb-2.5 text-sm font-medium transition-colors ${
                                activeFilter === filter.key
                                    ? 'text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {filter.label}
                            {filter.key !== 'all' && filterCounts[filter.key] > 0 && (
                                <span className="text-muted-foreground ml-1 text-xs">({filterCounts[filter.key]})</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="pb-3 pr-4 font-medium">Title</th>
                                <th className="pb-3 pr-4 font-medium">Status</th>
                                <th className="pb-3 pr-4 font-medium">Method</th>
                                <th className="pb-3 pr-4 font-medium">Type</th>
                                <th className="pb-3 pr-4 font-medium">Combinations</th>
                                <th className="pb-3 text-right font-medium">Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDiscounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-muted-foreground py-8 text-center">
                                        No {activeFilter} discounts found.
                                    </td>
                                </tr>
                            ) : (
                                filteredDiscounts.map((discount) => (
                                    <tr key={discount.id} className="border-b last:border-0">
                                        <td className="py-3 pr-4">
                                            <div className="font-medium">{discount.title}</div>
                                            {discount.summary && (
                                                <div className="text-muted-foreground mt-0.5 text-xs">{discount.summary}</div>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusBadge status={discount.status} />
                                        </td>
                                        <td className="text-muted-foreground py-3 pr-4">
                                            {discount.type === 'automatic' ? 'Automatic' : 'Code'}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="text-muted-foreground flex items-center gap-1.5">
                                                <DiscountTypeIcon discountType={discount.discount_type} />
                                                <span>{getDiscountTypeLabel(discount.discount_type)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <CombinationsIcons combinesWith={discount.combines_with} />
                                        </td>
                                        <td className="py-3 text-right tabular-nums">
                                            {discount.usage_count}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function DefaultDashboard() {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20" />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20" />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20" />
                </div>
            </div>
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20" />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { isBrand, shopifyConnection, discounts, needsReauthorization, canCreateDiscounts, flash } = usePage<DashboardProps>().props;

    if (!isBrand) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <DefaultDashboard />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <ShopifyConnectCard shopifyConnection={shopifyConnection} needsReauthorization={needsReauthorization} flash={flash} />
                {shopifyConnection && <DiscountsTable discounts={discounts} canCreateDiscounts={canCreateDiscounts} />}
            </div>
        </AppLayout>
    );
}
