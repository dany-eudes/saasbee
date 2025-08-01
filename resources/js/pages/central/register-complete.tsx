import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

export default function RegisterTenantComplete() {
    return (
        <AuthLayout title="Registration Complete" description="Thank you for registering! Your account is now pending approval.">
            <Head title="Registration Complete" />
            <div className="space-y-4">
                <p className="text-lg font-semibold">Your account has been created successfully!</p>
                <p>
                    Your registration is now pending approval by an administrator. You will receive an email notification once your account has been
                    reviewed and everything is set up.
                </p>
                <p>
                    Please check your inbox for further instructions. If you do not receive an email within a reasonable time, feel free to contact
                    support.
                </p>
            </div>
        </AuthLayout>
    );
}
