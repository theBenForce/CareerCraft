# Personal CRM - Design System & Style Guide

## Overview

This document outlines the design system, styles, and UI patterns used throughout the Personal CRM application. The application is built with Next.js 14, React 18, TypeScript, and Tailwind CSS, focusing on a clean, professional interface suitable for job search and networking management.

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

This design system ensures consistency, accessibility, and maintainability across the Personal CRM application. Regular updates to this document should reflect any changes or additions to the design patterns.
