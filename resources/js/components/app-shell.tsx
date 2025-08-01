import TrialNotificationCard from '@/components/trial-notification-card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const { sidebarOpen, subscription } = usePage<SharedData>().props;

    const content = (
        <>
            {children}
            <TrialNotificationCard subscription={subscription || null} />
        </>
    );

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{content}</div>;
    }

    return <SidebarProvider defaultOpen={sidebarOpen}>{content}</SidebarProvider>;
}
