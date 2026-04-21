'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSessionStore } from '@/store/useSessionStore'
import { ChevronRight } from 'lucide-react'
import { navigationItems, type NavigationItem } from '@/config/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from '@/components/ui/sidebar'

const items = navigationItems

function isItemVisible(
  item: NavigationItem,
  isDstaxAdmin: boolean,
  isDstaxPreparer: boolean,
  isClientAdmin: boolean,
  isClientStaff: boolean
): boolean {
  if (!item.scope) return true
  if (item.scope === 'dstax') return isDstaxAdmin || isDstaxPreparer
  if (item.scope === 'dstax_admin') return isDstaxAdmin
  if (item.scope === 'client') return isClientAdmin || isClientStaff
  return true
}

function NavMenuItem({
  item,
  pathname,
  depth = 0,
}: {
  item: NavigationItem
  pathname: string
  depth?: number
}) {
  const hasItems = item.items && item.items.length > 0
  const [isOpen, setIsOpen] = React.useState(false)

  // Auto-expand if a child is active
  React.useEffect(() => {
    if (hasItems) {
      const isChildActive = (items: NavigationItem[]): boolean => {
        return items.some(
          (child) =>
            child.url === pathname ||
            (child.items && isChildActive(child.items))
        )
      }
      if (isChildActive(item.items!)) {
        setIsOpen(true)
      }
    }
  }, [pathname, hasItems, item.items])

  const isActive = item.url === pathname

  if (hasItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-none border-l-4 px-8 py-2 hover:bg-transparent hover:text-white ${
            isOpen
              ? 'border-orange-500 text-white'
              : 'border-transparent text-[#666] hover:border-orange-500'
          }`}
        >
          {item.icon}
          <span>{item.title}</span>
          <ChevronRight
            className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub className="ml-4 border-l border-white/10">
            {item.items?.map((subItem) => (
              <NavMenuItem
                key={subItem.title}
                item={subItem}
                pathname={pathname}
                depth={depth + 1}
              />
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={item.url || '#'}
          className={`rounded-none border-l-4 px-8 py-2 hover:bg-transparent hover:text-white ${
            isActive
              ? 'border-orange-500 text-white'
              : 'border-transparent text-[#666] hover:border-orange-500'
          }`}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function AppSidebar() {
  const pathname = usePathname()
  const { user } = useSessionStore()

  const isDstaxAdmin = user?.is_dstax_admin ?? false
  const isDstaxPreparer = user?.is_dstax_preparer ?? false
  const isClientAdmin = user?.is_client_admin ?? false
  const isClientStaff = user?.is_client_staff ?? false

  const filteredItems = React.useMemo(() => {
    return items.filter((item) =>
      isItemVisible(
        item,
        isDstaxAdmin,
        isDstaxPreparer,
        isClientAdmin,
        isClientStaff
      )
    )
  }, [isDstaxAdmin, isDstaxPreparer, isClientAdmin, isClientStaff])

  return (
    <Sidebar className="border-0! bg-black">
      <SidebarContent className="bg-black">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="flex h-auto items-start justify-center p-6 text-center text-white">
            <h2 className="text-xl font-bold">DSTax</h2>
            <p className="mt-6 text-xs">Compliance</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <NavMenuItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background flex min-h-svh flex-1 flex-col">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </main>
    </SidebarProvider>
  )
}
