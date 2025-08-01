import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permissions: Permission[];
}

export default function CreateRoleDialog({
    open,
    onOpenChange,
    permissions,
}: Props) {
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            '/settings/roles',
            {
                name,
                permissions: selectedPermissions,
            },
            {
                onSuccess: () => {
                    setName('');
                    setSelectedPermissions([]);
                    onOpenChange(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setSelectedPermissions([...selectedPermissions, permissionName]);
        } else {
            setSelectedPermissions(
                selectedPermissions.filter((p) => p !== permissionName)
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Role</DialogTitle>
                        <DialogDescription>
                            Create a new role and assign permissions to it.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter role name..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <div className="grid gap-2 max-h-48 overflow-y-auto">
                                {permissions.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={selectedPermissions.includes(
                                                permission.name
                                            )}
                                            onCheckedChange={(checked) =>
                                                handlePermissionChange(
                                                    permission.name,
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`permission-${permission.id}`}
                                            className="text-sm font-normal"
                                        >
                                            {permission.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !name}>
                            {isSubmitting ? 'Creating...' : 'Create Role'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}