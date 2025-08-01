import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';

type RegisterTenantForm = {
    name: string;
    domain: string;
    owner_name: string;
    owner_email: string;
};

export default function RegisterTenant() {
    const { appDomain } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<Required<RegisterTenantForm>>({
        name: '',
        domain: '',
        owner_name: '',
        owner_email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('post.register-tenant'));
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="organization"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Business name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="domain">Domain</Label>
                        <div className="flex">
                            <Input
                                id="domain"
                                type="text"
                                required
                                tabIndex={2}
                                autoComplete="off"
                                value={data.domain}
                                onChange={(e) => setData('domain', e.target.value)}
                                disabled={processing}
                                placeholder="yourcompany"
                                className="rounded-r-none"
                            />
                            <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground select-none">
                                .{appDomain}
                            </span>
                        </div>
                        <InputError message={errors.domain} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="owner_name">Owner Name</Label>
                        <Input
                            id="owner_name"
                            type="text"
                            required
                            tabIndex={3}
                            autoComplete="name"
                            value={data.owner_name}
                            onChange={(e) => setData('owner_name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.owner_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="owner_email">Owner Email</Label>
                        <Input
                            id="owner_email"
                            type="email"
                            required
                            tabIndex={4}
                            autoComplete="email"
                            value={data.owner_email}
                            onChange={(e) => setData('owner_email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.owner_email} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
