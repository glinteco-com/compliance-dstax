'use client'

import * as React from 'react'
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  Mail,
  Lock,
  Search,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CommonSelect } from '@/components/select/CommonSelect'
import { CommonTable } from '@/components/table/CommonTable'
import { InputDatePicker } from '@/components/date-picker/date-picker'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import CommonTooltip from '@/components/tooltip/CommonTooltip'
import useDialog from '@/hooks/useDialog'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'

export default function DemoPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const { isOpenDialog, onOpenDialog, onCloseDialog, setIsOpenDialog } =
    useDialog()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    onCloseDialog()
  }

  const tableData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'Pending',
    },
  ]

  const tableColumns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    {
      id: 'status',
      label: 'Status',
      render: (item: any) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            item.status === 'Active'
              ? 'bg-emerald-100 text-emerald-700'
              : item.status === 'Inactive'
                ? 'bg-zinc-100 text-zinc-700'
                : 'bg-amber-100 text-amber-700'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      id: 'actions',
      label: '',
      align: 'right' as const,
      render: () => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const frameworks = [
    'Next.js',
    'SvelteKit',
    'Nuxt.js',
    'Remix',
    'Astro',
  ] as const
  const anchor = useComboboxAnchor()

  return (
    <div className="min-h-screen space-y-12 bg-slate-50 p-8 dark:bg-zinc-950">
      <header className="mx-auto max-w-6xl border-b pb-6">
        <h1 className="bg-linear-to-r from-orange-600 to-orange-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent italic">
          DSTax Design System
        </h1>
        <p className="mt-2 text-lg text-zinc-500">
          Living documentation of our core UI components, variants, and design
          tokens.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Buttons{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              interactive
            </span>
          </h2>
          <Card className="border-none shadow-sm ring-1 ring-zinc-200">
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Our standard button styles for various actions.
              </CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon-sm">
                  <Settings className="size-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default Size</Button>
                <Button size="lg">Large Scale</Button>
                <Button
                  size="icon"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button isLoading>Loading State</Button>
                <Button isActive variant="outline">
                  Active State
                </Button>
                <Button disabled>Disabled State</Button>
                <Button
                  variant="default"
                  className="border-none bg-linear-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-amber-600"
                >
                  Gradient Primary
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* INPUTS SECTION */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Enhanced Inputs{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              built-in features
            </span>
          </h2>
          <Card className="border-none shadow-sm ring-1 ring-zinc-200">
            <CardContent className="space-y-4 p-6">
              <Input
                label="Base Text Input"
                placeholder="Type something..."
                prefixIcon={<Mail className="size-4" />}
              />
              <PasswordInput
                label="Password Input"
                placeholder="Enter secure password"
                error="Password must be at least 8 characters"
              />
              <div className="grid grid-cols-1 gap-4">
                <InputDatePicker
                  label="Basic DatePicker"
                  value={date?.toISOString().split('T')[0]}
                  onChange={(val) => setDate(val ? new Date(val) : undefined)}
                />
                <InputDatePicker
                  label="DateTime Picker"
                  showTimeSelect
                  placeholder="Select date and time"
                />
              </div>
              <CommonSelect
                label="CommonSelect"
                placeholder="Choose an option"
                options={[
                  { value: 'opt1', label: 'Production Server' },
                  { value: 'opt2', label: 'Staging Environment' },
                ]}
              />
              <Combobox
                multiple
                autoHighlight
                items={frameworks}
                defaultValue={[frameworks[0]]}
              >
                <ComboboxChips ref={anchor} className="w-full max-w-xs">
                  <ComboboxValue>
                    {(values) => (
                      <React.Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput />
                      </React.Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Textarea
                label="Text Area"
                placeholder="Detailed notes go here..."
                rows={3}
                suffixIcon={<Edit2 className="size-4" />}
              />
            </CardContent>
          </Card>
        </section>

        {/* FORMS & FIELDS SECTION */}
        <section className="col-span-1 space-y-6 md:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Forms & Fields{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              structured layout
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200">
              <CardHeader>
                <CardTitle>Field Composition</CardTitle>
                <CardDescription>
                  Using the Field component for advanced layouts and states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <FieldContent>
                      <Input placeholder="John Doe" />
                      <FieldDescription>
                        Enter your legal name as it appears on tax documents.
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field orientation="horizontal">
                    <FieldLabel>Enable Notifications</FieldLabel>
                    <FieldContent className="flex justify-end">
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </FieldContent>
                  </Field>

                  <Field data-invalid="true">
                    <FieldLabel>Username</FieldLabel>
                    <FieldContent>
                      <Input defaultValue="johndoe!" />
                      <FieldError
                        errors={[
                          { message: 'Username contains invalid characters.' },
                        ]}
                      />
                    </FieldContent>
                  </Field>
                </FieldGroup>

                <FieldSeparator>Optional Information</FieldSeparator>

                <FieldSet>
                  <FieldLegend>Security Settings</FieldLegend>
                  <Field orientation="responsive">
                    <FieldLabel>Two-Factor Auth</FieldLabel>
                    <FieldContent>
                      <CommonSelect
                        options={[
                          { value: 'sms', label: 'SMS' },
                          { value: 'app', label: 'Authenticator App' },
                        ]}
                        placeholder="Select method"
                      />
                    </FieldContent>
                  </Field>
                </FieldSet>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200">
              <CardHeader>
                <CardTitle>Input Groups</CardTitle>
                <CardDescription>
                  Flexible input combinations with icons, text, and buttons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Search with Button</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <Search className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search records..." />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton variant="default">
                        Search
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="space-y-2">
                  <Label>URL Prefix</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>https://</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="example.com" />
                  </InputGroup>
                </div>

                <div className="space-y-2">
                  <Label>Textarea with Actions</Label>
                  <InputGroup>
                    <InputGroupTextarea
                      placeholder="Write a message..."
                      className="min-h-24"
                    />
                    <InputGroupAddon
                      align="block-end"
                      className="justify-end border-t bg-zinc-50/50"
                    >
                      <InputGroupButton variant="ghost" size="icon-xs">
                        <Trash2 className="size-4" />
                      </InputGroupButton>
                      <InputGroupButton variant="default">
                        Send Message
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* DATA DISPLAY SECTION */}
        <section className="col-span-1 space-y-6 md:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Tables & Lists{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              structured data
            </span>
          </h2>
          <Card className="overflow-hidden border-none shadow-sm ring-1 ring-zinc-200">
            {/* <CommonTable 
               columns={tableColumns} 
               data={tableData} 
               emptyMessage="No entries found in system"
             /> */}
          </Card>
        </section>

        {/* OVERLAYS & FEEDBACK */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Modals & Overlays{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              contextual
            </span>
          </h2>
          <Card className="border-none shadow-sm ring-1 ring-zinc-200">
            <CardContent className="flex flex-wrap gap-4 p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Standard Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>System Configuration</DialogTitle>
                    <DialogDescription>
                      Apply changes to global compliance settings?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="rounded-md border border-dashed bg-zinc-50 p-4 text-sm text-zinc-600">
                    Current environment:{' '}
                    <span className="bg-white px-1 font-mono">US-NORTH-1</span>
                  </div>
                  <DialogFooter>
                    <Button variant="default">Save Configuration</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="destructive" onClick={onOpenDialog}>
                ConfirmDialog (Hook)
              </Button>

              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <Button variant="outline">Right Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Entity Details</DrawerTitle>
                    <DrawerDescription>
                      Extended information for selected legal entity.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="space-y-6 p-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                        <div className="w-full space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full">
                        Close Drawer
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="mr-2 h-4 w-4" /> Context Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" /> View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Advanced Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>Workflow Info</PopoverTitle>
                    <PopoverDescription>
                      Current status of the automated compliance check.
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Last verified:</span>
                      <span className="font-medium text-emerald-600">
                        Passed
                      </span>
                    </div>
                    <Separator />
                    <Button size="sm" className="w-full">
                      View Full Report
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </section>

        {/* FEEDBACK & TOOLTIPS */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Feedback{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              informative
            </span>
          </h2>
          <Card className="border-none shadow-sm ring-1 ring-zinc-200">
            <CardContent className="space-y-8 p-6">
              <div className="flex items-center gap-4">
                <Label>Standard Tooltip:</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-8 w-8 cursor-help items-center justify-center rounded bg-zinc-100 transition-colors hover:bg-zinc-200">
                      ?
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Detailed help information content.
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-4">
                <Label>CommonTooltip:</Label>
                <CommonTooltip content="Action cannot be undone">
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CommonTooltip>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Skeleton Loaders:</Label>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CALENDAR SECTION */}
        <section className="col-span-1 space-y-6 md:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            Calendar{' '}
            <span className="rounded bg-orange-100 px-2 py-0.5 text-sm font-normal text-orange-600">
              scheduling
            </span>
          </h2>
          <Card className="border-none p-6 shadow-sm ring-1 ring-zinc-200">
            <div className="flex flex-col items-start justify-center gap-12 md:flex-row">
              <div className="rounded-md border bg-white p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </div>
              <div className="w-full max-w-sm space-y-4 rounded-lg bg-zinc-900 p-6 font-mono text-sm text-zinc-400 shadow-2xl">
                <div className="text-emerald-400">
                  {'// Selected Date State'}
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-400">const</span> [date, setDate]
                  = useState()
                </div>
                <div>
                  Selected:{' '}
                  <span className="text-white">{date?.toDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl border-t py-12 text-center text-sm text-zinc-400">
        DSTax Design System &copy; 2026. All rights reserved.
      </footer>

      {/* Global Dialog Instance for hook demo */}
      <ConfirmDialog
        isOpen={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        variant="delete"
        title="Confirm Permanent Deletion"
        description="This will remove the selected tax record from our encrypted storage. This action is irreversible."
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}
