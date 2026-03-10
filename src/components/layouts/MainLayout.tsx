import * as React from 'react'
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
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

interface NavigationItem {
  title: string
  url?: string
  icon?: React.ReactNode
  scope?: string | string[] | null
  isAccordion?: boolean
}

const items: NavigationItem[] = [
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

function AppSidebar() {
  return (
    <Sidebar className="bg-black">
      <SidebarContent className="bg-black">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="flex h-auto items-start justify-center p-6 text-center text-white">
            <h2>DSTax</h2>
            <p>Compliance</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="rounded-none border-l-4 border-transparent px-8 py-2 text-[#666] hover:border-orange-500 hover:bg-transparent hover:text-white"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
        <div className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px]">
          <SidebarTrigger />
        </div>
        <div className="flex-1 p-4 lg:p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
