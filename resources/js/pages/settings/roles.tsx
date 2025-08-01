import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router } from '@inertiajs/react';
import { MoreHorizontal, Plus, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import CreateRoleDialog from '@/components/settings/create-role-dialog';
import EditRoleDialog from '@/components/settings/edit-role-dialog';
import UserRoleDialog from '@/components/settings/user-role-dialog';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    users_count?: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface Props {
    roles: Role[];
    permissions: Permission[];
    users: User[];
}

export default function RolesPage({ roles, permissions, users }: Props) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showUserDialog, setShowUserDialog] = useState(false);

    const handleDeleteRole = (roleId: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/settings/roles/${roleId}`, {
                onSuccess: () => {
                    // Success message handled by backend
                },
            });
        }
    };

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setShowEditDialog(true);
    };

    return (
        <AppLayout>
            <Head title="Roles & Permissions" />
            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Heading
                            title="Roles & Permissions"
                            description="Manage user roles and permissions for your organization"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setShowUserDialog(true)}
                                variant="outline"
                                size="sm"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Manage Users
                            </Button>
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Role
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {roles.map((role) => (
                            <Card key={role.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="w-4 h-4" />
                                        <CardTitle className="text-base">
                                            {role.name}
                                            {role.name === 'tenant_owner' && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    Protected
                                                </Badge>
                                            )}
                                        </CardTitle>
                                    </div>
                                    {role.name !== 'tenant_owner' && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEditRole(role)
                                                    }
                                                >
                                                    Edit Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteRole(role.id)
                                                    }
                                                    className="text-destructive"
                                                >
                                                    Delete Role
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Permissions ({role.permissions.length})
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {role.permissions.map(
                                                    (permission) => (
                                                        <Badge
                                                            key={permission.id}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {permission.name}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Users with this role:{' '}
                                                {
                                                    users.filter((user) =>
                                                        user.roles.some(
                                                            (r) =>
                                                                r.id === role.id
                                                        )
                                                    ).length
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {roles.length === 0 && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Shield className="w-12 h-12 text-muted-foreground mb-4" />
                                <CardTitle className="mb-2">No roles found</CardTitle>
                                <CardDescription className="text-center mb-4">
                                    Create your first role to start managing user
                                    permissions.
                                </CardDescription>
                                <Button onClick={() => setShowCreateDialog(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Role
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <CreateRoleDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    permissions={permissions}
                />

                {selectedRole && (
                    <EditRoleDialog
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                        role={selectedRole}
                        permissions={permissions}
                    />
                )}

                <UserRoleDialog
                    open={showUserDialog}
                    onOpenChange={setShowUserDialog}
                    users={users}
                    roles={roles}
                />
            </SettingsLayout>
        </AppLayout>
    );
}