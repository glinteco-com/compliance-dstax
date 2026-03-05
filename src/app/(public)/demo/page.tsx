'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginForm } from '@/components/login-form'
import {
  Mail,
  Settings,
  Plus,
  Trash2,
  ChevronRight,
  Loader2,
} from 'lucide-react'

export default function ShowcasePage() {
  return (
    <div className="container mx-auto space-y-16 px-4 py-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Component Showcase
        </h1>
        <p className="text-muted-foreground text-lg">
          A preview of all the core components available in the project.
        </p>
      </section>

      {/* Buttons Section */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <p className="text-muted-foreground text-sm">
            Different variants and sizes for the Button component.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Variants
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              With Icons
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
              <Button size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold">Inputs</h2>
          <p className="text-muted-foreground text-sm">
            Flexible input fields for data entry.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Input</label>
              <Input placeholder="Enter something..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                With Icon (via wrapper)
              </label>
              <div className="relative">
                <Input placeholder="Email address" className="pl-10" />
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Disabled State</label>
              <Input disabled placeholder="Cannot edit this" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Error State (aria-invalid)
              </label>
              <Input aria-invalid="true" placeholder="Invalid input" />
              <p className="text-destructive text-xs">
                This field is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complex Components */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold">Complex Components</h2>
          <p className="text-muted-foreground text-sm">
            Ready-to-use business components.
          </p>
        </div>

        <div className="bg-muted/30 flex items-center justify-center rounded-xl p-12">
          <div className="w-full max-w-md">
            <h3 className="text-muted-foreground mb-6 text-center text-sm font-medium tracking-widest uppercase">
              Login Form Component
            </h3>
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  )
}
