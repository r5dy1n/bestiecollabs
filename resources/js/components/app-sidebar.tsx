import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Store, Users, MessageSquare, Handshake, Send, Search, LogIn, CreditCard, Banknote, DollarSign, ArrowUpRight, FileText } from 'lucide-react';
import AppLogo from './app-logo';

const publicNavItems: NavItem[] = [
    {
        title: 'Brand Directory',
        href: '/brands',
        icon: Store,
    },
    {
        title: 'Creator Directory',
        href: '/creators',
        icon: Users,
    },
];

const authNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Brand Directory',
        href: '/brands',
        icon: Store,
    },
    {
        title: 'Creator Directory',
        href: '/creators',
        icon: Users,
    },
    {
        title: 'Find Creators',
        href: '/find-creators',
        icon: Search,
    },
    {
        title: 'Messages',
        href: '/messages',
        icon: MessageSquare,
    },
];

const brandNavItems: NavItem[] = [
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
    },
];

const creatorNavItems: NavItem[] = [
    {
        title: 'Payouts',
        href: '/payouts',
        icon: Banknote,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Manage Brands',
        href: '/admin/brands',
        icon: Store,
    },
    {
        title: 'Manage Creators',
        href: '/admin/creators',
        icon: Users,
    },
    {
        title: 'Collaborations',
        href: '/admin/collaborations',
        icon: Handshake,
    },
    {
        title: 'Outreach',
        href: '/admin/outreach',
        icon: Send,
    },
    {
        title: 'Earnings',
        href: '/admin/earnings',
        icon: DollarSign,
    },
    {
        title: 'Payouts',
        href: '/admin/payouts',
        icon: ArrowUpRight,
    },
    {
        title: 'Invoices',
        href: '/admin/invoices',
        icon: FileText,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isAdmin = auth?.user?.is_admin;
    const isBrand = auth?.user?.user_type === 'brand';
    const isCreator = auth?.user?.user_type === 'creator';

    const mainNavItems = isAuthenticated ? authNavItems : publicNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAuthenticated ? '/dashboard' : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isBrand && <NavMain items={brandNavItems} label="Billing" />}
                {isCreator && <NavMain items={creatorNavItems} label="Earnings" />}
                {isAdmin && <NavMain items={adminNavItems} label="Admin" />}
            </SidebarContent>

            <SidebarFooter>
                {isAuthenticated ? (
                    <NavUser />
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/login">
                                    <LogIn className="h-5 w-5" />
                                    <span>Sign In</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
