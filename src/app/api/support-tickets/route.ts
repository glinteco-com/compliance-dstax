import { Ticket, ApiResponse } from '@/types/support-ticket'
import { NextRequest, NextResponse } from 'next/server'

let mockData: Ticket[] = [
  {
    id: 'TICK-1001',
    createdDate: '2024-03-15',
    name: 'Login Issue',
    priority: 'high',
    email: 'user1@example.com',
    summary: 'Cannot login to the application',
    description: 'When I enter my credentials, it just refreshes the page.',
    dueDate: '2024-03-20',
  },
  {
    id: 'TICK-1002',
    createdDate: '2024-03-14',
    name: 'Dashboard not loading',
    priority: 'high',
    email: 'user2@example.com',
    summary: 'Blank screen after login',
    description: 'The dashboard widgets are not showing up.',
    dueDate: '2024-03-18',
  },
  {
    id: 'TICK-1003',
    createdDate: '2024-03-13',
    name: 'Question about reports',
    priority: 'normal',
    email: 'user3@example.com',
    summary: 'How to export PDF?',
    description: 'I need to know where the export button for PDF reports is.',
    dueDate: '2024-03-25',
  },
  {
    id: 'TICK-1004',
    createdDate: '2024-03-12',
    name: 'Mobile responsive issue',
    priority: 'low',
    email: 'user4@example.com',
    summary: 'Website not displaying correctly on mobile devices.',
    description:
      'When I view the website on my phone, elements overlap and are unreadable.',
  },
  {
    id: 'TICK-1005',
    createdDate: '2024-03-11',
    name: 'Feature request: export CSV',
    priority: 'normal',
    email: 'user5@example.com',
    summary: 'Request for CSV export functionality in reports.',
    description:
      'It would be great to have an option to export data from reports in CSV format for further analysis.',
  },
  {
    id: 'TICK-1006',
    createdDate: '2024-03-10',
    name: 'Broken Link on Homepage',
    priority: 'high',
    email: 'user6@example.com',
    summary: 'Link to "About Us" page is not working.',
    description:
      'Clicking on the "About Us" link in the navigation bar leads to a 404 error.',
  },
  {
    id: 'TICK-1007',
    createdDate: '2024-03-09',
    name: 'Payment Gateway Error',
    priority: 'high',
    email: 'user7@example.com',
    summary: 'Unable to complete purchases.',
    description:
      'Users are reporting that transactions are failing at the payment step with a generic error message.',
    dueDate: '2024-03-16',
  },
  {
    id: 'TICK-1008',
    createdDate: '2024-03-08',
    name: 'UI Glitch in User Profile',
    priority: 'normal',
    email: 'user8@example.com',
    summary: 'Avatar not displaying correctly.',
    description:
      'My profile picture is not showing up and instead there is a broken image icon.',
  },
  {
    id: 'TICK-1009',
    createdDate: '2024-03-07',
    name: 'Email Notification Delay',
    priority: 'low',
    email: 'user9@example.com',
    summary: 'Getting email notifications very late.',
    description:
      'I receive order confirmation emails several hours after placing an order.',
  },
  {
    id: 'TICK-1010',
    createdDate: '2024-03-06',
    name: 'Incorrect Data in Report',
    priority: 'high',
    email: 'user10@example.com',
    summary: 'Sales report shows wrong figures.',
    description:
      'The sales data for last month in the generated report does not match our internal records.',
    dueDate: '2024-03-14',
  },
  {
    id: 'TICK-1011',
    createdDate: '2024-03-05',
    name: 'Password Reset Not Working',
    priority: 'high',
    email: 'user11@example.com',
    summary: 'Unable to reset password.',
    description:
      'When I try to reset my password, I never receive the reset email.',
  },
  {
    id: 'TICK-1012',
    createdDate: '2024-03-04',
    name: 'New User Registration Bug',
    priority: 'normal',
    email: 'user12@example.com',
    summary: 'Registration form fails on submission.',
    description:
      'Users are unable to create new accounts; the form hangs after clicking submit.',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.max(1, Number(searchParams.get('page_size') ?? 10))
  const search = searchParams.get('search')?.toLowerCase() ?? ''
  const priorityFilter = searchParams.get('priority')?.toLowerCase()

  let filteredData = mockData

  if (priorityFilter) {
    filteredData = filteredData.filter(
      (item) => item.priority.toLowerCase() === priorityFilter
    )
  }

  if (search) {
    filteredData = filteredData.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.summary?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search)
    )
  }

  const count = filteredData.length
  const totalPages = Math.ceil(count / pageSize)
  const results = filteredData.slice((page - 1) * pageSize, page * pageSize)

  const buildUrl = (p: number) => {
    const url = new URL(request.url)
    url.searchParams.set('page', String(p))
    url.searchParams.set('page_size', String(pageSize))
    if (search) url.searchParams.set('search', search)
    if (priorityFilter) url.searchParams.set('priority', priorityFilter)
    return url.toString()
  }

  return NextResponse.json<ApiResponse<Ticket>>({
    count,
    next: page < totalPages ? buildUrl(page + 1) : null,
    previous: page > 1 ? buildUrl(page - 1) : null,
    page_size: pageSize,
    results,
  })
}

// POST for creating a new ticket
export async function POST(request: NextRequest) {
  const newTicket: Ticket = await request.json()

  // Generate a new ID for the ticket
  const newId = `TICK-${Math.floor(Math.random() * 10000) + 2000}`
  const ticketWithId = {
    ...newTicket,
    id: newId,
    createdDate: new Date().toISOString().split('T')[0],
  }
  mockData.push(ticketWithId)

  return NextResponse.json(ticketWithId, { status: 201 })
}

// PUT for updating an existing ticket
export async function PUT(request: NextRequest) {
  const updatedTicket: Ticket = await request.json()
  const index = mockData.findIndex((ticket) => ticket.id === updatedTicket.id)

  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...updatedTicket }
    return NextResponse.json(mockData[index])
  } else {
    return NextResponse.json({ message: 'Ticket not found' }, { status: 404 })
  }
}

// DELETE for deleting a ticket
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { message: 'Ticket ID is required' },
      { status: 400 }
    )
  }

  const initialLength = mockData.length
  mockData = mockData.filter((ticket) => ticket.id !== id)

  if (mockData.length < initialLength) {
    return NextResponse.json(
      { message: 'Ticket deleted successfully' },
      { status: 200 }
    )
  } else {
    return NextResponse.json({ message: 'Ticket not found' }, { status: 404 })
  }
}
