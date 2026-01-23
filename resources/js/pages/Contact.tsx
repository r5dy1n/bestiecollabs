import {
    Button,
    Card,
    Container,
    Stack,
    Text,
    Title,
    Group,
    Box,
    Grid,
    Anchor,
    TextInput,
    Textarea,
} from '@mantine/core';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Alert } from '@mantine/core';

interface PageProps extends SharedData {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Contact() {
    const { auth, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Contact Us - Bestie Collabs" />
            <Box className="min-h-screen bg-white dark:bg-neutral-950">
                <Box
                    component="header"
                    className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95"
                >
                    <Container size="xl" py="md">
                        <Group justify="space-between" align="center">
                            <Link
                                href="/"
                                className="text-xl font-bold text-blue-600 no-underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Bestie Collabs
                            </Link>
                            <nav>
                                <Group gap="lg">
                                    <Link
                                        href="/brands"
                                        className="text-neutral-600 no-underline hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                                    >
                                        Brands
                                    </Link>
                                    <Link
                                        href="/creators"
                                        className="text-neutral-600 no-underline hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                                    >
                                        Creators
                                    </Link>
                                    {auth.user ? (
                                        <Button
                                            component={Link}
                                            href="/dashboard"
                                            variant="filled"
                                        >
                                            Dashboard
                                        </Button>
                                    ) : (
                                        <Button
                                            component={Link}
                                            href="/login"
                                            variant="filled"
                                        >
                                            Sign In
                                        </Button>
                                    )}
                                </Group>
                            </nav>
                        </Group>
                    </Container>
                </Box>

                <Box component="section" py={80} px="md">
                    <Container size="md">
                        <Stack gap="xl">
                            <Box ta="center">
                                <Title order={1} size="3rem" className="text-neutral-900 dark:text-white">
                                    Contact Us
                                </Title>
                                <Text size="xl" mt="md" className="text-neutral-600 dark:text-neutral-400">
                                    Have questions? We'd love to hear from you.
                                </Text>
                            </Box>

                            {flash?.success && (
                                <Alert color="green" variant="light" mb="lg">
                                    {flash.success}
                                </Alert>
                            )}

                            <Card
                                shadow="sm"
                                padding="xl"
                                radius="md"
                                className="border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <Form action="/contact" method="post" resetOnSuccess>
                                    {({ processing, errors }) => (
                                        <Stack gap="lg">
                                            <Grid gutter="md">
                                                <Grid.Col span={{ base: 12, md: 6 }}>
                                                    <TextInput
                                                        label="Name"
                                                        name="name"
                                                        placeholder="Your name"
                                                        required
                                                        error={errors.name}
                                                        classNames={{
                                                            label: 'text-neutral-700 dark:text-neutral-300',
                                                            input: 'dark:bg-neutral-700 dark:border-neutral-600 dark:text-white',
                                                        }}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={{ base: 12, md: 6 }}>
                                                    <TextInput
                                                        label="Email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        required
                                                        error={errors.email}
                                                        classNames={{
                                                            label: 'text-neutral-700 dark:text-neutral-300',
                                                            input: 'dark:bg-neutral-700 dark:border-neutral-600 dark:text-white',
                                                        }}
                                                    />
                                                </Grid.Col>
                                            </Grid>

                                            <TextInput
                                                label="Subject"
                                                name="subject"
                                                placeholder="How can we help?"
                                                required
                                                error={errors.subject}
                                                classNames={{
                                                    label: 'text-neutral-700 dark:text-neutral-300',
                                                    input: 'dark:bg-neutral-700 dark:border-neutral-600 dark:text-white',
                                                }}
                                            />

                                            <Textarea
                                                label="Message"
                                                name="message"
                                                placeholder="Tell us more..."
                                                minRows={5}
                                                required
                                                error={errors.message}
                                                classNames={{
                                                    label: 'text-neutral-700 dark:text-neutral-300',
                                                    input: 'dark:bg-neutral-700 dark:border-neutral-600 dark:text-white',
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                size="lg"
                                                variant="filled"
                                                color="blue"
                                                loading={processing}
                                            >
                                                Send Message
                                            </Button>
                                        </Stack>
                                    )}
                                </Form>
                            </Card>

                            <Grid gutter="lg" mt="xl">
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <Card
                                        padding="lg"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-neutral-50 text-center dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="xs">
                                            <Text size="lg" fw={600} className="text-neutral-900 dark:text-white">
                                                Email Us
                                            </Text>
                                            <Text className="text-neutral-600 dark:text-neutral-400">
                                                hello@bestiecollabs.com
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <Card
                                        padding="lg"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-neutral-50 text-center dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="xs">
                                            <Text size="lg" fw={600} className="text-neutral-900 dark:text-white">
                                                For Brands
                                            </Text>
                                            <Text className="text-neutral-600 dark:text-neutral-400">
                                                brands@bestiecollabs.com
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <Card
                                        padding="lg"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-neutral-50 text-center dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="xs">
                                            <Text size="lg" fw={600} className="text-neutral-900 dark:text-white">
                                                For Creators
                                            </Text>
                                            <Text className="text-neutral-600 dark:text-neutral-400">
                                                creators@bestiecollabs.com
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Container>
                </Box>

                <Box
                    component="footer"
                    py={60}
                    px="md"
                    className="bg-neutral-900 text-white dark:bg-black"
                >
                    <Container size="xl">
                        <Grid gutter="xl">
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack gap="md">
                                    <Title order={3} size="1.25rem" className="text-white">
                                        Bestie Collabs
                                    </Title>
                                    <Text size="sm" className="text-neutral-400">
                                        A commission-based marketplace connecting brands and creators
                                        for successful collaborations.
                                    </Text>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 6, md: 2 }}>
                                <Stack gap="sm">
                                    <Text fw={600} className="text-white">
                                        Platform
                                    </Text>
                                    <Anchor
                                        component={Link}
                                        href="/brands"
                                        className="text-neutral-400 no-underline hover:text-white"
                                    >
                                        Brands
                                    </Anchor>
                                    <Anchor
                                        component={Link}
                                        href="/creators"
                                        className="text-neutral-400 no-underline hover:text-white"
                                    >
                                        Creators
                                    </Anchor>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 6, md: 2 }}>
                                <Stack gap="sm">
                                    <Text fw={600} className="text-white">
                                        Company
                                    </Text>
                                    <Anchor
                                        component={Link}
                                        href="/about"
                                        className="text-neutral-400 no-underline hover:text-white"
                                    >
                                        About
                                    </Anchor>
                                    <Anchor
                                        component={Link}
                                        href="/contact"
                                        className="text-neutral-400 no-underline hover:text-white"
                                    >
                                        Contact
                                    </Anchor>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack gap="sm">
                                    <Text fw={600} className="text-white">
                                        Get Started
                                    </Text>
                                    <Text size="sm" className="text-neutral-400">
                                        Ready to find your next collaboration?
                                    </Text>
                                    <Button
                                        component={Link}
                                        href="/register"
                                        variant="filled"
                                        color="blue"
                                        size="sm"
                                        className="w-fit"
                                    >
                                        Sign Up Free
                                    </Button>
                                </Stack>
                            </Grid.Col>
                        </Grid>

                        <Box
                            mt="xl"
                            pt="xl"
                            className="border-t border-neutral-700"
                        >
                            <Text size="sm" ta="center" className="text-neutral-500">
                                &copy; {new Date().getFullYear()} Bestie Collabs. All rights reserved.
                            </Text>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
