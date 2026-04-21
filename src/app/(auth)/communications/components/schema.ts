import { z } from 'zod'

export const communicationSchema = z.object({
  recipients: z
    .array(
      z.object({
        clientId: z.string().min(1, 'Client required'),
        legalEntityIds: z.array(z.string()),
      })
    )
    .min(1),
  subject: z.string().min(1, 'Subject required'),
  htmlContent: z.string().min(1, 'Content required'),
})

export type CommunicationFormData = z.infer<typeof communicationSchema>
