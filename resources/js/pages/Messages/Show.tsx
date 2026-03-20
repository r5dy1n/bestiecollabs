import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { FormEvent, useEffect, useRef } from 'react';

interface Sender {
    id: string;
    brand_name?: string;
    creator_name?: string;
}

interface Message {
    id: string;
    sender_id: string;
    sender_type: string;
    recipient_id: string;
    recipient_type: string;
    message_content: string;
    read_status: boolean;
    created_at: string;
    sender: Sender;
}

interface OtherParty {
    id: string;
    brand_name?: string;
    creator_name?: string;
}

interface Props {
    messages: Message[];
    otherParty: OtherParty;
    otherPartyType: string;
    currentIdentityId: string;
}

export default function Show({ messages, otherParty, otherPartyType, currentIdentityId }: Props) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Messages',
            href: '/messages',
        },
        {
            title: otherParty.brand_name || otherParty.creator_name || 'Conversation',
            href: '#',
        },
    ];

    const { data, setData, post, processing, reset, errors } = useForm({
        recipient_type: otherPartyType,
        recipient_id: otherParty.id,
        message_content: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post('/messages', {
            preserveScroll: true,
            onSuccess: () => {
                reset('message_content');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Message with ${otherParty.brand_name || otherParty.creator_name}`} />
            <div className="flex h-full flex-1 flex-col p-6">
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/messages"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-sidebar-border/70 transition-colors hover:bg-neutral-100  "
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {otherParty.brand_name || otherParty.creator_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {otherPartyType}
                        </p>
                    </div>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-white  ">
                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                        {messages.map((message) => {
                            const isCurrentUser = message.sender_id === currentIdentityId;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-3 ${
                                            isCurrentUser
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-neutral-100 text-neutral-900  '
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{message.message_content}</p>
                                        <p
                                            className={`mt-1 text-xs ${
                                                isCurrentUser
                                                    ? 'text-blue-100'
                                                    : 'text-neutral-500 '
                                            }`}
                                        >
                                            {formatDistanceToNow(new Date(message.created_at), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-sidebar-border/70 p-4 ">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <textarea
                                value={data.message_content}
                                onChange={(e) => setData('message_content', e.target.value)}
                                placeholder="Type your message..."
                                rows={3}
                                className="flex-1 rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  "
                                disabled={processing}
                            />
                            <button
                                type="submit"
                                disabled={processing || !data.message_content.trim()}
                                className="flex h-auto items-center justify-center rounded-lg bg-blue-500 px-6 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                        {errors.message_content && (
                            <p className="mt-2 text-sm text-red-500">{errors.message_content}</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
