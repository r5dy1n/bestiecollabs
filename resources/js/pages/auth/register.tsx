import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>I am a...</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-input p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input
                                            type="radio"
                                            name="user_type"
                                            value="creator"
                                            required
                                            tabIndex={1}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">🎨</span>
                                        <span className="font-medium">
                                            Creator
                                        </span>
                                        <span className="text-center text-xs text-muted-foreground">
                                            I create content and collaborate
                                            with brands
                                        </span>
                                    </label>
                                    <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-input p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input
                                            type="radio"
                                            name="user_type"
                                            value="brand"
                                            required
                                            tabIndex={2}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl">🏢</span>
                                        <span className="font-medium">
                                            Brand
                                        </span>
                                        <span className="text-center text-xs text-muted-foreground">
                                            I work for a brand seeking creators
                                        </span>
                                    </label>
                                </div>
                                <InputError message={errors.user_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={8}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
