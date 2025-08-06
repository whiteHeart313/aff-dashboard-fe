import { UserStatus } from '@/app/models/user';

// Default status mapping
export const UserStatusProps = {
  [UserStatus.ACTIVE]: {
    label: 'Active',
    variant: 'success',
  },
  [UserStatus.INACTIVE]: {
    label: 'Inactive',
    variant: 'warning',
  },
  [UserStatus.PENDING]: {
    label: 'Pending',
    variant: 'info',
  },
  [UserStatus.SUSPENDED]: {
    label: 'Suspended',
    variant: 'destructive',
  },
};

// Function to get status properties
export const getUserStatusProps = (status: UserStatus) => {
  return UserStatusProps[status] || { label: 'Unknown', variant: 'success' };
};
