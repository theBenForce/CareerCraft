# GitHub Copilot Instructions - Personal CRM

## Project Overview

This is a Personal CRM application built for job search and networking management. The application helps users track contacts, companies, job applications, activities, and notes in a professional, organized manner.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Custom components
- **Icons**: Heroicons v2 (24x24 outline style)
- **Notifications**: React Hot Toast

## Key Files & References

- **Database Schema**: See `#file:../prisma/schema.prisma` for all data models and relationships
- **Design System**: Follow guidelines in `#file:../DESIGN_SYSTEM.md` for all UI/UX decisions
- **Components**: Located in `src/components/` with existing patterns to follow

## Database Schema Overview

Refer to `#file:../prisma/schema.prisma` for complete details. Key models include:

- **User**: Main user entity with cascading relationships
- **Company**: Organizations with industry, website, location, logo
- **Contact**: People associated with companies, including contact details and social links
- **JobApplication**: Job applications tied to companies with status tracking
- **Activity**: Communications and interactions with tracking for contacts and companies
- **Tag**: Flexible tagging system for categorizing entities
- **Note**: General notes with tagging support

### Important Relationships
- Users own all data (cascade delete)
- Contacts can be associated with Companies (optional)
- Activities can be linked to Companies, Contacts, and JobApplications
- Tags can be applied to Contacts, Companies, and Activities via junction tables

## Design System Guidelines

Follow the design system documented in `#file:../DESIGN_SYSTEM.md`:

### Colors
- **Primary**: Blue color palette (`bg-blue-600`, `text-blue-600`, etc.)
- **Background**: `bg-gray-50` for main areas, `bg-white` for cards
- **Text**: `text-gray-900` (primary), `text-gray-600` (secondary), `text-gray-500` (muted)
- **Borders**: `border-gray-300`

### Typography
- **Font**: Inter font family
- **Titles**: Use `text-2xl font-bold tracking-tight text-gray-900` for page headers
- **Subtitles**: Use `text-lg font-semibold text-gray-900` for section headers
- **Body**: Use `text-sm text-gray-600` for regular text

### Layout Patterns
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Cards**: `bg-white shadow rounded-lg p-6`
- **Spacing**: Use `space-y-6` for vertical spacing, `gap-6` for grids
- **Grids**: Responsive with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Component Patterns
- **Buttons**: 
  - Primary: `bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700`
  - Secondary: `bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300`
- **Forms**: Use consistent field styling with proper labels and spacing
- **Navigation**: Active states with border-bottom indicators

## Coding Guidelines

### File Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── contacts/          # Contact management pages
│   ├── companies/         # Company management pages
│   ├── applications/      # Job application pages
│   └── activities/        # Activity tracking pages
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components (buttons, inputs, etc.)
│   └── layout/           # Layout components (header, navigation)
├── lib/                  # Utilities and configurations
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

### TypeScript Patterns
- Always use TypeScript for type safety
- Define interfaces for all component props
- Use Prisma-generated types when working with database entities
- Create custom types in `src/types/index.ts` for shared interfaces

### Component Guidelines
1. **Use functional components** with hooks
2. **Import order**: External libraries → Internal components → Types
3. **Props destructuring**: Destructure props in function signature
4. **Event handlers**: Use descriptive names (e.g., `handleSubmit`, `handleDelete`)
5. **State management**: Use React hooks, consider Context for shared state

### API Route Patterns
- Follow RESTful conventions:
  - `GET /api/contacts` - List contacts
  - `POST /api/contacts` - Create contact
  - `GET /api/contacts/[id]` - Get specific contact
  - `PUT /api/contacts/[id]` - Update contact
  - `DELETE /api/contacts/[id]` - Delete contact
- Always handle errors appropriately
- Use proper HTTP status codes
- Include user authentication/authorization checks

### Database Operations
- Use Prisma Client for all database operations
- Always include proper error handling
- Use transactions for complex operations
- Include proper relationships in queries using `include` or `select`
- Handle cascade deletes appropriately (defined in schema)

### Styling Guidelines
- **Prefer Tailwind utilities** over custom CSS
- **Responsive design**: Mobile-first approach with sm:, md:, lg: prefixes
- **Focus states**: Always include focus styles for accessibility
- **Hover effects**: Use subtle transitions and color changes
- **Loading states**: Include loading indicators for async operations

### Icon Usage
- Use Heroicons v2 (outline style preferred)
- Standard sizes: `w-4 h-4` (small), `w-5 h-5` (medium), `w-6 h-6` (large)
- Common icons:
  - Add: `PlusIcon`
  - Users: `UserGroupIcon`
  - Companies: `BuildingOfficeIcon`
  - Jobs: `BriefcaseIcon`
  - Activities: `ClockIcon`

### Form Handling
- Use React Hook Form for complex forms
- Include proper validation with clear error messages
- Use consistent field styling and spacing
- Include loading states during submission
- Handle both client and server-side validation

### Image Handling
- Use Next.js Image component for optimization
- Support file uploads to `/public/uploads/` with proper categorization
- Handle multiple file types (JPEG, PNG, SVG, WebP)
- Include proper alt text for accessibility

## Common Patterns to Follow

### Page Component Structure
```typescript
import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { SomeIcon } from '@heroicons/react/24/outline'

interface PageProps {
  // Define any props
}

const PageName: NextPage<PageProps> = () => {
  // State and hooks
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // Effects and handlers
  useEffect(() => {
    // Fetch data
  }, [])

  const handleAction = () => {
    // Handle user actions
  }

  // Loading state
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Page Title
        </h1>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        {/* Page content */}
      </div>
    </div>
  )
}

export default PageName
```

### API Route Structure
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Handle GET request
    const data = await prisma.model.findMany()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validate and process data
    const result = await prisma.model.create({ data: body })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Accessibility Requirements

- Include proper ARIA labels for screen readers
- Ensure keyboard navigation works for all interactive elements
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Use semantic HTML elements
- Ensure color contrast meets WCAG AA standards
- Include focus indicators for all interactive elements

## Performance Considerations

- Use Next.js Image component for image optimization
- Implement proper loading states for better UX
- Use React.memo() for expensive components
- Optimize database queries with proper indexing
- Minimize bundle size by importing only needed components

## Error Handling

- Always include try-catch blocks for async operations
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Include fallback UI for error states
- Handle network failures gracefully

## Security Best Practices

- Validate all user inputs (client and server-side)
- Use parameterized queries (Prisma handles this)
- Implement proper authentication/authorization
- Sanitize file uploads
- Use HTTPS in production
- Protect against SQL injection and XSS

When suggesting code, always:
1. Follow the established patterns in this codebase
2. Reference the design system for styling decisions
3. Use the correct database schema and relationships
4. Include proper TypeScript types
5. Handle errors appropriately
6. Consider accessibility and responsive design
7. Follow the component and file structure patterns
