'use client'

import { useHasMounted } from '@/hooks/use-has-mounted'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useAuth from '@/hooks/useAuth'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSessionStore } from '@/store/useSessionStore'

export default function MainHeader() {
  const { user: sessionUser } = useSessionStore()
  const { signOutMutation } = useAuth()
  const router = useRouter()
  const hasMounted = useHasMounted()

  const handleLogout = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/login')
      },
    })
  }

  if (!hasMounted) return null

  const fullName =
    sessionUser?.first_name || sessionUser?.last_name
      ? `${sessionUser.first_name || ''} ${sessionUser.last_name || ''}`.trim()
      : sessionUser?.email || ''

  return (
    <div className="flex h-14 items-center justify-between gap-4 border-b px-6 py-4 lg:h-[60px]">
      <SidebarTrigger />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex cursor-pointer items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>{fullName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[250px]">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{fullName}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {sessionUser?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
