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

export default function MainHeader() {
  const { user, signOutMutation } = useAuth()
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
            <span>{user?.name || ''}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
