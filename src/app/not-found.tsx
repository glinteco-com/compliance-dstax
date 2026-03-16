import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
          Lost in Compliance?
        </h1>
        <p className="text-muted-foreground text-lg">
          The page you are looking for doesn&apos;t exist or has been moved to a
          different jurisdiction.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-8">
            <Link href="/">Return to Dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="px-8">
            <Link href="/support-tickets">Contact Support</Link>
          </Button>
        </div>
      </div>

      {/* Decorative background glass elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-primary/10 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
