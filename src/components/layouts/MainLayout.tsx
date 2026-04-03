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
  // Key,
  // TrendingUp,
  // GitMerge,
  Ticket,
  // MessageSquare,
  ChevronRight,
  Database,
  Globe,
  Layers,
  // Clock,
  // Calendar,
  // FolderOpen,
  // ArrowDownLeft,
  // ArrowUpRight,
  // Archive,
  // FileText,
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

interface NavigationItem {
  title: string
  url?: string
  icon?: React.ReactNode
  scope?: string | string[] | null
  items?: NavigationItem[]
}

const items: NavigationItem[] = [
  {
    title: 'Clients',
    icon: <Users className="h-4 w-4" />,
    items: [
      {
        title: 'Legal Entities',
        url: '/clients/legal-entities',
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        title: 'Users',
        url: '/clients/users',
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: 'DSTax Preparer',
        url: '/clients/dstax-preparer',
        icon: <Calculator className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Master Data',
    icon: <Database className="h-4 w-4" />,
    items: [
      {
        title: 'Jurisdictions',
        icon: <Globe className="h-4 w-4" />,
        url: '/master-data/jurisdictions',
        // items: [
        //   {
        //     title: 'Due Date',
        //     url: '/master-data/jurisdictions/due-date',
        //     icon: <Calendar className="h-4 w-4" />,
        //   },
        //   {
        //     title: 'Due Date Time',
        //     url: '/master-data/jurisdictions/due-date-time',
        //     icon: <Clock className="h-4 w-4" />,
        //   },
        // ],
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
  // {
  //   title: 'EFILE Credentials',
  //   url: '/efile-credentials',
  //   icon: <Key className="h-4 w-4" />,
  // },
  // {
  //   title: 'Credit Carryfowards',
  //   url: '/credit-carryfowards',
  //   icon: <TrendingUp className="h-4 w-4" />,
  // },
  // {
  //   title: 'Workflow',
  //   url: '/workflow',
  //   icon: <GitMerge className="h-4 w-4" />,
  // },
  // {
  //   title: 'Client Folders',
  //   icon: <FolderOpen className="h-4 w-4" />,
  //   items: [
  //     {
  //       title: 'Inbound Data',
  //       url: '/client-folders/inbound',
  //       icon: <ArrowDownLeft className="h-4 w-4" />,
  //     },
  //     {
  //       title: 'Outbound Data',
  //       url: '/client-folders/outbound',
  //       icon: <ArrowUpRight className="h-4 w-4" />,
  //     },
  //     {
  //       title: 'Archived Returns',
  //       url: '/client-folders/archived',
  //       icon: <Archive className="h-4 w-4" />,
  //     },
  //     {
  //       title: 'Client Documents',
  //       url: '/client-folders/documents',
  //       icon: <FileText className="h-4 w-4" />,
  //     },
  //   ],
  // },
  {
    title: 'Support Tickets',
    url: '/support-tickets',
    icon: <Ticket className="h-4 w-4" />,
  },
  // {
  //   title: 'Communications',
  //   url: '/communications',
  //   icon: <MessageSquare className="h-4 w-4" />,
  // },
]

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

  const filteredItems = React.useMemo(() => {
    if (!user) return items

    return items.map((item) => {
      if (item.title === 'Clients' && item.items) {
        return {
          ...item,
          items: item.items.filter((subItem) => {
            if (
              user.is_dstax_preparer &&
              (subItem.title === 'Users' || subItem.title === 'DSTax Preparer')
            ) {
              return false
            }
            return true
          }),
        }
      }
      return item
    })
  }, [user])

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
