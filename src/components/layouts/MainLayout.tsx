'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSessionStore } from '@/store/useSessionStore'
import {
  Building2,
  Users,
  Calculator,
  CalendarDays,
  FileBadge,
  Landmark,
  CreditCard,
  ClipboardList,
  Ticket,
  ChevronRight,
  Database,
  Globe,
  Layers,
  User,
} from 'lucide-react'

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

/**
 * scope values:
 *   'dstax'       — DSTAX_ADMIN or DSTAX_PREPARER
 *   'dstax_admin' — DSTAX_ADMIN only
 *   'client'      — CLIENT_ADMIN or CLIENT_STAFF
 *   undefined     — visible to everyone
 */
interface NavigationItem {
  title: string
  url?: string
  icon?: React.ReactNode
  scope?: 'dstax' | 'dstax_admin' | 'client'
  items?: NavigationItem[]
}

const items: NavigationItem[] = [
  // Client roles — singular "Client" pointing to their own client dashboard
  {
    title: 'Client',
    url: '/client',
    icon: <User className="h-4 w-4" />,
    scope: 'client',
  },
  // Dstax roles — plural "Clients" list
  {
    title: 'Clients',
    url: '/clients',
    icon: <Users className="h-4 w-4" />,
    scope: 'dstax',
  },
  // Legal Entities — root level, Dstax roles
  {
    title: 'Legal Entities',
    url: '/legal-entities',
    icon: <Building2 className="h-4 w-4" />,
    scope: 'dstax',
  },
  // Users — root level, Dstax Admin only
  {
    title: 'Users',
    url: '/users',
    icon: <Users className="h-4 w-4" />,
    scope: 'dstax_admin',
  },
  // DSTax Preparer management — Dstax roles
  {
    title: 'DSTax Preparer',
    url: '/clients/dstax-preparer',
    icon: <Calculator className="h-4 w-4" />,
    scope: 'dstax',
  },
  {
    title: 'Master Data',
    icon: <Database className="h-4 w-4" />,
    scope: 'dstax',
    items: [
      {
        title: 'Jurisdictions',
        icon: <Globe className="h-4 w-4" />,
        url: '/master-data/jurisdictions',
      },
      {
        title: 'Jurisdiction Level',
        url: '/master-data/jurisdictions-level',
        icon: <Layers className="h-4 w-4" />,
      },
      {
        title: 'Filing Frequencies',
        url: '/master-data/filing-frequencies',
        icon: <CalendarDays className="h-4 w-4" />,
      },
      {
        title: 'Filing Type',
        url: '/master-data/filing-type',
        icon: <FileBadge className="h-4 w-4" />,
      },
      {
        title: 'Tax Type',
        url: '/master-data/tax-type',
        icon: <Landmark className="h-4 w-4" />,
      },
      {
        title: 'Prepayment Method',
        url: '/master-data/prepayment-method',
        icon: <CreditCard className="h-4 w-4" />,
      },
    ],
  },
  { title: 'TVRs', url: '/tvrs', icon: <ClipboardList className="h-4 w-4" /> },
  {
    title: 'Support Tickets',
    url: '/support-tickets',
    icon: <Ticket className="h-4 w-4" />,
  },
]

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
