import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_admin?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PlatformEngagementMetrics {
    avg_likes?: number;
    avg_comments?: number;
    avg_shares?: number;
    avg_views?: number;
    avg_retweets?: number;
    avg_replies?: number;
    engagement_rate?: number;
}

export interface PlatformData {
    username: string;
    display_name?: string;
    follower_count?: number;
    following_count?: number;
    post_count?: number;
    video_count?: number;
    tweet_count?: number;
    total_likes?: number;
    total_views?: number;
    subscriber_count?: number;
    verified: boolean;
    bio?: string;
    description?: string;
    profile_picture_url?: string;
    channel_id?: string;
    channel_name?: string;
    engagement_metrics: PlatformEngagementMetrics;
    last_synced: string;
}

export interface SocialMetadata {
    instagram?: PlatformData;
    tiktok?: PlatformData;
    youtube?: PlatformData;
    twitter?: PlatformData;
}

export interface Creator {
    id: string;
    user_id?: number | null;
    creator_name: string;
    description: string;
    instagram_url: string | null;
    tiktok_url: string | null;
    youtube_url: string | null;
    twitter_url: string | null;
    category_primary: string;
    category_secondary?: string | null;
    category_tertiary?: string | null;
    followers_demographs?: any;
    follower_age_min: number;
    follower_age_max: number;
    language: string;
    us_based: boolean;
    bestie_score?: number;
    total_posts?: number;
    engagement_rate?: number;
    follower_growth_rate?: number;
    content_quality_score?: number;
    posting_frequency_days?: number;
    social_metadata: SocialMetadata | null;
    last_synced_at: string | null;
    created_at: string;
    updated_at: string;
    connected_platforms?: Record<string, boolean>;
    connection_status?: string;
}

export interface SocialSyncJob {
    id: string;
    creator_id: string;
    platform: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    sync_data?: any;
    error_message?: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SocialConnection {
    id: string;
    platform: string;
    handle: string | null;
    status: string;
    followers: number | null;
    posts_count: number | null;
    engagement_rate: number | null;
    platform_metadata: Record<string, unknown> | null;
    last_sync_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreatorProfile {
    username: string;
    display_name?: string;
    bio?: string;
    description?: string;
    profile_picture_url?: string;
    verified?: boolean;
    follower_count?: number;
    following_count?: number;
    subscriber_count?: number;
    post_count?: number;
    video_count?: number;
    tweet_count?: number;
    total_likes?: number;
    total_views?: number;
    channel_id?: string;
    channel_name?: string;
    last_synced?: string;
    engagement_metrics?: {
        avg_likes?: number;
        avg_comments?: number;
        avg_shares?: number;
        avg_views?: number;
        avg_retweets?: number;
        avg_replies?: number;
        engagement_rate?: number;
    };
}

export interface SocialSearchResult {
    username: string;
    display_name?: string;
    follower_count?: number;
    subscriber_count?: number;
    verified: boolean;
    bio?: string;
    description?: string;
    profile_picture_url?: string;
    relevance_score?: number;
    channel_id?: string;
    channel_name?: string;
}
