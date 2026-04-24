import {
  Building2,
  Users,
  CalendarDays,
  FileBadge,
  Landmark,
  CreditCard,
  ClipboardList,
  Ticket,
  Database,
  Globe,
  Layers,
  Mail,
  User,
  FolderOpen,
  FileKey,
  TrendingUp,
  PenLine,
  FileText,
  Send,
  Archive,
} from 'lucide-react'

/**
 * scope values:
 *   'dstax'       — DSTAX_ADMIN or DSTAX_PREPARER
 *   'dstax_admin' — DSTAX_ADMIN only
 *   'client'      — CLIENT_ADMIN or CLIENT_STAFF
 *   undefined     — visible to everyone
 */
export interface NavigationItem {
  title: string
  url?: string
  icon?: React.ReactNode
  scope?: 'dstax' | 'dstax_admin' | 'client'
  items?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
  {
    title: 'Client',
    url: '/client',
    icon: <User className="h-4 w-4" />,
    scope: 'client',
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: <Users className="h-4 w-4" />,
    scope: 'dstax',
  },
  {
    title: 'Legal Entities',
    url: '/legal-entities',
    icon: <Building2 className="h-4 w-4" />,
    scope: 'dstax',
  },
  {
    title: 'Users',
    url: '/users',
    icon: <Users className="h-4 w-4" />,
    scope: 'dstax_admin',
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
  {
    title: 'TVRs',
    icon: <ClipboardList className="h-4 w-4" />,
    items: [
      {
        title: 'TVR List',
        url: '/tvrs',
        icon: <ClipboardList className="h-4 w-4" />,
      },
      {
        title: 'EFILE',
        url: '/tvrs/efile',
        icon: <FileKey className="h-4 w-4" />,
      },
      {
        title: 'Credit Carryforwards',
        url: '/tvrs/credit-carryforwards',
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        title: 'Archived',
        url: '/tvrs/archived',
        icon: <Archive className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Client Folders',
    url: '/client-folders',
    icon: <FolderOpen className="h-4 w-4" />,
  },
  {
    title: 'Support Tickets',
    url: '/support-tickets',
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    title: 'Communications',
    icon: <Mail className="h-4 w-4" />,
    url: '/communications',
    scope: 'dstax_admin',
  },
]

export interface BreadcrumbSegment {
  title: string
  url?: string
}

function matchItems(
  pathname: string,
  navItems: NavigationItem[]
): BreadcrumbSegment[] {
  // Pass 1: try exact matches (and grouped children) before any startsWith fallback
  for (const item of navItems) {
    if (item.items) {
      const childCrumbs = matchItems(pathname, item.items)
      if (childCrumbs.length > 0) {
        return [{ title: item.title }, ...childCrumbs]
      }
    } else {
      if (item.url === pathname) {
        return [{ title: item.title, url: item.url }]
      }
    }
  }

  // Pass 2: fall back to startsWith for dynamic sub-routes
  for (const item of navItems) {
    if (item.items) {
      // Check if pathname starts with any child url (dynamic sub-routes)
      for (const child of item.items) {
        if (child.url && pathname.startsWith(child.url + '/')) {
          return [{ title: item.title }, { title: child.title, url: child.url }]
        }
      }
    } else {
      // Dynamic sub-route of a leaf item (e.g. /tvrs/123 under /tvrs)
      if (item.url && pathname.startsWith(item.url + '/')) {
        return [{ title: item.title, url: item.url }]
      }
    }
  }

  return []
}

export function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  return matchItems(pathname, navigationItems)
}
