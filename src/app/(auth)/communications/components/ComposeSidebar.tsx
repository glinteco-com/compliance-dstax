'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm, useFieldArray, FormProvider, useWatch } from 'react-hook-form'
import FormController from '@/components/form/FormController'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, PlusIcon, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import apiClient from '@/api/api-client'
import { communicationSchema, type CommunicationFormData } from './schema'
import { RecipientRow } from './RecipientRow'
import { HtmlEditor } from './HtmlEditor'
import { AttachmentDropzone } from './AttachmentDropzone'

interface ComposeSidebarProps {
  isOpen: boolean
  onClose: () => void
  draftId?: number | null
}

export function ComposeSidebar({
  isOpen,
  onClose,
  draftId,
}: ComposeSidebarProps) {
  const router = useRouter()
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)

  const form = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      recipients: [{ clientId: '', legalEntityIds: [] }],
      subject: '',
      htmlContent: '',
    },
  })

  // Reset form when opened or draftId changes
  useEffect(() => {
    if (!isOpen) return

    if (!draftId) {
      form.reset({
        recipients: [{ clientId: '', legalEntityIds: [] }],
        subject: '',
        htmlContent: '',
      })
      setAttachments([])
      return
    }

    const loadDraft = async () => {
      setIsLoadingDraft(true)
      try {
        const { data: draft } = await apiClient.get(
          `/api/core/communication/${draftId}/`,
          { baseURL: '' }
        )
        if (!draft) {
          toast.error('Draft not found')
          onClose()
          return
        }
        form.reset({
          recipients:
            draft.recipients?.length > 0
              ? draft.recipients
              : [{ clientId: '', legalEntityIds: [] }],
          subject: draft.subject,
          htmlContent: draft.html_content,
        })
      } catch {
        toast.error('Failed to load draft')
      } finally {
        setIsLoadingDraft(false)
      }
    }
    void loadDraft()
  }, [draftId, isOpen, form, onClose])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'recipients',
  })

  const recipients = useWatch({ control: form.control, name: 'recipients' })
  const filledRecipientCount = recipients.filter((r) => r.clientId).length

  const onSendEmail = form.handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        attachments: attachments.map((f) => f.name),
        is_draft: false,
      }
      await apiClient.post('/api/core/communication/', payload, { baseURL: '' })

      toast.success('Email sent successfully (Mock)')
      form.reset()
      setAttachments([])
      onClose()
    } catch {
      toast.error('Failed to send email')
    }
  })

  const onSaveAsDraft = async () => {
    const data = form.getValues()
    setIsSaving(true)
    try {
      const payload = {
        ...data,
        attachments: attachments.map((file) => file.name),
        is_draft: true,
      }
      if (draftId) {
        await apiClient.patch(`/api/core/communication/${draftId}/`, payload, {
          baseURL: '',
        })
      } else {
        await apiClient.post('/api/core/communication/', payload, {
          baseURL: '',
        })
      }

      toast.success(draftId ? 'Draft updated' : 'Draft saved')
      onClose()
    } catch {
      toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  // Intercept changing open state to handle closing correctly.
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl md:max-w-2xl"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-xl font-bold tracking-tight">
            {draftId ? 'EDIT DRAFT' : 'COMPOSE EMAIL'}
          </SheetTitle>
          <SheetDescription>
            {draftId
              ? 'Continue editing your saved draft.'
              : 'Draft and broadcast tax updates or requests.'}
          </SheetDescription>
        </SheetHeader>

        {isLoadingDraft ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="size-4 animate-spin" />
              Loading draft...
            </div>
          </div>
        ) : (
          <FormProvider {...form}>
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
                <form
                  id="compose-form"
                  onSubmit={onSendEmail}
                  className="flex flex-col gap-8"
                >
                  {/* 01 RECIPIENTS */}
                  <section>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-brand-orange-500 font-mono text-xs font-semibold tracking-widest">
                        01
                      </span>
                      <h2 className="text-sm font-semibold tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
                        RECIPIENTS
                      </h2>
                      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index) => {
                        const otherSelectedClientIds = recipients
                          .filter(
                            (_, recipientIndex) => recipientIndex !== index
                          )
                          .map((r) => r.clientId)
                          .filter(Boolean)

                        return (
                          <RecipientRow
                            key={field.id}
                            index={index}
                            remove={remove}
                            isRemovable={fields.length > 1}
                            excludedClientIds={otherSelectedClientIds}
                          />
                        )
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() =>
                        append({ clientId: '', legalEntityIds: [] })
                      }
                    >
                      <PlusIcon className="size-4" />
                      ADD RECIPIENT ROW
                    </Button>
                  </section>

                  {/* 02 DETAILS */}
                  <section>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-brand-orange-500 font-mono text-xs font-semibold tracking-widest">
                        02
                      </span>
                      <h2 className="text-sm font-semibold tracking-widest text-zinc-900 uppercase dark:text-zinc-100">
                        DETAILS
                      </h2>
                      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                    </div>

                    <div className="space-y-5">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                          SUBJECT LINE
                        </Label>
                        <Input
                          placeholder="Enter subject..."
                          {...form.register('subject')}
                          aria-invalid={!!form.formState.errors.subject}
                          className={
                            form.formState.errors.subject
                              ? 'border-destructive focus-visible:ring-destructive/20'
                              : ''
                          }
                        />
                        {form.formState.errors.subject && (
                          <p className="text-destructive text-xs font-medium">
                            {form.formState.errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                          EMAIL CONTENT
                        </Label>
                        <FormController
                          control={form.control}
                          name="htmlContent"
                          Field={HtmlEditor}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                          ATTACHMENTS
                        </Label>
                        <AttachmentDropzone
                          value={attachments}
                          onChange={setAttachments}
                        />
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* Sticky footer */}
              <div className="bg-background border-t px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-brand-navy-500 flex size-8 items-center justify-center rounded-full text-white">
                      <Users className="size-4" />
                    </div>
                    {filledRecipientCount > 0 ? (
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        +{filledRecipientCount} RECIPIENT
                        {filledRecipientCount !== 1 ? 'S' : ''} SELECTED
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No recipients selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSaveAsDraft}
                      isLoading={isSaving}
                      disabled={form.formState.isSubmitting}
                    >
                      SAVE AS DRAFT
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void onSendEmail()}
                      isLoading={form.formState.isSubmitting}
                      disabled={isSaving}
                    >
                      SEND EMAIL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </FormProvider>
        )}
      </SheetContent>
    </Sheet>
  )
}
