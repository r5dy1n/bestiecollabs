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

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Bestie Collabs" />
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

                <Box
                    component="section"
                    style={{
                        position: 'relative',
                        minHeight: '600px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                            'linear-gradient(to bottom right, rgba(30, 58, 138, 0.9), rgba(88, 28, 135, 0.9))',
                        color: 'white',
                        textAlign: 'center',
                        padding: '5rem 1.5rem',
                    }}
                >
                    <Box
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage:
                                'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.4,
                        }}
                    />
                    <Container
                        size="lg"
                        style={{ position: 'relative', zIndex: 10 }}
                    >
                        <Stack gap="xl">
                            <Title
                                order={1}
                                size="3.5rem"
                                style={{ lineHeight: 1.2 }}
                            >
                                A Commission Based Marketplace For
                                <br />
                                Brands And Creators
                            </Title>
                            <Text size="xl">
                                Brands Need Creators And Creators Need Brands.
                                Find Your Bestie Here!
                            </Text>
                            <Box>
                                <Button
                                    component={Link}
                                    href={canRegister ? '/register' : '/login'}
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                    style={{ fontSize: '1.125rem' }}
                                >
                                    FREE SIGN UP NOW
                                </Button>
                            </Box>
                        </Stack>
                    </Container>
                </Box>

                <Box component="section" py={80} px="md">
                    <Container size="xl">
                        <Stack gap="xl">
                            <Title order={2} size="2.5rem" ta="center">
                                Welcome to Bestie Collabs
                            </Title>
                            <Text
                                size="lg"
                                ta="center"
                                maw={900}
                                mx="auto"
                                c="dimmed"
                            >
                                We help Brands and Creators find their best
                                collabs. Brands should only work with Creators
                                who want to sell and Creators should never pay
                                for samples.
                            </Text>

                            <Grid gutter="lg" mt="md">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(96, 165, 250, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Our AI Finds and Matches
                                                <br />
                                                Brands and Creators
                                            </Title>
                                            <Text size="md">
                                                Sit back and relax while our AI
                                                searches and matches brands and
                                                creators based off of category
                                                and audience.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(96, 165, 250, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Automated Commissions and Payouts
                                            </Title>
                                            <Text size="md">
                                                Our platform automatically
                                                manages payouts for brands and
                                                creators.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(96, 165, 250, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Bestie Collabs Doesn't Get Paid
                                                <br />
                                                If No One Gets Paid
                                            </Title>
                                            <Text size="md">
                                                We don't charge any monthly fees
                                                and only get paid when you get
                                                paid.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(96, 165, 250, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                It's The Fairest Way To Collab
                                            </Title>
                                            <Text size="md">
                                                Brands needs Creators and
                                                Creators needs Brands. Everyone
                                                wins together.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            <Box ta="center" mt="xl">
                                <Button
                                    component={Link}
                                    href={canRegister ? '/register' : '/login'}
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                >
                                    FREE SIGN UP NOW
                                </Button>
                            </Box>
                        </Stack>
                    </Container>
                </Box>

                <Box
                    component="section"
                    py={80}
                    px="md"
                    style={{ backgroundColor: '#f8f9fa' }}
                >
                    <Container size="xl">
                        <Stack gap="xl">
                            <Title order={2} size="2.5rem" ta="center">
                                Brand Benefits
                            </Title>

                            <Grid gutter="lg">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(192, 132, 252, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                No Signup Fees
                                            </Title>
                                            <Text size="md">
                                                No sign up fees and no monthly
                                                fees. It's 100% commission based.
                                                We want to make Bestie Collabs as
                                                risk free as possible for
                                                everyone.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(192, 132, 252, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Creators Are Required
                                                <br />
                                                To Make At Least 1 Sale
                                            </Title>
                                            <Text size="md">
                                                Creators have limited sample
                                                requests and must make at least 1
                                                sale for each product to request
                                                more samples.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(192, 132, 252, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Communication And
                                                <br />
                                                Collab Management Tools
                                            </Title>
                                            <Text size="md">
                                                Brands and Creators are required
                                                to communicate before
                                                collaborating. We provide free
                                                collab management tools to help
                                                everyone succeed.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(192, 132, 252, 0.8)',
                                            color: 'white',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                AI Assisted Matching
                                                <br />
                                                For Better Results
                                            </Title>
                                            <Text size="md">
                                                Our AI matches Brands to the best
                                                Creators for their products. Set
                                                up your account today!
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            <Box ta="center" mt="xl">
                                <Button
                                    component={Link}
                                    href={canRegister ? '/register' : '/login'}
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                >
                                    FREE SIGN UP NOW
                                </Button>
                            </Box>
                        </Stack>
                    </Container>
                </Box>

                <Box component="section" py={80} px="md">
                    <Container size="xl">
                        <Stack gap="xl">
                            <Title order={2} size="2.5rem" ta="center">
                                Creator Benefits
                            </Title>

                            <Grid gutter="lg">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(147, 197, 253, 0.8)',
                                            color: '#1a202c',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                No Fees
                                            </Title>
                                            <Text size="md">
                                                No signup fees. No monthly fees.
                                                No fees for collaborating.
                                                Creators shouldn't need to pay
                                                for collabs!
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(147, 197, 253, 0.8)',
                                            color: '#1a202c',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Free Samples
                                            </Title>
                                            <Text size="md">
                                                Brands provide free samples and
                                                free shipping!
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(147, 197, 253, 0.8)',
                                            color: '#1a202c',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                Free Collab and
                                                <br />
                                                Payout Management
                                            </Title>
                                            <Text size="md">
                                                Our collab management tools helps
                                                you come up video ideas, chat
                                                with brands and manage your
                                                payouts.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card
                                        shadow="sm"
                                        padding="xl"
                                        radius="md"
                                        style={{
                                            backgroundColor:
                                                'rgba(147, 197, 253, 0.8)',
                                            color: '#1a202c',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack gap="md">
                                            <Title order={3} size="1.75rem">
                                                AI Assisted Matching
                                                <br />
                                                For Better Results
                                            </Title>
                                            <Text size="md">
                                                Our AI matches you to Brands
                                                according to your audience. Set
                                                up your account today!
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            <Box ta="center" mt="xl">
                                <Button
                                    component={Link}
                                    href={canRegister ? '/register' : '/login'}
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                >
                                    FREE SIGN UP NOW
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
                                        href={canRegister ? '/register' : '/login'}
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
