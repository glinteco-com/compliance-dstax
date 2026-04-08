import type { Me } from '@/models/me'
import { useSessionStore } from '@/store/useSessionStore'

// --- Pure functions (accept a Me object) ---

export function isDstaxAdmin(user: Me | null | undefined): boolean {
  return user?.is_dstax_admin ?? false
}

export function isDstaxPreparer(user: Me | null | undefined): boolean {
  return user?.is_dstax_preparer ?? false
}

export function isClientAdmin(user: Me | null | undefined): boolean {
  return user?.is_client_admin ?? false
}

export function isClientStaff(user: Me | null | undefined): boolean {
  return user?.is_client_staff ?? false
}

export function isDstaxRole(user: Me | null | undefined): boolean {
  return isDstaxAdmin(user) || isDstaxPreparer(user)
}

export function isClientRole(user: Me | null | undefined): boolean {
  return isClientAdmin(user) || isClientStaff(user)
}

// --- React hook (reads from session store) ---

export function useRole() {
  const user = useSessionStore((s) => s.user)
  const isSessionLoading = useSessionStore((s) => s.isSessionLoading)

  return {
    user,
    isSessionLoading,
    isDstaxAdmin: isDstaxAdmin(user),
    isDstaxPreparer: isDstaxPreparer(user),
    isClientAdmin: isClientAdmin(user),
    isClientStaff: isClientStaff(user),
    isDstaxRole: isDstaxRole(user),
    isClientRole: isClientRole(user),
  }
}
