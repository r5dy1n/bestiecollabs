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
} from '@mantine/core';
import { login, register } from '@/routes';
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
            <Box>
                <Box
                    component="header"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 50,
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Container size="xl" py="md">
                        <Group justify="space-between" align="center">
                            <Link
                                href="/"
                                style={{
                                    textDecoration: 'none',
                                    color: '#228be6',
                                }}
                            >
                                <Title order={2}>Bestie Collabs</Title>
                            </Link>
                            <nav>
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
                                        href={login()}
                                        variant="filled"
                                    >
                                        SIGN IN
                                    </Button>
                                )}
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
                                    href={canRegister ? register() : login()}
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
                                    href={canRegister ? register() : login()}
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
                                    href={canRegister ? register() : login()}
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
                                    href={canRegister ? register() : login()}
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
                    style={{ backgroundColor: '#000', color: 'white' }}
                >
                    <Container size="xl">
                        <Text size="lg" ta="center">
                            FOOTER GOES HERE
                        </Text>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
