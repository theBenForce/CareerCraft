# Career Craft - Design System & Style Guide

## Overview

This document outlines the design system, styles, and UI patterns used throughout the Career Craft application. The application is built with Next.js 14, React 18, TypeScript, and Tailwind CSS, focusing on a clean, professional interface suitable for job search and networking management.

**📸 Visual References**: Implementation examples and design patterns are illustrated with reference images in `/design/reference-images/`. These images demonstrate real-world application of the design system patterns documented below.

## Core Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v3.3+
- **Icons**: Heroicons v2 (Outline style primarily)
- **Components**: Headless UI for accessible components
- **Typography**: Inter font family
- **Notifications**: React Hot Toast

---

## Color System

### Primary Colors
The application uses a blue-based primary color palette for professional appeal:

```css
primary: {
  50: '#eff6ff',   /* Very light blue background */
  100: '#dbeafe',  /* Light blue background */
  500: '#3b82f6',  /* Base blue */
  600: '#2563eb',  /* Primary button default */
  700: '#1d4ed8',  /* Primary button hover */
}
```

### Semantic Color Usage

#### Light Theme (Current Implementation)
- **Background**: `bg-gray-50` (Main page background)
- **Cards/Containers**: `bg-white` with shadow
- **Text Primary**: `text-gray-900`
- **Text Secondary**: `text-gray-600`
- **Text Muted**: `text-gray-500`
- **Borders**: `border-gray-300`
- **Interactive Elements**: Primary blue scale

#### Proposed Dark Theme Colors
```css
/* Dark theme color tokens (to be implemented) */
--bg-primary-dark: '#0f172a',      /* slate-900 */
--bg-secondary-dark: '#1e293b',    /* slate-800 */
--bg-card-dark: '#334155',         /* slate-700 */
--text-primary-dark: '#f8fafc',    /* slate-50 */
--text-secondary-dark: '#cbd5e1',  /* slate-300 */
--text-muted-dark: '#94a3b8',      /* slate-400 */
--border-dark: '#475569',          /* slate-600 */
```

---

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: `font-sans` (system font stack)

### Type Scale & Hierarchy

```css
/* Page Titles */
.title-xl { @apply text-3xl font-bold text-gray-900; }

/* Section Headers */
.title-lg { @apply text-2xl font-bold tracking-tight text-gray-900; }

/* Card/Component Titles */
.title-md { @apply text-lg font-semibold text-gray-900; }

/* Body Text */
.text-body { @apply text-sm text-gray-600; }

/* Labels */
.text-label { @apply text-sm font-medium text-gray-700; }

/* Captions */
.text-caption { @apply text-xs text-gray-500; }
```

---

## Layout System

### Container & Spacing
- **Max Width**: `max-w-7xl` for main content areas
- **Padding**: `px-4 sm:px-6 lg:px-8` for responsive horizontal padding
- **Vertical Spacing**: `py-6` for sections, `p-6` for cards

### Grid System
- **Responsive Grids**: 
  - Mobile: `grid-cols-1`
  - Tablet: `sm:grid-cols-2`
  - Desktop: `lg:grid-cols-3`
- **Gap**: `gap-6` for consistent spacing between grid items

### Data Display Options
- **Card Layout**: Best for visual content with images, suitable for dashboards and overview pages
- **Table Layout**: Preferred for structured data with multiple columns, better for detailed listings
- **List Layout**: Suitable for simple text-based content with minimal data points

### Page Structure
```
┌─────────────────────────────────────────┐
│ Header (bg-white shadow)                │
├─────────────────────────────────────────┤
│ Main Content (bg-gray-50)               │
│ ┌─────────────────────────────────────┐ │
│ │ Page Header (title + actions)       │ │
│ ├─────────────────────────────────────┤ │
│ │ Content Area                        │ │
│ │ - Cards/Tables/Forms                │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Component Patterns

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg 
         hover:bg-primary-700 focus:outline-none focus:ring-2 
         focus:ring-primary-500 focus:ring-offset-2 transition-colors;
}
```

#### Secondary Button
```css
.btn-secondary {
  @apply bg-gray-200 text-gray-900 px-4 py-2 rounded-lg 
         hover:bg-gray-300 focus:outline-none focus:ring-2 
         focus:ring-gray-500 focus:ring-offset-2 transition-colors;
}
```

#### Button with Icon
```jsx
<button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
  <PlusIcon className="w-4 h-4 mr-2" />
  Add Item
</button>
```

### Cards

#### Standard Card
```css
.card {
  @apply bg-white shadow rounded-lg p-6;
}
```

#### Interactive Card (with hover)
```css
.card-hover {
  @apply bg-white shadow rounded-lg hover:shadow-md 
         transition-shadow duration-200;
}
```

### Form Elements

#### Input Field
```css
.input-field {
  @apply block w-full rounded-md border-gray-300 shadow-sm 
         focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
}
```

#### Form Layout
- **Label**: `text-sm font-medium text-gray-700 mb-1`
- **Input Spacing**: `space-y-4` between form groups
- **Required Fields**: Use asterisk (*) notation

### Navigation

#### Header Navigation
- **Active State**: `text-gray-900 font-medium border-b-2 border-blue-500 pb-1`
- **Inactive State**: `text-gray-600 hover:text-gray-900`
- **Logo/Brand**: `text-2xl font-bold tracking-tight text-gray-900`

### Empty States
```jsx
<div className="text-center py-12">
  <Icon className="mx-auto h-12 w-12 text-gray-400" />
  <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
  <p className="mt-1 text-sm text-gray-500">Description text</p>
  <div className="mt-6">
    <PrimaryButton />
  </div>
</div>
```

---

## Icon System

### Icon Library
- **Primary**: Heroicons v2 (24x24 outline style)
- **Size Standards**:
  - Small: `w-4 h-4` (16px)
  - Medium: `w-5 h-5` (20px)
  - Large: `w-6 h-6` (24px)
  - Extra Large: `w-12 h-12` (48px) for empty states

### Common Icons
- **Add/Create**: `PlusIcon`
- **Users/Contacts**: `UserGroupIcon`
- **Companies**: `BuildingOfficeIcon`
- **Applications**: `BriefcaseIcon`
- **Activities**: `ClockIcon`
- **Email**: `EnvelopeIcon`
- **Phone**: `PhoneIcon`
- **Upload**: `CloudArrowUpIcon`
- **Remove**: `XMarkIcon`
- **Search**: `MagnifyingGlassIcon`
- **Dropdown/Filter**: `ChevronDownIcon`
- **Navigation**: `ChevronLeftIcon`, `ChevronRightIcon`
- **Edit**: `PencilIcon`
- **View**: `EyeIcon`

---

## Animation & Transitions

### Standard Transitions
- **Duration**: `transition-colors` (default 150ms) for color changes
- **Shadow**: `transition-shadow duration-200` for hover effects
- **Opacity**: `transition-opacity duration-150` for show/hide

### Hover States
- **Cards**: Increase shadow (`shadow` → `shadow-md`)
- **Buttons**: Darken background color
- **Links**: Change text color

### Focus States
- **Ring**: `focus:ring-2 focus:ring-offset-2`
- **Ring Color**: Match primary color (`focus:ring-primary-500`)
- **Outline**: `focus:outline-none` to use custom focus ring

---

## Responsive Breakpoints

### Tailwind Breakpoints
- **sm**: 640px (Tablet)
- **md**: 768px (Small Desktop)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large Desktop)

### Responsive Patterns
- **Navigation**: Stack on mobile, horizontal on desktop
- **Grids**: 1 column → 2 columns → 3 columns
- **Padding**: Increase horizontal padding on larger screens
- **Font Sizes**: Scale up headings on larger screens

---

## Accessibility Guidelines

### Color Contrast
- Ensure WCAG AA compliance (4.5:1 contrast ratio)
- Test both light and dark themes

### Focus Management
- Visible focus indicators on all interactive elements
- Logical tab order
- Skip links for navigation

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text
- Form labels associated with inputs

### ARIA Labels
- Use `aria-hidden="true"` for decorative icons
- Provide `aria-label` for icon-only buttons
- Use `aria-describedby` for form field descriptions

---

## Image & Media Guidelines

### Image Upload
- **Supported Formats**: JPEG, PNG, SVG, WebP
- **Maximum Size**: 5MB
- **Categories**: 
  - `logos` (Company logos)
  - `contacts` (Contact profile images)

### Image Display
- **Profile Images**: Circular (`rounded-full`)
- **Logo Images**: Rounded corners (`rounded-lg`)
- **Responsive**: Use Next.js Image component with proper sizing

---

## Dark Theme Implementation (Future)

### Theme Toggle
- Add theme provider context
- Implement system preference detection
- Persist user preference in localStorage

### CSS Variables Approach
```css
:root {
  --bg-primary: theme('colors.gray.50');
  --bg-secondary: theme('colors.white');
  --text-primary: theme('colors.gray.900');
}

[data-theme='dark'] {
  --bg-primary: theme('colors.slate.900');
  --bg-secondary: theme('colors.slate.800');
  --text-primary: theme('colors.slate.50');
}
```

### Component Updates
- Update all color references to use CSS variables
- Test all components in both themes
- Ensure proper contrast ratios

---

## Performance Considerations

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Provide proper alt text

### CSS Optimization
- Purge unused Tailwind classes
- Use component-scoped styles when needed
- Minimize custom CSS

### Animation Performance
- Use transform and opacity for animations
- Avoid animating layout properties
- Use `will-change` sparingly

---

## Code Style Guidelines

### Component Structure
```jsx
// 1. Imports
import Link from 'next/link'
import { Icon } from '@heroicons/react/24/outline'

// 2. Types/Interfaces
interface ComponentProps {
  // props
}

// 3. Component
export default function Component({ props }: ComponentProps) {
  // 4. Hooks and state
  
  // 5. Event handlers
  
  // 6. Effects
  
  // 7. Render
  return (
    <div className="space-y-6">
      {/* Content */}
    </div>
  )
}
```

### Styling Conventions
- Use Tailwind utility classes primarily
- Group related utilities together
- Use responsive prefixes consistently
- Extract complex patterns to CSS components

### File Organization
```
src/
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
└── types/         # TypeScript type definitions
```

---

## Future Enhancements

### Planned Features
1. **Dark Theme**: Complete dark mode implementation
2. **Theme Customization**: User-selectable color schemes
3. **Component Library**: Extract reusable components
4. **Animation Library**: Add micro-interactions
5. **Mobile Optimization**: Enhanced mobile experience

### Design Tokens
Consider implementing a design token system for:
- Consistent spacing scale
- Typography tokens
- Color tokens
- Shadow tokens
- Border radius tokens

---

## Tables

*Reference: See `pages/contacts/contacts-page.png` and `pages/applications/list-applications-page.png` for implementation examples*

#### Data Table Structure
```css
.data-table {
  @apply bg-white shadow rounded-lg overflow-hidden;
}

.table-header {
  @apply bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-row {
  @apply hover:bg-gray-50 px-6 py-4 whitespace-nowrap;
}

.table-cell-primary {
  @apply text-sm font-medium text-gray-900;
}

.table-cell-secondary {
  @apply text-sm text-gray-500;
}

.table-cell-link {
  @apply text-sm text-blue-600 hover:text-blue-800;
}
```

#### Table Avatar Cell
```jsx
<div className="flex items-center">
  <div className="flex-shrink-0 h-10 w-10">
    {/* Avatar or initials */}
  </div>
  <div className="ml-4">
    <div className="text-sm font-medium text-gray-900">
      Name
    </div>
  </div>
</div>
```

#### Responsive Table Considerations
- **Mobile**: Consider card-based layout or stacked view for tables on small screens
- **Tablet**: Allow horizontal scrolling for tables with many columns
- **Desktop**: Full table layout with all columns visible

#### Table Best Practices
- Use hover states for row interaction (`hover:bg-gray-50`)
- Include proper column alignment (left for text, right for numbers)
- Implement sorting indicators in column headers
- Provide loading states for dynamic content
- Use consistent spacing (`px-6 py-4` for cells)

---

## Search & Filter Controls

*Reference: See `pages/contacts/contacts-page.png` for search bar and filter implementation*

#### Search Bar
```css
.search-bar {
  @apply w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
         focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400;
}
```

#### Filter Dropdown Buttons
```css
.filter-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
         bg-white border border-gray-300 rounded-md hover:bg-gray-50;
}

.filter-button-active {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 
         bg-blue-50 border border-blue-300 rounded-md;
}
```

---

## Tag System

*Reference: See tag implementations in `pages/contacts/contacts-page.png` and `pages/applications/list-applications-page.png`*

#### Tag Colors & Variants
```css
/* Status-based tag colors */
.tag-active { @apply bg-green-100 text-green-800; }
.tag-applied { @apply bg-blue-100 text-blue-800; }
.tag-interviewing { @apply bg-yellow-100 text-yellow-800; }
.tag-offer-extended { @apply bg-purple-100 text-purple-800; }
.tag-hired { @apply bg-green-100 text-green-800; }
.tag-default { @apply bg-gray-100 text-gray-800; }
```

#### Tag Component
```jsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  Tag Name
</span>
```

---

## Pagination

#### Standard Pagination
```css
.pagination-container {
  @apply flex items-center justify-between border-t border-gray-200 
         bg-white px-4 py-3 sm:px-6;
}

.pagination-info {
  @apply text-sm text-gray-700;
}

.pagination-nav {
  @apply isolate inline-flex -space-x-px rounded-md shadow-sm;
}

.pagination-button {
  @apply relative inline-flex items-center px-4 py-2 text-sm font-semibold 
         text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
         focus:z-20 focus:outline-offset-0;
}

.pagination-button-active {
  @apply relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 
         text-sm font-semibold text-white focus:z-20 focus-visible:outline 
         focus-visible:outline-2 focus-visible:outline-offset-2 
         focus-visible:outline-blue-600;
}
```

---

## Layout Patterns

*Reference: Layout patterns demonstrated in all reference images*

#### List/Table Page Structure
```
┌─────────────────────────────────────────┐
│ Header (bg-white shadow)                │
├─────────────────────────────────────────┤
│ Main Content (bg-gray-50)               │
│ ┌─────────────────────────────────────┐ │
│ │ Page Header (title + New button)    │ │
│ ├─────────────────────────────────────┤ │
│ │ Search Bar                          │ │
│ ├─────────────────────────────────────┤ │
│ │ Filter Buttons                      │ │
│ ├─────────────────────────────────────┤ │
│ │ Data Table                          │ │
│ │ - Headers                           │ │
│ │ - Rows with avatars & data          │ │
│ ├─────────────────────────────────────┤ │
│ │ Pagination                          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Detail Page Structure
```
┌─────────────────────────────────────────┐
│ Header (bg-white shadow)                │
├─────────────────────────────────────────┤
│ Main Content (bg-gray-50)               │
│ ┌─────────────────────────────────────┐ │
│ │ Page Header (title + actions)       │ │
│ ├─────────────────────────────────────┤ │
│ │ ┌─────────────┐ ┌─────────────────┐ │ │
│ │ │ Primary     │ │ Secondary Info  │ │ │
│ │ │ Information │ │ & Actions       │ │ │
│ │ │ Card        │ │ Card            │ │ │
│ │ │ (2/3 width) │ │ (1/3 width)     │ │ │
│ │ └─────────────┘ └─────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Data Fetching Patterns

#### Server Component with Database Query
```jsx
export default async function ListPage() {
  let data
  try {
    data = await prisma.model.findMany({
      include: {
        relatedModel: {
          select: { id: true, name: true }
        },
        tags: { include: { tag: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw new Error('Failed to load data. Please try again.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Component content */}
    </div>
  )
}
```

### Table Layout Pattern
```jsx
<div className="bg-white shadow rounded-lg overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Column Header
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item) => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            {/* Cell content */}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```
---

## Reference Images & Implementation Examples

This design system is informed by and illustrated with reference images located in `/design/reference-images/`. These images demonstrate the practical application of design patterns and serve as implementation guides.

### Available Reference Images

#### Page Layouts
- **Contacts Pages**:
  - `pages/contacts/contacts-page.png` - Table-based contacts listing with search and filters
  - `pages/contacts/contact-details-page.png` - Individual contact detail view
- **Applications Pages**:
  - `pages/applications/list-applications-page.png` - Job applications listing page
  - `pages/applications/application-details-page.png` - Individual application detail view

### Design Pattern Documentation

The reference images demonstrate several key design patterns that are documented throughout this system:

#### Table-Based Data Display
The contacts and applications listing pages show the implementation of:
- Clean table layouts with proper spacing
- Search bars with icon positioning
- Filter dropdown buttons
- Avatar displays with fallback initials
- Tag systems with status-based color coding
- Pagination controls

#### Detail Page Layouts
The individual detail pages demonstrate:
- Card-based information organization
- Consistent spacing and typography
- Action button placement
- Image handling and display

---

### Avatar Component Pattern

*Reference: See avatar implementations in table rows in `pages/contacts/contacts-page.png`*

#### Contact Avatar with Fallback
```jsx
{contact.image ? (
  <Image 
    className="h-10 w-10 rounded-full" 
    src={contact.image} 
    alt={`${contact.firstName} ${contact.lastName}`}
    width={40}
    height={40}
  />
) : (
  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
    <span className="text-sm font-medium text-white">
      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
    </span>
  </div>
)}
```

#### Avatar Sizes
- **Small**: `h-8 w-8` (32px) with `text-xs`
- **Medium**: `h-10 w-10` (40px) with `text-sm` 
- **Large**: `h-12 w-12` (48px) with `text-base`
- **Extra Large**: `h-16 w-16` (64px) with `text-lg`

---

## Detail Page Layouts

*Reference: See `pages/contacts/contact-details-page.png` and `pages/applications/application-details-page.png` for detail page patterns*

### Card-Based Information Display
Detail pages use a card-based layout to organize information into logical sections:

#### Detail Page Structure
```jsx
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Page Header with Title and Actions */}
  <div className="mb-6">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Entity Name
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Subtitle or description
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">Edit</Button>
        <Button>Action</Button>
      </div>
    </div>
  </div>

  {/* Main Content Cards */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Primary Information Card */}
    <div className="lg:col-span-2">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Primary content */}
      </div>
    </div>
    
    {/* Secondary Information Card */}
    <div className="lg:col-span-1">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Secondary content */}
      </div>
    </div>
  </div>
</div>
```

#### Information Section Patterns
- **Primary Card**: Main entity information, largest content area
- **Secondary Card**: Related information, metadata, actions
- **Responsive Layout**: Stacks on mobile, side-by-side on desktop
- **Consistent Spacing**: Use `p-6` for card padding, `gap-6` between cards

---

## Page Layout Patterns

*Reference: All page layouts follow patterns shown in reference images*

### List/Table Pages
- **Header**: Fixed navigation with consistent branding
- **Page Title**: Left-aligned with primary action button on right
- **Search Section**: Full-width search bar with icon
- **Filters**: Horizontal filter buttons below search
- **Content**: Table with hover states and proper spacing
- **Pagination**: Bottom-aligned with count information

### Detail Pages  
- **Header**: Consistent with list pages
- **Page Title**: Entity name with edit/action buttons
- **Content Grid**: Responsive card layout (2/3 + 1/3 split on desktop)
- **Information Cards**: Organized by importance and relationship
- **Actions**: Primary actions in header, secondary in cards

---

## Visual Design Principles

Based on the reference images, the application follows these key visual principles:

#### Information Hierarchy
- **Page Titles**: Large, bold typography establishes clear page context
- **Section Headers**: Medium weight typography for content organization  
- **Data Labels**: Small, muted text for field labels and metadata
- **Primary Actions**: Prominent button styling for main user actions

#### Visual Consistency
- **Spacing**: Consistent 24px (`gap-6`) spacing between major elements
- **Card Shadows**: Subtle shadows (`shadow`) for depth without distraction
- **Border Radius**: Consistent rounded corners (`rounded-lg`) for modern feel
- **Color Usage**: Blue accents for interactive elements, gray scale for content

#### Professional Appearance
- **Clean Lines**: Minimal borders and clean separation between content areas
- **Readable Typography**: Sufficient contrast and font sizes for professional use
- **Organized Layout**: Logical content grouping and clear visual relationships
- **Accessible Design**: High contrast ratios and clear interactive states

#### Responsive Behavior
- **Mobile-First**: Content stacks vertically on smaller screens
- **Progressive Enhancement**: Additional features and layout complexity on larger screens
- **Touch-Friendly**: Adequate tap targets and spacing for mobile interaction
- **Content Priority**: Most important information remains visible across all screen sizes
