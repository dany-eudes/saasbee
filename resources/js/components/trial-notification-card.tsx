import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Subscription } from '@/types';
import { Link } from '@inertiajs/react';
import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrialNotificationCardProps {
    subscription: Subscription | null;
}

const DISMISS_STORAGE_KEY = 'trial-notification-dismissed';
const DISMISS_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function TrialNotificationCard({ subscription }: TrialNotificationCardProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!subscription?.on_trial) {
            setIsVisible(false);
            return;
        }

        const checkVisibility = () => {
            const dismissedTime = localStorage.getItem(DISMISS_STORAGE_KEY);
            if (!dismissedTime) {
                setIsVisible(true);
                return;
            }

            const dismissedAt = parseInt(dismissedTime, 10);
            const now = Date.now();

            if (now - dismissedAt >= DISMISS_DURATION) {
                localStorage.removeItem(DISMISS_STORAGE_KEY);
                setIsVisible(true);
            }
        };

        checkVisibility();

        // Set up interval to check every minute if we should show the card again
        const interval = setInterval(checkVisibility, 60000);

        return () => clearInterval(interval);
    }, [subscription]);

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
        setIsVisible(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getDaysRemaining = (trialEndsAt: string) => {
        const endDate = new Date(trialEndsAt);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    if (!isVisible || !subscription?.on_trial || !subscription.trial_ends_at) {
        return null;
    }

    const daysRemaining = getDaysRemaining(subscription.trial_ends_at);

    return (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm animate-in slide-in-from-bottom-2">
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            <CardTitle className="text-sm font-semibold text-orange-900">Trial Active</CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-100">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription className="text-orange-700">
                        {daysRemaining > 0 ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining` : 'Trial ends today'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <Alert className="border-orange-200 bg-orange-50/50">
                        <AlertDescription className="text-sm text-orange-800">
                            Your trial ends on {formatDate(subscription.trial_ends_at)}. Subscribe to continue using all features.
                        </AlertDescription>
                    </Alert>
                    <div className="mt-3 flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                            <Link href="/settings/billing">Subscribe Now</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDismiss}>
                            Remind Later
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
