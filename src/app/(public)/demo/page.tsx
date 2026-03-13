'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginForm } from '@/app/(public)/login/login-form'
import {
  Mail,
  Settings,
  Plus,
  Trash2,
  ChevronRight,
  Loader2,
} from 'lucide-react'

export default function ShowcasePage() {
  const colors = {
    brand: {
      orange: {
        50: '#fff8f1',
        100: '#feecdb',
        200: '#fdd9b8',
        300: '#fbc08a',
        400: '#f99c52',
        500: '#f96c00',
        600: '#e06200',
        700: '#ba5100',
        800: '#934100',
        900: '#793604',
        950: '#411a01',
      },
      navy: {
        50: '#f5f6f8',
        100: '#e9edf1',
        200: '#ccd6e0',
        300: '#9fb2c5',
        400: '#6b89a6',
        500: '#2d3a56',
        600: '#374c6e',
        700: '#2d3d5a',
        800: '#28344b',
        900: '#252d3f',
        950: '#181d29',
      },
      gray: {
        50: '#f7f8f9',
        100: '#eeeff2',
        200: '#d9dde4',
        300: '#b9bfcd',
        400: '#8f98af',
        500: '#6b7b9b',
        600: '#556484',
        700: '#45516b',
        800: '#3b445a',
        900: '#343c4f',
        950: '#232834',
      },
    },
  }

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

      {/* Colors Section */}
      <section className="space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold">Color Palette</h2>
          <p className="text-muted-foreground text-sm">
            Brand colors defined in the tailwind configuration.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(colors.brand).map(([colorName, shades]) => (
            <div key={colorName} className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium tracking-wider capitalize">
                {colorName}
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-11">
                {Object.entries(shades).map(([shade, hex]) => (
                  <div key={shade} className="space-y-1.5">
                    <div
                      className="h-12 w-full rounded-md border shadow-sm"
                      style={{ backgroundColor: hex }}
                      title={`${colorName}-${shade}: ${hex}`}
                    />
                    <div className="text-center text-xs font-medium">
                      {shade}
                    </div>
                    <div className="text-muted-foreground text-center text-[10px] uppercase">
                      {hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
