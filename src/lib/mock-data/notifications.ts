export type Notification = {
  id: string
  title: string
  message: string
  createdAt: string
  isRead: boolean
  type: 'info' | 'warning' | 'success' | 'error'
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'TVR Period Opened',
    message:
      'The Q1 2026 TVR period has been opened for submissions. Please ensure all returns are filed before the deadline.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Return Approved',
    message:
      'The tax return for Acme Corp (TY2025) has been approved and submitted to the revenue authority.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Missing Documentation',
    message:
      'Blue Ridge Holdings is missing supporting documents for 3 line items. Review required before filing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isRead: false,
    type: 'warning',
  },
  {
    id: '4',
    title: 'E-File Rejected',
    message:
      'The e-file submission for Sunrise Ventures (TY2025) was rejected. Error code: ERR-4021. Please review and resubmit.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
    type: 'error',
  },
  {
    id: '5',
    title: 'Credit Carryforward Applied',
    message:
      'A credit carryforward of $14,250 has been applied to the 2026 return for Metro Financial Group.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true,
    type: 'success',
  },
  {
    id: '6',
    title: 'Deadline Reminder',
    message:
      'Filing deadline for Q4 2025 returns is in 7 days. 4 clients still have pending submissions.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    isRead: false,
    type: 'warning',
  },
  {
    id: '7',
    title: 'New Client Added',
    message:
      'Pinnacle Industries has been added to your client portfolio by DSTax Admin.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    type: 'info',
  },
  {
    id: '8',
    title: 'Return Draft Saved',
    message:
      'Your draft for Coastal Properties LLC (TY2025) was auto-saved successfully.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    isRead: true,
    type: 'success',
  },
  {
    id: '9',
    title: 'System Maintenance',
    message:
      'Scheduled maintenance on 2026-04-26 from 02:00–04:00 UTC. The platform will be unavailable during this window.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    isRead: false,
    type: 'warning',
  },
  {
    id: '10',
    title: 'Validation Error Detected',
    message:
      'Automated validation found mismatched totals in the TVR for Summit Logistics. Manual review required.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
    type: 'error',
  },
  {
    id: '11',
    title: 'Return Submitted',
    message:
      'The Q4 2025 return for Harbor Freight Co. has been successfully submitted to the authority.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    isRead: true,
    type: 'success',
  },
  {
    id: '12',
    title: 'Client Profile Updated',
    message:
      'Contact details for Meridian Partners Ltd. have been updated by the client admin.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 56).toISOString(),
    isRead: true,
    type: 'info',
  },
  {
    id: '13',
    title: 'Penalty Notice Received',
    message:
      'A late-filing penalty notice was issued for Apex Holdings (TY2024). Amount: $2,800. Action required.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isRead: false,
    type: 'error',
  },
  {
    id: '14',
    title: 'Bulk Import Complete',
    message:
      '847 transaction records imported successfully for Silver Oak Realty. 3 rows skipped due to validation errors.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 78).toISOString(),
    isRead: true,
    type: 'warning',
  },
  {
    id: '15',
    title: 'TVR Period Closing Soon',
    message:
      'The Q1 2026 TVR period closes in 48 hours. 6 clients have not yet submitted their returns.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    isRead: false,
    type: 'warning',
  },
  {
    id: '16',
    title: 'Preparer Assigned',
    message:
      'You have been assigned as preparer for Lakewood Industries (TY2025). Review the client profile to get started.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
    isRead: true,
    type: 'info',
  },
  {
    id: '17',
    title: 'Amended Return Filed',
    message:
      'An amended return for Blue Sky Ventures (TY2024) has been filed and is pending authority review.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    isRead: true,
    type: 'info',
  },
  {
    id: '18',
    title: 'Signature Required',
    message:
      'The final return for Crestview Capital requires an authorized signature before e-filing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 130).toISOString(),
    isRead: false,
    type: 'warning',
  },
  {
    id: '19',
    title: 'Refund Processed',
    message:
      'A refund of $6,540 has been processed for Northgate Solutions. Expected in account within 5 business days.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    isRead: true,
    type: 'success',
  },
  {
    id: '20',
    title: 'Document Expiring',
    message:
      'The power of attorney document for Redwood Partners expires in 14 days. Please renew before filing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    isRead: true,
    type: 'warning',
  },
]
