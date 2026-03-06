'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User as UserIcon,
  Bell,
  ShieldCheck,
  FileText,
  BarChart3,
} from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      // Better Auth usually handles logout via /api/auth/sign-out or similar
      // But we can also just clear cookies if we want, or call the sign-out endpoint
      await fetch('/api/auth/sign-out', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="border-brand-orange-500 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="font-medium text-zinc-500">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-zinc-900 text-white">
        <div className="flex items-center gap-3 p-6">
          <div className="bg-brand-orange-500 rounded-lg p-2">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight italic">DSTax</span>
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4">
          <NavItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            active
          />
          <NavItem icon={<FileText className="h-5 w-5" />} label="Compliance" />
          <NavItem icon={<BarChart3 className="h-5 w-5" />} label="Reports" />
          <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 shadow-sm">
          <h2 className="text-lg font-semibold tracking-wider text-zinc-800 uppercase">
            Dashboard Overview
          </h2>

          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
            </button>

            <div className="mx-2 h-8 w-px bg-zinc-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">
                  {user?.name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs tracking-tighter text-zinc-500 uppercase">
                  Compliance Manager
                </p>
              </div>
              <div className="bg-brand-orange-500 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white">
                <UserIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="space-y-8 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              label="Tax Compliance Score"
              value="94%"
              trend="+2.4%"
              trendUp={true}
              color="text-emerald-600"
            />
            <StatCard
              label="Pending Audits"
              value="12"
              trend="-3"
              trendUp={true} // Fewer pending is better
              color="text-brand-orange-500"
            />
            <StatCard
              label="Risk Assessment"
              value="Low"
              trend="Stable"
              trendUp={null}
              color="text-zinc-900"
            />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900">
                Welcome back, {user?.name || user?.email}!
              </h3>
              <Button className="bg-brand-orange-500 hover:bg-brand-orange-600 rounded-lg px-6 text-white">
                Start New Audit
              </Button>
            </div>
            <p className="max-w-2xl leading-relaxed text-zinc-600">
              Your compliance profile is currently up to date. We&apos;ve
              identified 3 new regulations that may affect your next quarterly
              report for the DSTax project. Review the alerts in your inbox for
              detailed implications.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
        active
          ? 'bg-brand-orange-500 shadow-brand-orange-500/20 text-white shadow-lg'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </a>
  )
}

function StatCard({
  label,
  value,
  trend,
  trendUp,
  color,
}: {
  label: string
  value: string
  trend: string
  trendUp: boolean | null
  color: string
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="mb-2 text-sm font-medium tracking-wider text-zinc-500 uppercase">
        {label}
      </p>
      <div className="flex items-baseline justify-between">
        <h4 className={`text-3xl font-bold ${color}`}>{value}</h4>
        {trendUp !== null && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${
              trendUp
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
