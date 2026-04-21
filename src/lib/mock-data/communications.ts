export interface CommunicationRecord {
  id: number
  subject: string
  html_content: string
  created_at: string
  updated_at: string
  sent_at?: string
  is_draft: boolean
  recipients: { clientId: string; legalEntityIds: string[] }[]
}

export const MOCK_DRAFTS: CommunicationRecord[] = [
  {
    id: 1,
    subject: 'Preliminary Tax Report - Q1 2024',
    html_content:
      '<p>Please find the preliminary tax report for Q1 2024 attached.</p>',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:30:00Z',
    is_draft: true,
    recipients: [{ clientId: '1', legalEntityIds: ['1', '2'] }],
  },
  {
    id: 2,
    subject: 'Compliance Update: New Regulatory Requirements',
    html_content:
      '<p>Important update regarding the new regulatory requirements in Jurisdiction X.</p>',
    created_at: '2024-03-21T09:15:00Z',
    updated_at: '2024-03-21T09:45:00Z',
    is_draft: true,
    recipients: [{ clientId: '2', legalEntityIds: ['3'] }],
  },
  {
    id: 3,
    subject: 'Quarterly Review Reminder',
    html_content:
      '<p>This is a reminder for the upcoming quarterly review meeting.</p>',
    created_at: '2024-03-22T14:00:00Z',
    updated_at: '2024-03-22T14:10:00Z',
    is_draft: true,
    recipients: [{ clientId: '3', legalEntityIds: ['4', '5', '6'] }],
  },
]

export const MOCK_SENT: CommunicationRecord[] = [
  {
    id: 101,
    subject: 'February 2024 Compliance Certificate',
    html_content:
      '<p>The compliance certificate for February 2024 has been issued.</p>',
    created_at: '2024-02-28T08:00:00Z',
    updated_at: '2024-02-28T09:00:00Z',
    sent_at: '2024-02-28T09:05:00Z',
    is_draft: false,
    recipients: [{ clientId: '1', legalEntityIds: ['1'] }],
  },
  {
    id: 102,
    subject: 'System Maintenance Advisory',
    html_content:
      '<p>Scheduled system maintenance will take place this weekend.</p>',
    created_at: '2024-03-15T15:00:00Z',
    updated_at: '2024-03-15T15:30:00Z',
    sent_at: '2024-03-15T16:00:00Z',
    is_draft: false,
    recipients: [
      { clientId: '1', legalEntityIds: ['1', '2'] },
      { clientId: '2', legalEntityIds: ['3'] },
    ],
  },
  {
    id: 103,
    subject: 'Annual Regulatory Filing Update',
    html_content:
      '<p>Please review the updated requirements for the annual regulatory filing.</p>',
    created_at: '2024-03-18T10:00:00Z',
    updated_at: '2024-03-18T10:15:00Z',
    sent_at: '2024-03-18T10:30:00Z',
    is_draft: false,
    recipients: [{ clientId: '3', legalEntityIds: ['4', '5', '6', '7', '8'] }],
  },
]
