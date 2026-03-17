'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Users,
  Calculator,
  CalendarDays,
  FileBadge,
  Landmark,
  CreditCard,
  ClipboardList,
  Key,
  TrendingUp,
  GitMerge,
  Ticket,
  MessageSquare,
  ChevronRight,
  Database,
  Globe,
  Layers,
  Clock,
  Calendar,
  FolderOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Archive,
  FileText,
  User,
  LogOut,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

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
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'

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
        url: '/legal-entities',
        icon: <Building2 className="h-4 w-4" />,
      },
      { title: 'Users', url: '/users', icon: <Users className="h-4 w-4" /> },
      {
        title: 'DSTax Preparer',
        url: '/dstax-preparer',
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
        items: [
          {
            title: 'Level',
            url: '/master-data/jurisdictions/level',
            icon: <Layers className="h-4 w-4" />,
          },
          {
            title: 'Due Date',
            url: '/master-data/jurisdictions/due-date',
            icon: <Calendar className="h-4 w-4" />,
          },
          {
            title: 'Due Date Time',
            url: '/master-data/jurisdictions/due-date-time',
            icon: <Clock className="h-4 w-4" />,
          },
        ],
      },
      {
        title: 'Filing Frequencies',
        url: '/filing-frequencies',
        icon: <CalendarDays className="h-4 w-4" />,
      },
      {
        title: 'Filing Type',
        url: '/filing-type',
        icon: <FileBadge className="h-4 w-4" />,
      },
      {
        title: 'Tax Type',
        url: '/tax-type',
        icon: <Landmark className="h-4 w-4" />,
      },
      {
        title: 'Prepayment Method',
        url: '/prepayment-method',
        icon: <CreditCard className="h-4 w-4" />,
      },
    ],
  },
  { title: 'TVRs', url: '/tvrs', icon: <ClipboardList className="h-4 w-4" /> },
  {
    title: 'EFILE Credentials',
    url: '/efile-credentials',
    icon: <Key className="h-4 w-4" />,
  },
  {
    title: 'Credit Carryfowards',
    url: '/credit-carryfowards',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: 'Workflow',
    url: '/workflow',
    icon: <GitMerge className="h-4 w-4" />,
  },
  {
    title: 'Client Folders',
    icon: <FolderOpen className="h-4 w-4" />,
    items: [
      {
        title: 'Inbound Data',
        url: '/client-folders/inbound',
        icon: <ArrowDownLeft className="h-4 w-4" />,
      },
      {
        title: 'Outbound Data',
        url: '/client-folders/outbound',
        icon: <ArrowUpRight className="h-4 w-4" />,
      },
      {
        title: 'Archived Returns',
        url: '/client-folders/archived',
        icon: <Archive className="h-4 w-4" />,
      },
      {
        title: 'Client Documents',
        url: '/client-folders/documents',
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Support Tickets',
    url: '/support-tickets',
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    title: 'Communications',
    url: '/communications',
    icon: <MessageSquare className="h-4 w-4" />,
  },
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
        <a
          href={item.url}
          className={`rounded-none border-l-4 px-8 py-2 hover:bg-transparent hover:text-white ${
            isActive
              ? 'border-orange-500 text-white'
              : 'border-transparent text-[#666] hover:border-orange-500'
          }`}
        >
          {item.icon}
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="!border-0 bg-black">
      <SidebarContent className="bg-black">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="flex h-auto items-start justify-center p-6 text-center text-white">
            <h2 className="text-xl font-bold">DSTax</h2>
            <p className="mt-6 text-xs">Compliance</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
  const router = useRouter()
  const { user, signOutMutation } = useAuth()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const userName = mounted && user?.name ? user.name : 'John Doe'

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-background flex min-h-svh flex-1 flex-col">
        <div className="flex h-14 items-center justify-between gap-4 border-b px-4 lg:h-[60px]">
          <SidebarTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex cursor-pointer items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>{userName}</span>
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
        <div className="flex-1 p-4 lg:p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
