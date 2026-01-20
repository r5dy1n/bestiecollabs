import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Store, Users, MessageSquare, Shield, Handshake, Send, Search } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
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
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.is_admin;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && <NavMain items={adminNavItems} label="Admin" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
