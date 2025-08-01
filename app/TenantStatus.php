<?php

namespace App;

enum TenantStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Suspended = 'suspended';

    case PendingApproval = 'pending_approval';
    case Deleted = 'deleted';

    public function isActive(): bool
    {
        return $this === self::Active;
    }

    public function isInactive(): bool
    {
        return $this === self::Inactive;
    }
}
