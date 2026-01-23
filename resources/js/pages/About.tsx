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
} from '@mantine/core';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function About() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="About Us - Bestie Collabs" />
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
                    <Container size="lg">
                        <Stack gap="xl">
                            <Box ta="center">
                                <Title order={1} size="3rem" className="text-neutral-900 dark:text-white">
                                    About Bestie Collabs
                                </Title>
                                <Text size="xl" mt="md" className="text-neutral-600 dark:text-neutral-400">
                                    We're on a mission to make brand-creator collaborations fair for everyone.
                                </Text>
                            </Box>

                            <Grid gutter="xl" mt="xl">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="md">
                                            <Title order={3} className="text-neutral-900 dark:text-white">
                                                Our Mission
                                            </Title>
                                            <Text className="text-neutral-600 dark:text-neutral-300">
                                                Bestie Collabs was founded with a simple belief: brands need creators
                                                and creators need brands. We created a platform where both parties
                                                can collaborate fairly, without upfront fees or risk.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="md">
                                            <Title order={3} className="text-neutral-900 dark:text-white">
                                                How It Works
                                            </Title>
                                            <Text className="text-neutral-600 dark:text-neutral-300">
                                                Our platform uses AI to match brands with creators based on category
                                                and audience. We handle all the logistics including communication,
                                                collaboration management, and automated payouts.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="md">
                                            <Title order={3} className="text-neutral-900 dark:text-white">
                                                For Brands
                                            </Title>
                                            <Text className="text-neutral-600 dark:text-neutral-300">
                                                No signup fees, no monthly fees. We operate on a 100% commission basis,
                                                meaning we only get paid when you get paid. Find creators who are
                                                genuinely motivated to sell your products.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        className="h-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        <Stack gap="md">
                                            <Title order={3} className="text-neutral-900 dark:text-white">
                                                For Creators
                                            </Title>
                                            <Text className="text-neutral-600 dark:text-neutral-300">
                                                No fees of any kind. Get free samples and free shipping from brands.
                                                Use our collaboration management tools to plan content, communicate
                                                with brands, and manage your payouts.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            <Box ta="center" mt="xl">
                                <Button
                                    component={Link}
                                    href="/register"
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                >
                                    Join Bestie Collabs Today
                                </Button>
                            </Box>
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
