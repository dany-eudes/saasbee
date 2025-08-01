import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
    permissions: Permission[];}

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: User[];
    roles: Role[];
}

export default function UserRoleDialog({
    open,
    onOpenChange,
    users,
    roles,
}: Props) {
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedUser = users.find((u) => u.id.toString() === selectedUserId);

    const handleUserSelect = (userId: string) => {
        setSelectedUserId(userId);
        const user = users.find((u) => u.id.toString() === userId);
        if (user) {
            setSelectedRoles(user.roles.map((r) => r.name));
        }
    };

    const handleRoleChange = (roleName: string, checked: boolean) => {
        if (checked) {
            setSelectedRoles([...selectedRoles, roleName]);
        } else {
            setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;

        setIsSubmitting(true);

        router.post(
            '/settings/roles/assign',
            {
                user_id: parseInt(selectedUserId),
                roles: selectedRoles,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    setSelectedUserId('');
                    setSelectedRoles([]);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Manage User Roles</DialogTitle>
                        <DialogDescription>
                            Select a user and assign roles to them.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="user">Select User</Label>
                            <Select
                                value={selectedUserId}
                                onValueChange={handleUserSelect}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a user..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback className="text-xs">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedUser && (
                            <>
                                <div className="space-y-2">
                                    <Label>Current Roles</Label>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedUser.roles.map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="secondary"
                                            >
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Assign Roles</Label>
                                    <div className="grid gap-2 max-h-32 overflow-y-auto">
                                        {roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={selectedRoles.includes(
                                                        role.name
                                                    )}
                                                    onCheckedChange={(checked) =>
                                                        handleRoleChange(
                                                            role.name,
                                                            checked as boolean
                                                        )
                                                    }
                                                    disabled={
                                                        role.name ===
                                                            'tenant_owner' &&
                                                        selectedUser.id !==
                                                            users.find((u) =>
                                                                u.roles.some(
                                                                    (r) =>
                                                                        r.name ===
                                                                        'tenant_owner'
                                                                )
                                                            )?.id
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {role.name}
                                                    {role.name ===
                                                        'tenant_owner' && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 text-xs"
                                                        >
                                                            Protected
                                                        </Badge>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !selectedUserId}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Roles'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}