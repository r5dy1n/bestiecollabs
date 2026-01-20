import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

interface OtherParty {
    id: string;
    brand_name?: string;
    creator_name?: string;
}

interface LatestMessage {
    id: string;
    message_content: string;
    created_at: string;
    read_status: boolean;
}

interface Conversation {
    other_party: OtherParty;
    other_party_type: string;
    latest_message: LatestMessage;
    unread_count: number;
}

interface Props {
    conversations: Conversation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/messages',
    },
];

export default function Index({ conversations }: Props) {
    const getOtherPartyName = (party: OtherParty) => {
        return party.brand_name || party.creator_name || 'Unknown';
    };

    const getOtherPartyType = (type: string) => {
        return type.includes('Brand') ? 'Brand' : 'Creator';
    };

    const truncateMessage = (text: string, maxLength: number = 60) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div>
                    <h1 className="text-4xl font-bold">Messages</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        View and manage your conversations
                    </p>
                </div>

                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-sidebar-border/70 bg-white p-12  ">
                        <div className="mb-4 text-6xl">💬</div>
                        <h2 className="mb-2 text-2xl font-bold">No Messages Yet</h2>
                        <p className="text-center text-muted-foreground">
                            Start a conversation with brands or creators from their profile pages
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white  ">
                        <div className="divide-y divide-sidebar-border/70 ">
                            {conversations.map((conversation) => {
                                const otherPartyType = getOtherPartyType(conversation.other_party_type);
                                const otherPartyId = conversation.other_party.id;

                                return (
                                    <Link
                                        key={`${conversation.other_party_type}:${otherPartyId}`}
                                        href={`/messages/${otherPartyType}/${otherPartyId}`}
                                        className="flex items-center gap-4 p-4 transition-colors hover:bg-neutral-50 "
                                    >
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white">
                                            {getOtherPartyName(conversation.other_party).charAt(0).toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {getOtherPartyName(conversation.other_party)}
                                                </h3>
                                                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600  ">
                                                    {otherPartyType}
                                                </span>
                                            </div>
                                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                                {truncateMessage(conversation.latest_message.message_content)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(conversation.latest_message.created_at), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                            {conversation.unread_count > 0 && (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                                                    {conversation.unread_count}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
